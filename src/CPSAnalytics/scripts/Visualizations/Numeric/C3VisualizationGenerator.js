import _ from 'ramda';
import c3 from 'c3';
import c3css from 'c3/c3.min.css';
import moment from 'moment';

/**
 * Create a C3 configuration object.
 * @param {object} data - The visualization data.
 * @param {string[]} labels - The labels.
 * @param {string} id - The id of the visualization container.
 * @param {object} options - The options for the C3 visualization.
 * @inner
 * @memberOf module:Visualizations/Numeric
*/
export function createVisualzation(data, labels, id, options) {
  let timeColumn = [];
  timeColumn = transformTime(data[labels[0]]);
  const c3Data = {
    bindto: `#${id}`,
    data: {
      x: 'x',
      xFormat: '%Y-%m-%d %H:%M:%S',
      columns: [timeColumn]
    },
    axis: {
      x: {
        type: 'timeseries',
        tick: {
          format: '%Y-%m-%d %H:%M:%S',
          count: 5
        }
      }
    }
  };

  return c3.generate(_.mergeAll([c3Data, ...options]));
}

/**
 * Updates a C3 visualization.
 * @param {external:C3Visualization} visualization - The C3 visualization.
 * @param {string[]} attributes - The attributes.
 * @param {object} data - The visualization data.
 * @inner
 * @memberOf module:Helpers
*/
export function updateVisualization(visualization, attributes, data) {
  for (let attribute of attributes) {
    const c3Column = transformData(data[attribute], attribute);
    const timeColumn = transformTime(data[attribute]);
    const loadData = {
      columns: [timeColumn, c3Column]
    };
    visualization.load(loadData);
  }
}

function transformData(data, label) {
  const y = [];
  y.push(label);

  for (let datapoint of data) {
    if (datapoint) {
      y.push(datapoint.value);
    }
  }

  return y;
}

function transformTime(data) {
  const time = ['x'];

  for (let datapoint of data) {
    if (datapoint) {
      time.push(moment(datapoint.time).format('YYYY-MM-DD hh:mm:s'));
    }
  }

  return time;
}

/**
 * A C3 Visualization.
 * @external C3Visualization
 * @see {@link http://c3js.org/reference.html}
*/
