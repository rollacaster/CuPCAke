/** @module Dashboard */
import React from 'react';
import NumericVisualization from '../Visualizations/Numeric/VisualizationComponent';
import {BeaconContainer} from '../Visualizations/Position';
import VisualizationActions from '../Visualizations/VisualizationActions';
import VisualizationStore from '../Visualizations/VisualizationStore';
import connectToStores from 'alt/utils/connectToStores';
import {attributeTypes} from '../Helpers/Constants';

/**
 * Shows an overview of all saved visualizations. The visualizations
 * are loaded from cookies of the browser. Receives all props from
 * {@link module:Visualizations.VisualizationStore}
 * @class
 * @augments external:Component
 * @listens Stores~VisualizationStore
 */
@connectToStores
export default class Dashboard extends React.Component {
  static getStores() {
    return [VisualizationStore];
  }

  static getPropsFromStores() {
    return {
      VisualizationStore: VisualizationStore.getState()
    }
  }

  render() {
    const {visData} = this.props.VisualizationStore;
    const visualizations = JSON.parse(localStorage.getItem('dashboard')) || [];
    let  index = 0;
    return (
      <div className="dashboard">
      {visualizations.length > 0 ? visualizations.map(savedVisualization => {
        const id = `vis${index}`;
        const {subscription, options} = savedVisualization;
        const {topic, name, queryType} = subscription;

        const data = visData.get(topic);
        let labels = [];
        let dataReceived
        if (data) {
          labels = Object.keys(data);
          dataReceived = labels.length > 0;
        }

        let visualization = 'No data received.';
        if (dataReceived && queryType === attributeTypes[0]) {
          visualization = (
            <NumericVisualization data={data} labels={labels} id={id} options={options} />
          );
        } else if (dataReceived && queryType === attributeTypes[1]) {
          const {allBeacons, sizeInMeter, background} = options;
          visualization = (
            <BeaconContainer id={id} data={data} allBeacons={allBeacons}
                     sizeInMeter={sizeInMeter} background={background}/>
          );
        }

        index++;
        return (
          <div className="dashboard__visualization" key={id}>
              <h4>{name}</h4>
              {visualization}
          </div>);
      }) : <span>No saved visualizations.</span>}
      </div>
    );
  }

  componentDidMount() {
    const visualizations = JSON.parse(localStorage.getItem('dashboard')) || [];
    visualizations.forEach(visualization => {
      const {subscription} = visualization;
      if(subscription.queryType === attributeTypes[0]) {
        VisualizationActions.startStream({contextSubscription: subscription, numeric: true});
      } else {
        VisualizationActions.startStream({contextSubscription: subscription});
      }
    });
  }

  componentWillUnmount() {
    const visualizations = JSON.parse(localStorage.getItem('dashboard')) || [];
    visualizations.forEach(visualization => {
      const {subscription} = visualization;
      if (subscription.realtime) {
        VisualizationActions.stopStream(subscription.topic);
      }
    });
  }
}
