/** @module ContextLifeCycle */
import log from '../Helper/Logger';
import Pipeline from 'pipes-and-filters';
import * as acquisition from './Acquisition';
import modeling from './Modeling';
import * as dissemination from './Dissemination';
import Context from '../Storage/Context';

//TODO Fix or remove cycle time
const cycleTimeInMilliSeconds = 0;

const contexts = new Map();

//TODO realtimeSubscriptions as filter
const realtimeSubscriptions = new Map();

/** Checks if an acquistion from a CPS is possible.
 * @param {module:Storage/CPS.CPS} cps - The CPS.
 * @returns {module:Storage/CPS.CPS} The CPS.
 */
export function checkAcquisition(cps) {
  return acquisition.connect(cps).then(cps => cps)
                    .catch(error => {throw error;});
}

/** Lists possible acquisitions for a CPS. Is not supported by all protocols.
 * @param {string} cpsId - The id of a CPS.
 * @param {object} browseDescription - Describes which acquistions to list.
 * @returns {object} Possible acquisitions.
 */
export function listAcquisitions(cpsId, browseDescription) {
  return acquisition.list(cpsId, browseDescription).then(acquisitions => acquisitions)
                    .catch(error => {throw error;});
}

/** Starts the acquistion of CPS events based on a subscription.
 * @param {string} cpsId - The id of a CPS.
 * @param {module:Storage/CPS.Subscription} subscription - The subscription.
 * @listens module:ContextLifeCycle/Acquisition.CPSConnection:changed
 * @returns {module:Storage/CPS.Subscription} The Subscription.
 */
export function startAcquisition(cpsId, subscription) {
  return acquisition.start(cpsId, subscription)
                    .then(acquisitionData => contextListener(acquisitionData, subscription))
                    .catch(error => {throw error;});
}

function contextListener({activeSubscription, contextDescription, connection}, subscription) {
  activeSubscription.on('changed', (event, topic) => {
    if (topic && topic !== subscription.subscription) { return; }

    if (event instanceof Buffer) { event = JSON.parse(event); }

    computeContext(event, contextDescription, connection);
  });

  return subscription;
}

/** Stops the acquistion of CPS events based on a subscription.
 * @param {string} cpsId - The id of a CPS.
 * @param {module:Storage/CPS.Subscription} subscription - The subscription.
 * @returns {module:Storage/CPS.Subscription} The subscription.
 */
export function stopAcquisition(cpsId, subscription) {
  return acquisition.stop(cpsId, subscription)
                    .then(stopped => stopped)
                    .catch(error => {throw error;});
}

/** Starts the dissemination of Context based on a ContextSubscription.
 * @param {object} contextSubscription - The ContextSubscription.
 * @param {string} contextSubscription.topic - The MQTT topic the contexts should be sent to.
 * @param {?boolean} contextSubscription.realtime - True if subscription disseminates realtime events.
 * @param {?date} contextSubscription.start - Start time for the dissemination of context.
 * @param {object[]} contextSubscription.queries - List of queries specifying which data should be disseminated.
 * @param {string} contextSubscription.queries[].cps - The CPS of the query.
 * @param {string} contextSubscription.queries[].type - The entity type of the query.
 * @param {string} contextSubscription.queries[].entity - The entity of the query.
 * @param {string} contextSubscription.queries[].attribute - The attribute of the query.
 * @returns {boolean} True if dissemination was succesfull.
 */
export function startDissemination(contextSubscription) {
  const subscription = dissemination.start(contextSubscription);
  if (subscription) {
    realtimeSubscriptions.set(contextSubscription.topic, subscription);
  }

  return true;
}

/** Stops the dissemination of Context.
 * @param {string} topic - The topic to which the Contexts are sent.
 * @returns {boolean} True if dissemination was stopped.
 * @throws Throws an error if no matching subscription was found.
 */
export function stopDissemination(topic) {
  const subscription = realtimeSubscriptions.get(topic);
  if (!subscription) {
    const error = new Error(`Could not find a subscription for ${topic}`);
    error.topic = topic;
    throw error;
  }

  dissemination.stop(subscription);
  realtimeSubscriptions.delete(topic);
  return true;
}

/**
 * Input for the pipe that is responible for processing contexts.
 * @typedef pipeInput
 * @property {object} event - An event that was received from a CPS.
 * @property {module:ContextLifeCycle/Acquisition~ContextDescription} contextDescription - Describes the context for the event.
 * @property {module:Storage/Context.Context} context - The former context of a CPS.
 */
function computeContext(cpsEvent, contextDescription) {
  const contextPipeline = Pipeline.create();
  contextPipeline.use(modeling);

  return new Promise((resolve, reject) => {
    loadContext(contextDescription.cps).then(
      context => {
        const pipeInput = {event: cpsEvent, context, contextDescription};
        contextPipeline.execute(pipeInput, (err, context) => {
          if (err) reject(err);

          checkToSave(context);

          //Keep in memory for faster access
          contexts.set(context.cps, context);

          for (let realtimeSubscription of realtimeSubscriptions.values()) {
            realtimeSubscription.contextUpdate(context);
          }

          resolve(context);
        });

      });
  });
}

//TODO extract all following methods to Storage
function loadContext(cps) {
  if (contexts.has(cps)) {
    return Promise.resolve(contexts.get(cps));
  }
  else {
    return new Promise(function(resolve, reject) {
      const findRecentContext = Context.findOne({cps}).sort('-time');
      findRecentContext.then(context => {
        if (!context) {
          context = {
            cps,
            time: new Date(),
            entities: []
          };
        } else {
          context = extractDBFields(context);
        }

        resolve(context);
      }

      ).catch(err => {
        log.info('Could not find a context', {Error: err});
        reject(err);
      });
    });
  }
}

function extractDBFields(context) {
  let {cps, time, entities} = context;
  time = new Date(time);
  return {cps, time, entities};
}

function checkToSave(context) {
  const now = new Date();
  const isCycleTimeExpired = now.getTime() > (context.time.getTime() + cycleTimeInMilliSeconds);
  if (isCycleTimeExpired) {
    context.time = now;
    saveContext(context);
  }
}

function saveContext(context) {
  const createdContext = new Context(context);
  createdContext.save();
}
