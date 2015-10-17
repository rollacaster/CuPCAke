/** @module Visualizations/Numeric */
import React, { PropTypes } from 'react';
import Visualization from './VisualizationComponent';
import VisualizationStats from './VisualizationStatsComponent';
import VisualizationOptions from './VisualizationOptionsComponent';
import {Title} from '../../UI';
import {visBuilder} from '../../Helpers/Constants/Help';

/**
 * Holds a visualization of numeric values, statistics
 * and options to customize the visualization.
 * @class
 * @memberOf module:Viusalizations/Numeric
 * @augments external:Component
 * @param {object} data - Data of the visualization.
 * @param {string[]} labels - List of labels  of the visualization.
*/
export default class VisualizationContainer extends React.Component {
  static propTypes = {
    labels: PropTypes.arrayOf(PropTypes.string),
    data: PropTypes.object,
    options: PropTypes.object,
    onOptionChange: PropTypes.func
  }

  render() {
    const {data, labels, options, onOptionChange} = this.props

    return (
      <div className="visualization">
          <Title name="Visualization" help={visBuilder.visualization} medium/>
          <VisualizationOptions onOptionChange={onOptionChange}
                                labels={labels}/>
          <div className="visualization">
              <Visualization data={data} labels={labels}
                             id={'builder'} options={options} />
          </div>
          <VisualizationStats data={data} labels={labels}/>
      </div>
    );
  }
}
