import alt from '../../alt';
import {modals} from '../Helpers/Constants';
import ModalActions from '../UI/ModalActions';
import {get, post, put, remove} from '../Helpers/AjaxHelper';

/**
 * Actions that allow to mutate the state of a CPS.
 * @class
 * @memberOf module:CPSConfigurator
 * @augments external:Action
 */
class CPSActions {
  constructor() {
    this.generateActions('getAttributes');
  }

  /**
   * Loads all available CPSs.
   * @function loadCPS
   * @instance
   * @memberOf module:CPSConfigurator.CPSActions
   */
  loadCPS() {
    get(`cps`).then(allCPS => this.dispatch(allCPS))
              .catch(err => this.dispatch({isError: true, err}));
  }

  /**
   * Loads all data of one CPS.
   * @function loadCPSData
   * @param {string} cpsId - The id of the CPS.
   * @instance
   * @memberOf module:CPSConfigurator.CPSActions
   */
  loadCPSData(cpsId) {
    let activeCPS = {};
    get(`cps/${cpsId}`)
      .then(cps => {
        activeCPS = cps;
        return get(`cps/${cpsId}/types`);
      })

      .then(types => {
        activeCPS.types = new Map();

        const loadEntitys = [];
        const loadSubscriptions = [];

        for (let type of types) {
          type.entitys = new Map();
          activeCPS.types.set(type._id, type);
          loadEntitys.push(
            get(`cps/${cpsId}/types/${type._id}/entitys`).then(entitys => {
              for (let entity of entitys) {
                entity.subscriptions = new Map();
                type.entitys.set(entity._id, entity);
                loadSubscriptions.push(
                  get(`cps/${cpsId}/types/${type._id}/entitys/${entity._id}/subscriptions`).then(subscriptions => {
                    for (let subscription of subscriptions) {
                      entity.subscriptions.set(subscription._id, subscription);
                    }
                  }));
              }

              return Promise.all(loadSubscriptions);
            }));
        }

        return Promise.all(loadEntitys);
      }).then(allLoaded => this.dispatch({activeCPS}))

      .catch(err => this.dispatch({isError: true, err}));
  }

  /**
   * Creates a new CPS.
   * @function createCPS
   * @instance
   * @param {object} cps - The new CPS.
   * @param {string} cps.name - The name of the CPS.
   * @param {string[]} cps.connections - The connections of the CPS.
   * @memberOf module:CPSConfigurator.CPSActions
   */
  createCPS(cps) {
    post(`cps`, cps)
      .then((cps) => {
        this.dispatch(cps);
        ModalActions.toogleModal.defer(modals.createCPS);
      })

      .catch(err => this.dispatch({isError: true, err}));
  }

  /**
   * Creates a new entity types.
   * @function createTypes
   * @instance
   * @param {string} cpsId - The id of a CPS.
   * @param {object[]} types - A list of entity types.
   * @param {string} types[].name - The name of an entity type.
   * @memberOf module:CPSConfigurator.CPSActions
   */
  createTypes(cpsId, types) {
    const pendingTypes = [];

    for (let type of types) {
      pendingTypes.push(post(`cps/${cpsId}/types`, {name: type}));
    }

    Promise.all(pendingTypes)
                  .then(types => {
                    this.dispatch(types);
                    ModalActions.toogleModal.defer(modals.createType);
                  })

                  .catch(err => this.dispatch({isError: true, err}));
  }

  /**
   * Creates a new entities.
   * @function createEntitys
   * @instance
   * @param {string} cpsId - The id of a CPS.
   * @param {string} typeId - The id of a type.
   * @param {string} typeName - The name of a type.
   * @param {object[]} entities - A list of entities.
   * @param {string} entities[].name - The name of an entity.
   * @memberOf module:CPSConfigurator.CPSActions
   */
  createEntitys(cpsId, typeId, typeName, entitys) {
    const pendingEntitys = [];

    for (let entity of entitys) {
      pendingEntitys.push(post(`cps/${cpsId}/types/${typeId}/entitys`, {name: entity}));
    }

    Promise.all(pendingEntitys)
                    .then(entitys => {
                      this.dispatch({entitys, typeId});
                      ModalActions.toogleModal.defer(modals.createEntity + typeName);
                    })

                    .catch(err => this.dispatch({isError: true, err}));
  }

  /**
   * Creates a new subscription.
   * @function createSubscription
   * @instance
   * @param {string} cpsId - The id of a CPS.
   * @param {string} typeId - The id of a type.
   * @param {string} entityId  - The id of a entity.
   * @param {object} subscription - The new subscription.
   * @param {string} subscription.subscription - The value of the subscription.
   * @param {string} subscription.connection - The connection of the subscription.
   * @param {string} subscription.modeling - The modeling of the subscription.
   * @param {string[]} subscription.sensed - The sensed attributes of the subscription.
   * @param {object} subscription.statics - The static attributes of the subscription.
   * @memberOf module:CPSConfigurator.CPSActions
   */
  createSubscription(cpsId, typeId, entityId, subscription) {
    post(`cps/${cpsId}/types/${typeId}/entitys/${entityId}/subscriptions`, subscription)
      .then(subscription => this.dispatch({typeId, entityId, subscription}))
      .catch(err => this.dispatch({isError: true, err}));
  }

  /**
   * Updates a subscription.
   * @function updateSubscription
   * @instance
   * @param {string} cpsId - The id of a CPS.
   * @param {string} typeId - The id of a type.
   * @param {string} entityId  - The id of a entity.
   * @param {string} subscriptionId  - The id of a subscription.
   * @param {object} subscription - The updated subscription.
   * @param {string} subscription.subscription - The value of the subscription.
   * @param {string} subscription.connection - The connection of the subscription.
   * @param {string} subscription.modeling - The modeling of the subscription.
   * @param {string[]} subscription.sensed - The sensed attributes of the subscription.
   * @param {object} subscription.statics - The static attributes of the subscription.
   * @memberOf module:CPSConfigurator.CPSActions
   */
  updateSubscription(cpsId, typeId, entityId, subscriptionId, subscription) {
    put(`cps/${cpsId}/types/${typeId}/entitys/${entityId}/subscriptions/${subscriptionId}`)
      .then(subscription => this.dispatch({typeId, entityId, subscriptionId, subscription}))
      .catch(err => this.dispatch({isError: true, err}));
  }

  /**
   * Updates a subscription.
   * @function delteSubscription
   * @instance
   * @param {string} cpsId - The id of a CPS.
   * @param {string} typeId - The id of a type.
   * @param {string} entityId  - The id of a entity.
   * @param {string} subscriptionId  - The id of a subscription.
   * @memberOf module:CPSConfigurator.CPSActions
   */
  deleteSubscription(cpsId, typeId, entityId, subscriptionId) {
    remove(`cps/${cpsId}/types/${typeId}/entitys/${entityId}/subscriptions/${subscriptionId}`)
      .then(() => this.dispatch({typeId, entityId, subscriptionId}))
      .catch(err => this.dispatch({isError: true, err}));
  }
}

export default alt.createActions(CPSActions);
