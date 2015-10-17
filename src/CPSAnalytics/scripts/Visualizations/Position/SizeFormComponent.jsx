import React, {PropTypes} from 'react';
import Formsy from 'formsy-react';
import {FormInput} from '../../UI/Forms/FormElements';
import BeaconActions from './BeaconActions';

/**
 * Default size of the BeaconArea.
 * @default
 * @memberOf module:Visualizations/Position
 */
const defaultSize = 20;

/**
 * Represents a form to resize the
 * {@link module:Visualizations/Position.BeaconArea}.
 * @class
 * @memberOf module:Visualizations/Position
 * @augments external:Component
 */
export default class SizeForm extends React.Component {
  changeAreaSize(formData) {
    const {width, height} = formData;
    BeaconActions.setSizeInMeter({width: parseFloat(width),
                                  height: parseFloat(height)});
  }

  render() {
    return (
      <Formsy.Form onChange={this.changeAreaSize} className="beaconpos__form">
          <FormInput name="width" text="Width" after="meter" value={defaultSize}
                     isRequired validations="isNumeric"/>
          <FormInput name="height" text="Height" after="meter" value={defaultSize}
                     isRequired validations="isNumeric"/>
      </Formsy.Form>
    );
  }
}
