/** @module ContextLifeCycle/Dissemination */
import moment from 'moment';
import MQTTDisseminator from './MQTTDisseminator';
import Context from '../../Storage/Context';

const BUFFER_TIME_IN_SECONDS = 2;

/**
 * Starts the dissemination of context according to ContextSubscription.
 * @param {object} contextSubscription - The ContextSubscription.
 * @param {string} contextSubscription.topic - The MQTT topic the contexts should be sent to.
 * @param {?boolean} contextSubscription.realtime - True if subscription disseminates realtime events.
 * @param {?date} contextSubscription.start - Start time for the dissemination of context.
 * @param {object[]} contextSubscription.queries - List of queries specifying which data should be disseminated.
 * @param {string} contextSubscription.queries[].cps - The CPS of the query.
 * @param {string} contextSubscription.queries[].type - The entity type of the query.
 * @param {string} contextSubscription.queries[].entity - The entity of the query.
 * @param {string} contextSubscription.queries[].attribute - The attribute of the query.
 */
export function start(contextSubscription) {
  if (contextSubscription.realtime) {
    const subscription = new MQTTDisseminator(contextSubscription,
                                              BUFFER_TIME_IN_SECONDS);
    return subscription;
  }

  const startTime = contextSubscription.start;
  const endTime = contextSubscription.end;
  const findContexts = Context.where('time')
                              .gte(moment(startTime, 'x').format())
                              .lte(moment(endTime, 'x').format());

  const subscription = new MQTTDisseminator(contextSubscription,
                                            BUFFER_TIME_IN_SECONDS);

  findContexts.stream()
              .on('data', context => subscription.contextUpdate(context))
              .on('error', (err) => handleError(err, contextSubscription))
              .on('close', () => subscription.contextUpdate({done: true}));
}

/**
 * Stops the dissemination of context.
 * @param {module:ContextLifeCycle/Dissemination.MQTTDisseminator} MQTTDisseminator - The MQTTDisseminator.
 */
export function stop(MQTTDisseminator) {
  MQTTDisseminator.contextUpdate({done: true});
}

function handleError(err, subscription) {
  err.subscription = subscription;
  throw err;
}
