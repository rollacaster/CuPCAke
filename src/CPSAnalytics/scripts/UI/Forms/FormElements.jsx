import React from 'react';
import {Input} from 'react-bootstrap';
import {Button} from '../index';
import BootstrapDatePicker from 'react-bootstrap-datetimepicker';
import BootstrapDatePickerCSS from 'react-bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css';
import moment from 'moment';
import ReactSelect from 'react-select';
import ReactSelectCSS from 'react-select/dist/default.css';

/**
 * A dropdown form element.
 * @class
 * @augments external:Component
 * @memberOf module:UI/Forms
 * @param {string} id - Id of the dropdown.
 * @param {string} title - Title of the dropdown.
 * @param {bool} multiple - True if dropdown can have multiple selected entries.
 */
export const Dropdown = React.createClass({
  mixins: [Formsy.Mixin],

  propTypes: {
    id: React.PropTypes.string.isRequired,
    title: React.PropTypes.string.isRequired,
    name: React.PropTypes.string.isRequired,
    multiple: React.PropTypes.bool,
    options: React.PropTypes.array.isRequired
  },

  changeValue(value, selectedOptions) {
    if (this.props.multiple) {
      this.setValue(selectedOptions.map(option => option.value));
    } else {
      this.setValue(value);
    }
  },

  render() {
    var className = this.showRequired() ? 'required' : this.showError() ? 'error' : null;

    var errorMessage = this.getErrorMessage();

    return (
      <div className={'form-group' + (className ? ' ' + className : '') }>
          <label htmlFor={this.props.id}>{this.props.title}</label>
          <ReactSelect
          ref="select"
          id={this.props.id}
          name={this.props.name}
          multi={this.props.multiple}
          onChange={this.changeValue}
          value={this.getValue()}
          options={this.props.options}
          />
          <span className='error-message'>{errorMessage}</span>
      </div>
    );
  }
});

/**
 * A radio buttons form element.
 * @class
 * @augments external:Component
 * @memberOf module:UI/Forms
 * @param {String[]} buttons - Names of the radio buttons
 */
export const RadioButtons = React.createClass({
  mixins: [Formsy.Mixin],

  propTypes: {
    buttons: React.PropTypes.arrayOf(React.PropTypes.string)
  },

  getInitialState: function() {
    pressed: false
  },

  changeInputs: function(button) {
    this.setValue(button)
  },

  render: function() {
    const {
      buttons,
      label,
     ...others
    } = this.props;
    const {pressed} = this.state

    const {id, type, text} = this.props;
    const className =  this.showRequired() ? 'has-warning radioElement' :
                       this.showError() ? 'has-error radioElement' : 'radioElement';

    const errorMessage = this.getErrorMessage();


    return (
      <div className={className}>
          {label? <label className="control-label" htmlFor="radio">
           <span>{label}</span>
           </label>: ''
           }
           <div className='radio__buttons'>
               {buttons.map(button => {
                 const isPressed = this.getValue() === button;

                 return (
                   <Button {...others} text={button} key={button}
                   onClick={this.changeInputs.bind(null, button)}
                   success={isPressed} />
                 )
                })}
           </div>
      </div>
    );
  }
});

/**
 * An input form element.
 * @class
 * @augments external:Component
 * @memberOf module:UI/Forms
 * @param {string} text - Text of the input.
 * @param {string} type - type of the input.
 * @param {string} id - id of the input.
 */
export const FormInput = React.createClass({
  mixins: [Formsy.Mixin],

  propTypes: {
    text: React.PropTypes.string,
    type: React.PropTypes.string,
    id: React.PropTypes.string,
  },

  getDefaultProps: function() {
    return {
      type: 'text'
    }
  },

  changeInputs: function(e) {
    const {type} = this.props;

    if (type === 'checkbox') {
      this.setValue(e.target.checked);
    } else {
      this.setValue(e.target.value);
    }
  },

  render: function() {
    const {id, type, text, after} = this.props;
    const className =  this.showRequired() ? 'warning' :
                       this.showError() ? 'error' : null;

    const errorMessage = this.getErrorMessage();

    return (
      <div className="form__field">
          <Input label={text} type={type} id={id}
                 onChange={this.changeInputs} value={this.getValue()}
                 bsStyle={className} hasFeedback addonAfter={after}/>
          <span>{errorMessage}</span>
      </div>
    );
  }
});

/**
 * A date picker form element.
 * @class
 * @augments external:Component
 * @memberOf module:UI/Forms
 */
export const DatePicker = React.createClass({
  propTypes: {
    name: React.PropTypes.string
  },

  mixins: [Formsy.Mixin],

  changeInputs: function(timestamp) {
    this.setValue(timestamp);
  },

  render: function() {
    return (
      <div className="form__field">
          <label htmlFor={this.props.id}>
              {this.props.text}:
          </label>
          <BootstrapDatePicker onChange={this.changeInputs}
                               dateTime={this.getValue()}
                               inputFormat="MM/DD/YY h:mm A"/>
      </div>
    );
  }
});

/**
 * A button form element.
 * @class
 * @augments external:Component
 * @memberOf module:UI/Forms
 * @param {string} id - Id of the form button.
 */
export const FormButton = React.createClass({
  propTypes: {
    id: React.PropTypes.string.isRequired
  },

  mixins: [Formsy.Mixin],

  changeInputs: function(id) {
    this.setValue(id);
  },

  render: function() {
    const {id} = this.props;
    return (
      <Button {...this.props} onClick={this.changeInputs.bind(id)}/>
    );
  }
});
