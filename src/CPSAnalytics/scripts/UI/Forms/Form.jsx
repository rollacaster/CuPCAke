/** @module UI/Forms */
import React, {PropTypes} from 'react';
import Formsy from 'formsy-react';
import {FormInput} from './FormElements';
import {Modal, Button} from '../index';

/**
 * A form with a multi input field.
 * @class
 * @augments external:Component
 * @param {string} multi - Name of the multi field.
 * @param {string} multiText - Text of the multi field.
 * @param {string} validations - Validation rules for the multi field.
 * @param {string} validationError - Validation error messages for the multi field.
 * @param {function} onSubmit - Submit callback.
 */
class MultiInputForm extends React.Component {
  static propTypes = {
    multi: PropTypes.string,
    multiText: PropTypes.string,
    validations: PropTypes.string,
    validationError: PropTypes.string,
    onSubmit: PropTypes.func
  }

  state = { fieldCount: 1 }

  addField = () => { this.setState({fieldCount: ++this.state.fieldCount}) }
  removeField = () => { this.setState({fieldCount: --this.state.fieldCount}) }

  enableButton = () => { this.setState({canSubmit: true}) }
  disableButton = () => { this.setState({canSubmit: false}) }

  submit = formData => {
    const submitData = this.groupMultiInputToArray(formData);
    this.props.onSubmit(submitData);
  }

  groupMultiInputToArray(formData) {
    const groupedData = {};
    const {multi} = this.props;
    const multis = [];

    for(let key of Object.keys(formData)) {
      const formValue = formData[key];

      if (this.isMulti(key)) {
        multis.push(formValue);
      } else {
        groupedData[key] = formValue;
      }
    }

    groupedData[multi] = multis;
    return groupedData;
  }

  isMulti(formKey) {
    return formKey.startsWith(this.props.multi);
  }

  render() {
    const fields = [];
    const {fieldCount} = this.state;
    const {validations, validationError, multi, multiText, children} = this.props

    for(let i = 0; i < fieldCount; i++) {
      fields.push(<FormInput name={multi + i} validations={validations}
                             key={multi + i} validationError={validationError}
                             required/>);
    }

    return (
      <Formsy.Form onValidSubmit={this.submit} onValid={this.enableButton} onInvalid={this.disableButton}>
          <div className="form">
              {children}
              <div id={multi} className="form__field">
                  <label htmlFor={multi}>
                      {multiText}
                  </label>
                  {fields}
              </div>
              <div className="button__group">
                  <Button text={`Add ${this.props.multiText}`} onClick={this.addField} mwide>
                      <span className="glyphicon glyphicon-plus"></span>
                  </Button>
                  {fieldCount > 1 ?
                   <Button text={`Remove ${this.props.multiText}`} onClick={this.removeField}
                   mwide>
                   <span className="glyphicon glyphicon-minus"></span>
                   </Button> : ''}
              </div>
              <Button text="Create" disabled={!this.state.canSubmit} type="submit" primary/>
          </div>
      </Formsy.Form>
    );
  }
};

/**
 * A form for the creation of multple objects in an modal.
 * @class
 * @augments external:Component
 * @param {string} id - Id of the form.
 * @param {string} title - Title of the form.
 * @param {string} multi - Name of the multi field .
 * @param {function} onCreate - Create callback.
 */
export class CreateForm extends React.Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    title: PropTypes.string,
    multi: PropTypes.string,
    onCreate: PropTypes.func
  }

  render() {
    const {title, multi, onCreate, id, ...others} = this.props;

    const text = `Create ${title}`;
    const multiText = `${multi.charAt(0).toUpperCase() + multi.substring(1)}`;

    return (
      <Modal id={id} text={text} primary wide={others.wide}>
          <MultiInputForm multi={multi} multiText={multiText}
                          onSubmit={onCreate} {...others} />
      </Modal>
    )
  }
}
