/** @module API/CPS/Subscription */
import {handleError, handleEmpty, sendSuccess, sendCreated} from '../../../../ApiHelper.js';
import {Subscription} from '../../../../../Storage/CPS';
import {startAcquisition, stopAcquisition} from '../../../../../ContextLifeCycle';
import log from '../../../../../Helper/Logger';
import {assert} from 'chai';

/** Loads a Subscription.
 * @param {external:Request} req - The request.
 * @param {external:Response} res - The response.
 * @throws Will throw an error if no Subscription id is provided.
*/
export function load(req, res) {
  assert.isString(req.params.subscription, 'No Subscription id provided.');
  const {subscription} = req.params;

  Subscription.findOne({_id: subscription})
        .then(subscription => handleEmpty(subscription))
        .then(subscription => sendSuccess(res, subscription))
        .catch(err => handleError(res, err));
}

/** Loads all Subscriptions.
 * @param {external:Request} req - The request.
 * @param {external:Response} res - The response.
 * @throws Will throw an error if no Entity id is provided.
*/
export function loadAll(req, res) {
  assert.isString(req.params.type, 'No Entity id provided.');
  const {entity} = req.params;

  Subscription.find({_parent: entity})
              .then(subscription => sendSuccess(res, subscription))
              .catch(err => handleError(res, err));
}

/** Creates a Subscriptions. Starts the acquisition of CPS Events.
 * @param {external:Request} req - The request.
 * @param {external:Response} res - The response.
 * @throws Will throw an error if no CPS id is provided.
 * @throws Will throw an error if no Entity id is provided.
 * @throws Will throw an error if a mandatory field is missing.
*/
export function create(req, res) {
  assert.isString(req.params.cps, 'No CPS id provided.');
  assert.isString(req.params.entity, 'No Entity id provided.');
  assert.isString(req.body.subscription, 'No subscription provided.');
  assert.isString(req.body.connection, 'No connection provided');
  assert.isArray(req.body.sensed, 'No sensed attributes provided.');
  const {cps, entity} = req.params;
  const subscription = req.body;
  saveSubscription(subscription, entity)
    .then(savedSubscription => startAcquisition(cps, savedSubscription),
          err => handleError(res, err))
    .then(savedSubscription => sendCreated(res, savedSubscription),
          err => handleError(res, err));
}

function saveSubscription(subscription, entity) {
  subscription._parent = entity;
  const newSubscription = new Subscription(subscription);

  return newSubscription.save();
}

/** Updates a Subscriptions.
 * @param {external:Request} req - The request.
 * @param {external:Response} res - The response.
 * @throws Will throw an error if no CPS id is provided.
 * @throws Will throw an error if no Subscription id is provided.
*/
export function update(req, res) {
  assert.isString(req.params.cps, 'No CPS id provided.');
  assert.isString(req.params.subscription, 'No Subscription id provided.');
  const {cps, subscription} = req.params;

  Subscription.findOneAndUpdate({_id: subscription}, req.body, {new:true})
              .then(updatedSubscription => handleEmpty(updatedSubscription, subscription))
              .then(updatedSubscription => stopAcquisition(cps, updatedSubscription))
              .then(updatedSubscription => startAcquisition(cps, updatedSubscription))
              .then(updatedSubscription => sendSuccess(res, updatedSubscription))
              .catch(error => handleError(res, error));
}

/** Removes a Subscriptions. Stops the acquisition of CPS Events.
 * @param {external:Request} req - The request.
 * @param {external:Response} res - The response.
 * @throws Will throw an error if no CPS id is provided.
 * @throws Will throw an error if no Subscription id is provided.
*/
export function remove(req, res) {
  assert.isString(req.params.cps, 'No CPS id provided.');
  assert.isString(req.params.subscription, 'No Subscription id provided.');
  const {cps, subscription} = req.params;

  Subscription.findOne({_id: subscription})
              .then(loadedSubscription => stopAcquisition(cps, loadedSubscription))
              .then(() => Subscription.remove({_id: subscription}))
              .then(subscription => res.sendStatus(204))
              .catch(error => handleError(res, error));
}
