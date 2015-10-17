import React, {PropTypes} from 'react';
import {Panel} from 'react-bootstrap';
import ReactSelect from 'react-select';
import {FormInput, Dropdown} from '../../UI/Forms/FormElements';

/**
 * Shows options to customize a numeric visualization.
 * @class
 * @memberOf module:Visualizations/Numeric
 * @augments external:Component
 * @param {string[]} labels - List of labels  of the visualization.
 * @param {function} onOptionChange - Option callback.
*/
export default class VisualizationOptions extends React.Component {
  static propTypes = {
    labels: PropTypes.arrayOf(PropTypes.string),
    onOptionChange: PropTypes.func
  }

  render() {
    const {labels, onOptionChange} = this.props;

    const options = [
      {label: 'Line', value: 'line'},
      {label: 'Bar', value: 'bar'},
      {label: 'Scatter', value: 'scatter'},
      {label: 'Spline', value: 'spline'},
      {label: 'Area', value: 'area'},
      {label: 'Area Spline', value: 'area-spline'},
      {label: 'Pie', value: 'pie'},
      {label: 'Donut', value: 'donut'}
    ]

    return (
      <Formsy.Form onChange={onOptionChange}>
      <div className="items well">
      <div>
      Visualization options:
                     <FormInput type="checkbox" text="Show subchart" name="subchart" />
      <FormInput type="checkbox" text="Enable Zoom" name="zoom"/>
      </div>
      {labels.map((label, index) => {
        const name = `type${index}`

        return (
          <Panel header={label} key={label}>
              <Dropdown id={name} title='Visualization Type' options={options} name={name}/>
          </Panel>
        );
      })}
      </div>
          </Formsy.Form>
    );
  }

  componentDidMount() {
    const {labels} = this.props;
    const types = [];

    for (let label of labels) {
      types.push({attribute: label, type: 'line'});
    }

    this.setState({types});
  }
}
