import React from 'react';
import {Popover, OverlayTrigger} from 'react-bootstrap';
import {Dropdown, FormInput, RadioButtons} from '../UI/Forms/FormElements';
import OPCBrowser from './OPCBrowserComponent';
import _ from 'ramda';
import {Modal, Button, Title} from '../UI';
import {attributeTypes} from '../Helpers/Constants';
import {cpsBuilder} from '../Helpers/Constants/Help';
import CPSActions from './CPSActions';
import {get} from '../Helpers/AjaxHelper'

/**
 * Shows, create, deletes and updates an Entity.
 * Allows to specify attributes for an Entity.
 * @class
 * @augments external:Component
 * @memberOf module:CPSConfigurator
 * @param {string} name - The name of the entity.
 * @param {string} cpsId - The cpsId of the entity's CPS.
 * @param {string} typeId - The cpsId of the entity's entity type.
 * @param {string} entityId - The id of the entity.
 * @param {object[]} subscriptions - The subscriptions of the entity.
 * @param {string} subscriptions[].id - The id of the subscription.
 * @param {object} subscriptions[].subscription - The subscription.
 * @param {string} subscriptions[].subscription.subscription - The value of the subscription.
 * @param {string} subscriptions[].subscription.connection - The connection of the subscription.
 * @param {string} subscriptions[].subscription.modeling - The modeling of the subscription.
 * @param {string[]} subscriptions[].subscription.sensed - The sensed attributes of the subscription.
 * @param {object} subscriptions[].subscription.statics - The static attributes of the subscription.
 * @param {string[]} connections - List of connection URLs.
 */
export default class EntityDetails extends React.Component {
  static propTypes = {
    name: React.PropTypes.string,
    cpsId: React.PropTypes.string,
    typeId: React.PropTypes.string,
    entityId: React.PropTypes.string,
    subscriptions: React.PropTypes.object,
    connections: React.PropTypes.arrayOf(React.PropTypes.string),
  }

  handleCreate = (connection, subscription, sensed, statics) => {
    const {cpsId, typeId, entityId} = this.props;
    let modeling = 'JSON';
    if (connection.startsWith('opc')) {
      modeling = 'opc';
    }
    const subscriptionData = {
      connection,
      subscription,
      sensed,
      modeling,
      statics
    }

    CPSActions.createSubscription(cpsId, typeId, entityId, subscriptionData);
  }

  handleResubscribe = (id) => {
    const {cpsId, typeId,  entityId, subscriptions} = this.props;
    for (let [subscriptionId, subscription] of subscriptions) {
      if (subscriptionId === id) {
        CPSActions.updateSubscription(cpsId, typeId, entityId, id, subscription);
      }
    }
  }

  handleDelete = (id) => {
    const {cpsId, typeId,  entityId} = this.props;
    CPSActions.deleteSubscription(cpsId, typeId, entityId, id);
  }

  render() {
    const {name, subscriptions, connections, cpsId, entityId} = this.props;
    const subscriptionComponents = [];

    for (let [subscriptionId, subscription] of subscriptions) {
      subscriptionComponents.push(
        <Attribute subscription={subscription.subscription} key={subscriptionId}
                   id={subscriptionId} name={subscription.sensed[0]}
                   onDelete={this.handleDelete} onResubscribe={this.handleResubscribe}/>
      )
    }

    return (
      <Modal id={entityId} title={name} wide text={name}>
          <div>
              <Title name="Attributes" help={cpsBuilder.attributes} small/>
              <ul className="list-group entity">
                  {subscriptionComponents}
              </ul>
              <div className="well">
                  <h4 className="items__title">Create Attribute:</h4>
                  <SubscriptionBrowser cps={cpsId} connections={connections}
                                       onSubscriptionCreate={this.handleCreate}/>
              </div>
          </div>
      </Modal>
    );
  }
}

class Attribute extends React.Component {
  static propTypes = {
    name: React.PropTypes.string,
    id: React.PropTypes.string,
    subscription: React.PropTypes.string,
    onResubscribe: React.PropTypes.func,
    onDelete: React.PropTypes.func,
  }

  render() {
    const {subscription, name, onResubscribe, onDelete, id} = this.props;

    const overlay = (
      <Popover title='Actions'>
          <ul className="list-group">
              <li className="list-group-item">{subscription}</li>
          </ul>
          <div className="button__group">
              <Button text='Resubscribe' onClick={onResubscribe.bind(null, id)} mwide primary/>
              <Button text='Delete' onClick={onDelete.bind(null, id)} mwide primary/>
          </div>
      </Popover>
    );

    return (
      <OverlayTrigger trigger='click' placement='bottom'
                      rootClose={true} overlay={overlay}>
          <Button text={name} listItem />
      </OverlayTrigger>
    );
  }
}

class SubscriptionBrowser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      connection: this.props.connections[0]
    };
  }

  static propTypes = {
    cps: React.PropTypes.string,
    onSubscriptionCreate: React.PropTypes.func,
    connections: React.PropTypes.arrayOf(React.PropTypes.string)
  }

  handleSubscriptionCreate = formData => {
    const {onSubscriptionCreate} = this.props;
    const {connection} = this.state;
    const sensed = [formData.attribute];
    const subscription = formData.subscription;
    const statics = {type: formData.attributeType};

    onSubscriptionCreate(connection, subscription, sensed, statics);
  }

  handleConnectionSelect = connectionDropDown => {
    const {cps} = this.props;
    const connection = connectionDropDown.connection || this.state.connection;
    this.setState({connection});

    const subscriptionBrowser = (
      <FormInput name='subscription' text='Subscribe to' id='subscription' required/>
    );

    const isOPCConnection = connection.indexOf('opc') == 0;
    if (isOPCConnection) {
      get(`cps/${cps}/browse?connection=${connection}`).then(
        (nodes) => {
          if (nodes.length > 0) {
            this.setState({subscriptionBrowser: (
              <OPCBrowser name="subscription" cps={cps}
                          connection={connection}
                          initialNodes={nodes} required/>
            )});
          } else {
            this.setState({subscriptionBrowser});
          }
        }
      );
    } else {
      this.setState({subscriptionBrowser});
    }
  }

  enableButton = () => { this.setState({canSubmit: true}) }

  disableButton = () => { this.setState({canSubmit: false}) }

  render() {
    const {connections} = this.props;
    const {canSubmit, subscriptionBrowser} = this.state;

    return (
      <div>
          <SubscriptionConnectionDropDown connections={connections}
                                          onConnectionSelect={this.handleConnectionSelect}/>
          <Formsy.Form onValidSubmit={this.handleSubscriptionCreate} onValid={this.enableButton}
                       onInvalid={this.disableButton} onChange={this.handleTypeChange}
                       className="form">
              <RadioButtons name="attributeType" buttons={attributeTypes}
                            label='Attribute Type' value={attributeTypes[0]} required/>
              <FormInput name="attribute" type="text" text="Attribute Name" required/>
              {subscriptionBrowser}
              <Button text="Create Attribute" type="submit" disabled={!canSubmit} primary wide/>
          </Formsy.Form>
      </div>
    );
  }

  componentDidMount() {
    this.handleConnectionSelect({connection: this.state.connection});
  }
}

class SubscriptionConnectionDropDown extends React.Component {
  static propTypes = {
    connections: React.PropTypes.arrayOf(React.PropTypes.string),
    onConnectionSelect: React.PropTypes.func
  }

  render() {
    const {connections, onConnectionSelect} = this.props;
    const extractOptions = _.map(connection => {
      return {
        label: connection,
        value: connection
      }
    });

    return (
      <Formsy.Form onChange={onConnectionSelect}>
          <Dropdown name="connection" title="Choose connection:" id="connectionDropDown"
                    options={extractOptions(connections)}
                    value={connections[0]}/>
      </Formsy.Form>
    );
  }
}
