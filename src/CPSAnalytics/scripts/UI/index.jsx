/** @module UI */
import React, {PropTypes} from 'react';
import * as rb from 'react-bootstrap';
import {FormInput} from '../UI/Forms/FormElements';
import cx from 'classnames';
import { Link } from 'react-router';
import ModalStore from './ModalStore';
import ModalActions from './ModalActions';
import connectToStores from 'alt/utils/connectToStores';

/**
 * A button UI element.
 * @class
 * @augments external:Component
 * @memberOf module:UI
 * @param {string} id - Id of the button.
 * @param {string} text - Text of the button.
 * @param {bool} active - True if button is active else false.
 * @param {bool} primary - True if button is a primary button else false.
 * @param {bool} success - True if button is a success button else false.
 * @param {bool} xs - True if button is a extra small button else false.
 * @param {bool} wide - True if button is a wide button else false.
 * @param {bool} listItem - True if button is a list item else false.
 * @param {function} onClick - Click callback.
 */
export class Button extends React.Component {
  static propTypes = {
    id: PropTypes.string,
    text: PropTypes.string,
    active: PropTypes.bool,
    primary: PropTypes.bool,
    success: PropTypes.bool,
    xs: PropTypes.bool,
    wide: PropTypes.bool,
    listItem: PropTypes.bool,
    onClick: PropTypes.func
  }

  render() {
    const {id, onClick, children, text,
           primary, success, xs, large,
           wide, listItem, active, mwide,
           disabled } = this.props;

    const classes = cx(
      'btn',
      'btn-default',
      {
        'btn-primary': primary,
        'btn-success': success,
        'btn-xs': xs,
        'btn-large': large,
        'btn--wide': wide,
        'list-group-item': listItem,
        'active': active,
        'btn--multi-wide': mwide,
        'disabled': disabled
      }
    );

    const type = this.props.type || 'button';

    return (
      <button type={type} id={id} onClick={onClick}
              className={classes}>
          {children}
          <span id={id}>{text}</span>
      </button>
    );
  }
}

/**
 * A modal UI element.
 * @class
 * @augments external:Component
 * @memberOf module:UI
 */
class ModalComponent extends React.Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    text: PropTypes.string,
  }
  static getStores() {
    return [ModalStore];
  }

  static getPropsFromStores() {
    return {
      modals: ModalStore.getState().modals
    }
  }

  render() {
    let {
      id,
      children,
      text,
      modals,
      ...others
    } = this.props

    const showModal = modals.get(id) ? modals.get(id) : false;

    return (
      <Button id={id} onClick={ModalActions.toogleModal} text={text} {...others}>
          <rb.Modal show={showModal} onHide={ModalActions.toogleModal.bind(null, id)}>
              <rb.Modal.Header closeButton>
                  <rb.Modal.Title>{text}</rb.Modal.Title>
              </rb.Modal.Header>
              <rb.Modal.Body>
                  {children}
              </rb.Modal.Body>
          </rb.Modal>
      </Button>
    );
  }
};

export const Modal = connectToStores(ModalComponent);

/**
 * A Title UI element with help texts.
 * @class
 * @augments external:Component
 * @memberOf module:UI
 * @param {string} name - Name of the title.
 * @param {string} help - Help text of the title.
 */
export class Title extends React.Component {
  static propTypes = {
    name: PropTypes.string,
    help: PropTypes.string
  }


  render() {
    const {name, help} = this.props;
    const tooltip = (<rb.Tooltip>{help}</rb.Tooltip>);

    return (
      <div className="content__title">
          <h4>{name}</h4>
          <rb.OverlayTrigger placement="left" overlay={tooltip} trigger="click">
              <Button><rb.Glyphicon glyph='question-sign' /></Button>
          </rb.OverlayTrigger>
      </div>

    );
  }
}

/**
 * Radio buttons UI element.
 * @class
 * @augments external:Component
 * @memberOf module:UI
 * @param {UI~Button[]} List of buttons.
 * @param {string} label - Label for the radio buttons.
 * @param {function} onSelected - Select callback.
 */
export class RadioButtons extends React.Component{
  static propTypes = {
    buttons: PropTypes.arrayOf(React.PropTypes.object),
    label: PropTypes.string,
    onSelected: PropTypes.func
  }

  render() {
    const {
      buttons,
      label,
      selected,
      onClick,
     ...others
    } = this.props;

    let index = 0;

    return (
      <div className="radioElement">
          {label? <label className="control-label" htmlFor="radio">
           <span>{label}</span>
           </label>: ''
           }
           <div className='radio__buttons'>
               {buttons.map(button => {
                 const key = button.text + index;
                 const isSelected = selected == button.text;
                 index++;

                 return (
                   <Button {...others} text={button.text} key={key}
                   onClick={onClick.bind(null, button.value)}
                   success={isSelected} />
                 )
                })}
           </div>
      </div>
    );
  }
}

/**
 * A button UI element with a link.
 * @class
 * @augments external:Component
 * @memberOf module:UI
 * @param {string} link - Link of button.
 */
export class LinkButton extends React.Component {
  static propTypes = {
    link: React.PropTypes.string,
  }

  render() {
    const {
      link,
      wide,
      ...others
    } = this.props;

    const classes = cx(
      {
        'btn--wide': this.props.wide,
      }
    );

    return (
      <Link to={link} className={classes}>
      <Button  {...others} wide/>
      </Link>
    );
  }
}
