import alt from '../../alt';
import qs from 'qs';
import VisualizationActions from './VisualizationActions';
import {post, remove} from '../Helpers/AjaxHelper';
import MQTTClient from '../Helpers/MQTTBrowserClient';
import BeaconStore from './Position/BeaconStore';

/**
 * Stores the state of all visualizations.
 * @class
 * @memberOf module:Visualizations
 * @augments external:Store
 */
class VisualizationStore {
  constructor() {
    this.bindActions(VisualizationActions);
    this.visData = new Map();
    this.client = new MQTTClient(contextGeneratorWS);
    this.listeners = new Map();
  }

  /**
   * @see {@link module:Visualizations.VisualizationActions#startStream}
   * @function onStartStream
   * @instance
   * @memberOf module:Visualizations.VisualizationStore
   */
  onStartStream({contextSubscription, numeric}) {
    const {topic, realtime} = contextSubscription;
    this.client.subscribe(topic).then(() => {
      const listener = (recTopic, data) => {
        if (recTopic === topic) {
          VisualizationActions.newData.defer({visData: JSON.parse(data), topic, numeric, realtime});
        }
      };

      this.listeners.set(topic, listener);
      this.client.receive(listener);
      post(`context`, contextSubscription);
    });
  }

  /**
   * @see {@link module:Visualizations.VisualizationActions#stopStream}
   * @function onStopStream
   * @instance
   * @memberOf module:Visualizations.VisualizationStore
   */
  onStopStream(topic) {
    this.client.unsubscribe(topic);
    this.client.stopReceive(this.listeners.get(topic));
    remove(`context?topic=${topic}`);
    this.visData.delete(topic);
  }

  /**
   * @see {@link module:Visualizations.VisualizationActions#newData}
   * @function onNewData
   * @instance
   * @memberOf module:Visualizations.VisualizationStore
   */
  onNewData({visData, topic, numeric, realtime}) {
    //TODO Do not concat visData as soon as C3 is replaced
    if (numeric) {
      const labels = Object.keys(visData);
      const oldVisData = this.visData.get(topic);
      const {concat, shorten} = dataHelper;
      const data = shorten(concat(labels, visData, oldVisData), realtime);
      this.visData.set(topic, data);
    } else {
      this.visData.set(topic, visData);
    }
  }
}

const dataHelper = {
  concat(labels, newData, data = {}) {
    for (let label of labels) {
      if (!data[label]) {
        data[label] = [];
      }

      data[label] = data[label].concat(newData[label]);
    }

    return data;
  },

  shorten(data, realtime) {
    if (realtime) {
      while (data.length > 100) {
        data.shift();
      }
    }

    return data;
  }
};

export default alt.createStore(VisualizationStore, 'VisualizationStore');
