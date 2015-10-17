/** @module ContextLifeCycle/Acquisition */
import log from '../../Helper/Logger';
import ConnectionFactory from './ConnectionFactory';
import {CPS, EntityType, Entity, Subscription} from '../../Storage/CPS';

const connectedCPS = new Map();
const subscriptions = new Map();

/** Connects to all connections of a CPS
 * @param {module:Storage/CPS.CPS} cps - The CPS.
 * @returns {module:Storage/CPS.CPS} The CPS.
 * @throws Throws an error if no connection could be established.
*/
export function connect(cps) {
  const {connections} = cps;

  return connectURLs(connections)
    .then(connectedClients => {
      connectedCPS.set(cps._id, connectedClients);
      return cps;
    })

    .catch(error => {
      error._id = cps._id;
      throw error;
    });
}

function connectURLs(connectionURLs) {
  const establishedConnections = new Map();
  const pendingConnections = [];

  for (let connectionURL of connectionURLs) {
    let activeConnection = ConnectionFactory(connectionURL);
    pendingConnections.push(activeConnection.connect());
    establishedConnections.set(connectionURL, activeConnection);
  }

  return Promise.all(pendingConnections)
                .then(() =>  establishedConnections)
                .catch(error => {throw error;});
}

/** Browses the resources of a CPS
 * @param {string} cpsId - The id of a CPS.
 * @param {string} connection - A connection URL of a CPS.
 * @param {string} rootFolder - The rootFolder for the browsing.
 * @returns {object} Possible acquisitions.
*/
export function list(cpsId, {connection, rootFolder}) {
  return findConnection(cpsId, connection)
    .then(client => client.browse(rootFolder))
    .catch(error => {throw error;});
}

/** Creates an active Subscription that receives events from a CPS and an
 * description about the context of these events.
 * @param {string} cpsId - The id of a CPS.
 * @param {module:Storage/CPS.Subscription} subscription - The subscription.
*/
export function start(cpsId, subscription) {
  return createContextDescription(subscription)
    .then(contextDescription => {
      const connection = findConnection(cpsId, subscription.connection);
      return Promise.all([connection, contextDescription]);
    })

    .then(connectionAndDescription => {
      const connection = connectionAndDescription[0];
      const description = connectionAndDescription[1];
      const pendingSubscription = connection.subscribe(subscription.subscription);
      return Promise.all([description, pendingSubscription]);
    })

    .then(descriptionAndSubscription => {
      const contextDescription = descriptionAndSubscription[0];
      const activeSubscription = descriptionAndSubscription[1];
      subscriptions.set(subscription._id.toString(), activeSubscription);
      return {activeSubscription, contextDescription};
    })

    .catch(error => {throw error;});
}

/**
 * Describes a context.
 * @typedef {object} ContextDescription
 * @property {string} cps - The CPS of the attribute.
 * @property {string} entityType - The entity type of the attribute.
 * @property {string} entityName - The entity of the attribute.
 * @property {string} attribute - The name of the attribute.
 * @property {string} modeling - Describes how this context has to be modelled.
 * @property {object} statics - Static information that is added to the context.
 * @todo Move function to Storage/CPS
 */
function createContextDescription(subscription) {
  return Entity.findOne({_id: subscription._parent})
               .populate('_parent')
               .then(entity =>  Promise.all(
                 [CPS.findOne(entity._parent._parent), entity])
               )
               .then(all => {
                 const cps = all[0].name;
                 const entityType = all[1]._parent.name;
                 const entityName = all[1].name;
                 const contextDescription = {
                   cps,
                   entityType,
                   entityName,
                   attribute: subscription.sensed[0],
                   statics: subscription.statics,
                   modeling: subscription.modeling
                 };
                 return contextDescription;
               });
}

/** Stopps an active Subscription that receives events from a CPS.
 * @param {string} cpsId - The id of a CPS.
 * @param {module:Storage/CPS.Subscription} subscription - The subscription.
 * @returns {module:Storage/CPS.Subscription} The subscription.
*/
export function stop(cpsId, subscription) {
  const {_id, connection} = subscription;

  return findConnection(cpsId, connection)
    .then(connection => {
      const activeSubscription = subscriptions.get(_id.toString());
      if (activeSubscription) {
        connection.unsubscribe(activeSubscription);
      }

      return subscription;
    })

    .catch(error => {
      error.subscription = subscription;
      throw error;
    });
}

function findConnection(cpsName, connection) {
  let cps = connectedCPS.get(cpsName);
  if (!cps) {
    log.info(`No CPS found. Try to reconnect ${cpsName} to ${connection}`);
    return connect({_id: cpsName, connections: [connection]})
      .then(cps => connectedCPS.get(cps._id).get(connection))
      .catch(error => log.info('Could not find a connction.', error));
  }

  let activeConnection = cps.get(connection);

  if (!activeConnection) {
    log.info(`No connection found. Try to reconnect ${cpsName} to ${connection}`);
    return connect({_id: cpsName, connections: [connection]})
      .then(cps => connectedCPS.get(cps._id).get(connection))
      .catch(error => log.info('Could not find a connction.', error));
  }

  return Promise.resolve(cps.get(connection));
}
