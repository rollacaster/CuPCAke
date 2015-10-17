import React, {PropTypes} from 'react';
import * as c3 from './C3VisualizationGenerator';

/**
 * Shows a visualization of numeric values.
 * @class
 * @memberOf module:Visualizations/Numeric
 * @augments external:Component
 * @param {string} id - Id of the visualization.
 * @param {object} data - Data of the visualization.
 * @param {string[]} labels - List of labels  of the visualization.
 */
export default class Visualization extends React.Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    data: PropTypes.object.isRequired,
    labels: PropTypes.arrayOf(PropTypes.string).isRequired,
    options: PropTypes.object
  }

  state = {
    visualization: ''
  }

  render() {
    const {id, labels, options} = this.props;
    const {visualization} = this.state;


    return (
      <div id={id} className="visualization"/>
    );
  }

  componentWillReceiveProps(nextProps) {
    const {options, data, labels, id} = this.props;

    let visOptions = [];

    if (nextProps.options.subchart) {
      visOptions.push({subchart: {show: true}});
      this.setState({visualization: c3.createVisualzation(data, labels, id, visOptions)});
    }
    if (nextProps.options.zoom) {
      visOptions.push({zoom: {enabled: true}});
      this.setState({visualization: c3.createVisualzation(data, labels, id, visOptions)});
    }
  }

  componentDidUpdate() {
    const {visualization} = this.state;
    const {id, labels, data, options} = this.props;

    c3.updateVisualization(visualization, labels, data);

    let index = 0;
    for (let label of labels) {
      const type = options[`type${index}`];
      if (type) {
        visualization.transform(type, label);
      }
      index++;
    }
  }

  componentDidMount() {
    const {data, labels, id} = this.props;
    this.setState({visualization: c3.createVisualzation(data, labels, id, [])});
  }
}
