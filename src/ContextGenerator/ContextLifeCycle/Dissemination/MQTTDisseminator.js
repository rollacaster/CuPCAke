import _ from 'ramda';
import assign from 'object-assign';
import MQTTConnection from '../Acquisition/MQTT/MQTTConnection';
import config from '../../Config/Environment';
import * as helper from '../../Helper/FunctionalHelper';

const mqtt = new MQTTConnection(config.mqttBroker);
mqtt.connect();

/**
 * Extracts contexts according to queries that specify which information should be subscribed,
 * via the MQTT protocol.
 * @memberOf module:ContextLifeCycle/Dissemination
 * @class
 */
export default class MQTTDisseminator {
  constructor({topic, queries}, bufferTimeInSeconds) {
    this.topic = topic;
    this.queries = queries;
    this.bufferTimeInSeconds = bufferTimeInSeconds * 1000;
    this.labels = helper.concatProp('label', this.queries);
    this.publishData = {};
    this.publishInterval = this.initiatePublish();
  }

  /**
   * Checks if a context containts information which is of interest for the ContextSubscription
   * @function contextUpdate
   * @memberOf module:ContextLifeCycle/Dissemination.MQTTDisseminator
   * @instance
   * @param {module:Storage/Context.Context} context - The context.
   */
  contextUpdate(context) {
    this.checkDone(context);

    for (let query of this.queries) {
      if (context.cps === query.cps) {

        //TODO Use Maybes to clean up code; tell client sth was not found
        const extractData = _.compose(
          (attributes) => {
            if (attributes) {
              return _.prop(query.attribute, attributes);
            }
          },

          (entity) => {
            if (entity) {
              return _.prop('attributes', entity);
            }
          },

          _.find(entity =>
            entity.type === query.type &&
            entity.name === query.entity),
          _.prop('entities')
        );
        const data = extractData(context);
        if (data) {
          this.concatPublishData(data, query.label);
        }
      }
    }
  }

  /**
   * Initiates an interval that publishes context information wich fit to the subscription.
   * @function initiatePublish
   * @memberOf module:ContextLifeCycle/Dissemination.MQTTDisseminator
   * @instance
   */
  initiatePublish() {
    return setInterval(() => {
      const attributes = Object.keys(this.publishData);
      const isFoundAttribute = attributes.length > 0;

      if (isFoundAttribute) {
        mqtt.publish(this.topic, this.publishData);
        this.resetPublishData();
      }
    }, this.bufferTimeInSeconds);
  }

  /**
   * Resets all data which is saved for publishing.
   * @function resetPublishData
   * @memberOf module:ContextLifeCycle/Dissemination.MQTTDisseminator
   * @instance
  */
  resetPublishData() {
    for (let label of this.labels) {
      this.publishData[label] = [];
    }
  }

  /**
   * Checks if the disemination of context is finished. This can only happen if the context data
   * is originated in the database.
   * @function checkDone
   * @param {module:Storage/Context.Context} context - The last context that was loaded.
   * @param {function} publishInterval - An interval that publishes context data.
   * @memberOf module:ContextLifeCycle/Dissemination.MQTTDisseminator
   * @instance
  */
  checkDone(context, publishInterval) {
    if (context.done) {
      console.log('done');
      mqtt.publish(this.topic, this.publishData);
      clearInterval(this.publishInterval);
    }
  }

  /**
   * Concatenates data matching a ContextSubscription with data that already matched the
   * ContextSubscription.
   * @function concatPublishData
   * @param {object} data - The new data.
   * @param {string} label - A label descrbing this data.
   * @memberOf module:ContextLifeCycle/Dissemination.MQTTDisseminator
   * @instance
  */
  concatPublishData(data, label) {
    const labels = Object.keys(this.publishData);
    const labelData = this.publishData[label];
    const alreadyStoredData = labels.indexOf(label) > -1 &&
    this.publishData[label].length >= 1;

    if (alreadyStoredData) {
      const recentDataPoint = labelData[labelData.length - 1];
      if (recentDataPoint && recentDataPoint.value !== data.value) {
        this.publishData[label] = this.publishData[label].concat(data);
      }
    }
    else {
      this.publishData[label] = [assign({}, data)];
    }
  }
}
