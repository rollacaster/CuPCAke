import React from 'react';
import {Panel, Badge} from 'react-bootstrap';
import simpleStatistics from 'simple-statistics';
import _ from 'ramda';

/**
 * Shows a statistics a numeric visualization.
 * @class
 * @memberOf module:Visualizations/Numeric
 * @augments external:Component
 * @param {string[]} labels - List of labels  of the visualization.
 * @param {object} data - Data of the visualization.
*/
export default class VisualizationStats extends React.Component {
  static propTypes = {
    data: React.PropTypes.object,
    labels: React.PropTypes.arrayOf(React.PropTypes.string)
  }

  countData(data, labels) {
    let dataProcessed = 0;
    for (let label of labels) {
      if (data[label]) {
        dataProcessed += data[label].length;
      }
    }
    return dataProcessed;
  }


  render() {
    const {data, labels} = this.props;
    const processed = this.countData(data,labels);
    const c10 = d3.scale.category10().domain(labels);

    return (
      <Panel header="Statistics">
          <p>Data processed <Badge>{processed}</Badge></p>
          <div className="visstats__attribute">
              {labels.map(label =>
                <AttributeStats attribute={label}
                data={data[label]} key={label}
                color={c10(label)}/>
               )}
          </div>
      </Panel>
    );
  }
}

class AttributeStats extends React.Component {
  render() {
    const {attribute, data, color} = this.props;
    const values = [];

    for (let dataPoint of data) {
      if (dataPoint) {
        values.push(dataPoint.value);
      }
    }

    const header = (
      <div style={{backgroundColor: color,
                   color: 'white',
                   textAlign: 'center',
                   borderRadius: 5}}>
          {attribute}
      </div>
    );

    return (
      <Panel header={header}>
          <p>Mean <Badge>{Math.round(simpleStatistics.mean(values) * 100) / 100}</Badge></p>
          <p>Standard Deviation <Badge>{Math.round(simpleStatistics.standard_deviation(values) * 100) / 100}</Badge></p>
          <p>Median <Badge>{Math.round(simpleStatistics.median(values) * 100) / 100}</Badge></p>
      </Panel>
    );
  }
}
