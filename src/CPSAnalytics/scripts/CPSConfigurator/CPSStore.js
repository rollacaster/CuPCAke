import alt from '../../alt';
import CPSActions from './CPSActions';
import NotificationActions from '../UI/NotificationActions';
import {cpsNotify, typeNotify, entityNotify, subscriptionNotify} from '../Helpers/Constants/Notifications';
import _ from 'ramda';
import {attributeTypes} from '../Helpers/Constants';

/**
 * Stores the state of a CPS.
 * @class
 * @memberOf module:CPSConfigurator
 * @augments external:Store
 */
class CPSStore {
  constructor() {
    this.bindActions(CPSActions);
    this.allCPS = [];
    this.activeCPS = {_id: 'CPS', name: 'CPS', types: new Map()};
    this.error = null;
  }

  /**
   * Loads all CPSs.
   * @function onLoadCPSSuccess
   * @param {object[]} allCPS - The response of the GET request.
   * @param {string} allCPS[].name - The name of a CPS.
   * @param {string} allCPS[].connections - The connections of a CPS.
   * @throws Will throw an error if the request send an error.
   * @instance
   * @memberOf module:CPSConfigurator.CPSStore
   */
  onLoadCPSSuccess(allCPS) {
    this.setState({allCPS});
  }

  onLoadCPSFail(err) {
    console.error('Failed to load all CPSs: ', err);
  }

  /**
   * Loads the state of an active CPS.
   * @function onLoadCPSDataSuccess
   * @param {object} activeCPS - The data of a CPS.
   * @param {object[]} activeCPS.types - The types of a CPS.
   * @param {object[]} activeCPS.types[].name - The name of an entity type.
   * @param {object[]} activeCPS.types[].entities - The entities of an entity type.
   * @param {object[]} activeCPS.types[].entities[].name - The name of an entity.
   * @param {object[]} activeCPS.types[].entities[].subscriptions - The subscriptions of an entity.
   * @param {string} activeCPS.types[].entities[].subscriptions[].subscription - The value of the subscription.
   * @param {string} activeCPS.types[].entities[].subscriptions[].connection - The connection of the subscription.
   * @param {string} activeCPS.types[].entities[].subscriptions[].modeling - The modeling of the subscription.
   * @param {string[]} activeCPS.types[].entities[].subscriptions[].sensed - The sensed attributes of the subscription.
   * @param {object} activeCPS.types[].entities[].subscriptions[].statics - The static attributes of the subscription.
   * @todo Refactor function with simpler data structure or multiple structures?
   * @throws Will throw an error if the request send an error.
   * @instance
   * @memberOf module:CPSConfigurator.CPSStore
   */
  onLoadCPSDataSuccess(activeCPS) {
    this.setState({activeCPS});
  }

  onLoadCPSDataFail(err) {
    console.error('Failed to load CPS: ', err);
  }

  /**
   * Saves the state of a CPS.
   * @function onCreateCPS
   * @param {object} cps - The CPS.
   * @param {string} cps.name - The name of the CPS.
   * @param {string[]} cps.connections - The connections of the CPS.
   * @throws Will throw an error if the request send an error.
   * @instance
   * @memberOf module:CPSConfigurator.CPSStore
   */
  onCreateCPSSuccess(cps) {
    NotificationActions.notify.defer(cpsNotify.create.success());
    this.allCPS = this.allCPS.concat(cps);
  }

  onCreateCPSFail(err) {
    NotificationActions.notify.defer(cpsNotify.create.error(err));
    console.error('Failed to create CPS: ', err);
  }

  /**
   * Saves the state of entity types.
   * @function onCreateTypesSuccess
   * @param {object[]} types - The entity types.
   * @param {string} types[].name - The name of an entity type.
   * @throws Will throw an error if the request send an error.
   * @instance
   * @memberOf module:CPSConfigurator.CPSStore
   */
  onCreateTypesSuccess(types) {
    NotificationActions.notify.defer(entityNotify.create.success());
    for (let type of types) {
      type.entitys = new Map();
      this.activeCPS.types.set(type._id, type);
    }
  }

  onCreateTypesFail(err) {
    NotificationActions.notify.defer(typeNotify.create.error());
    console.error('Failed to create Type: ', err);
  }

  /**
   * Saves the state of entities.
   * @function onCreateEntitysSuccess
   * @param {object} response - The reponse of GET request.
   * @param {object} response.typeId - The id of an entity type.
   * @param {object} response.entitys - The entities.
   * @param {string} response.entitys[].name - The name of an entity.
   * @throws Will throw an error if the request send an error.
   * @instance
   * @memberOf module:CPSConfigurator.CPSStore
   */
  onCreateEntitysSuccess(response) {
    NotificationActions.notify.defer(entityNotify.create.success());
    const {typeId, entitys} = response;
    const type = this.activeCPS.types.get(typeId);

    for (let entity of entitys) {
      entity.subscriptions = new Map();
      type.entitys.set(entity._id, entity);
    }

    this.activeCPS.types.set(typeId, type);
  }

  onCreateEntitysFail(err) {
    NotificationActions.notify.defer(entityNotify.create.error());
    console.error('Failed to create Entity: ', err);
  }

  /**
   * Saves the state of a subscriptions
   * @function onCreateSubscriptionSucccess
   * @param {object} response - The reponse of GET request.
   * @param {object} response.typeId - The id of an entity type.
   * @param {object} response.entityId - The id of an entity.
   * @param {object} response.subscription - The subscription.
   * @param {string} response.subscription.subscription - The value of the subscription.
   * @param {string} response.subscription.connection - The connection of the subscription.
   * @param {string} response.subscription.modeling - The modeling of the subscription.
   * @param {string[]} response.subscription.sensed - The sensed attributes of the subscription.
   * @param {object} response.subscription.statics - The static attributes of the subscription.
   * @throws Will throw an error if the request send an error.
   * @instance
   * @memberOf module:CPSConfigurator.CPSStore
   */
  onCreateSubscriptionSuccess(response) {
    NotificationActions.notify.defer(subscriptionNotify.create.success(response));
    const {typeId, entityId, subscription} = response;
    const entity = this.activeCPS.types.get(typeId).entitys.get(entityId);
    entity.subscriptions.set(subscription._id, subscription);
  }

  onCreateSubscriptionFail(err) {
    NotificationActions.notify.defer(subscriptionNotify.create.error(err));
    console.error('Failed to create Subscription: ', err);
  }

  /**
   * Updates the state of a subscription.
   * @function onUpdateSubscriptionSuccess
   * @param {object} response - The reponse of GET request.
   * @param {object} response.typeId - The id of an entity type.
   * @param {object} response.entityId - The id of an entity.
   * @param {object} response.subscriptionId - The id of an subscription.
   * @param {object} response.subscription - The updated subscription.
   * @param {string} response.subscription.subscription - The value of the subscription.
   * @param {string} response.subscription.connection - The connection of the subscription.
   * @param {string} response.subscription.modeling - The modeling of the subscription.
   * @param {string[]} response.subscription.sensed - The sensed attributes of the subscription.
   * @param {object} response.subscription.statics - The static attributes of the subscription.
   * @throws Will throw an error if the request send an error.
   * @instance
   * @memberOf module:CPSConfigurator.CPSStore
   */
  onUpdateSubscriptionSuccess(response) {
    NotificationActions.notify.defer(subscriptionNotify.update.success(response));
    const {subscription, subscriptionId, typeId, entityId} = response;
    this.activeCPS.types.get(typeId).entitys.get(entityId)
      .subscriptions.set(subscriptionId, subscription);
  }

  onUpdateSubscriptionFail(err) {
    NotificationActions.notify.defer(subscriptionNotify.update.error(err));
    console.error('Failed to update Subscription: ', err);
  }

  /**
   * Deletes the state of a subscriptions
   * @function onDeleteSubscriptionSuccess
   * @param {object} response - The reponse of GET request.
   * @param {object} response.typeId - The id of an entity type.
   * @param {object} response.entityId - The id of an entity.
   * @param {object} response.subscriptionId - The id of an subscription.
   * @throws Will throw an error if the request send an error.
   * @instance
   * @memberOf module:CPSConfigurator.CPSStore
   */
  onDeleteSubscriptionSuccess(response) {
    NotificationActions.notify.defer(subscriptionNotify.remove.success(response));
    const {subscriptionId, typeId, entityId} = response;
    const entity = this.activeCPS.types.get(typeId).entitys.get(entityId);
    entity.subscriptions.delete(subscriptionId);
  }

  onDeleteSubscriptionFail(err) {
    NotificationActions.notify.defer(subscriptionNotify.remove.error(err));
    console.error('Failed to remove Subscription: ', err);
  }
}

export default alt.createStore(CPSStore, 'CPSStore');
