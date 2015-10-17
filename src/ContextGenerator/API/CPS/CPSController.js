/** @module API/CPS */
import {handleError, handleEmpty, sendSuccess, sendCreated} from '../ApiHelper.js';
import {listAcquisitions, checkAcquisition} from '../../ContextLifeCycle';
import {CPS} from '../../Storage/CPS';
import {assert} from 'chai';

/** Loads all CPSs.
 * @param {external:Request} req - The request.
 * @param {external:Response} res - The response.
*/
export function loadAll(req, res) {
  CPS.find().then(loadedCPS => res.status(200).json(loadedCPS))
     .catch(err => handleError(res, err));
}

/** Loads a CPS.
 * @param {external:Request} req - The request.
 * @param {external:Response} res - The response.
 * @throws Will throw an error if no CPS id is provided.
*/
export function load(req, res) {
  assert.isString(req.params.cps, 'No CPS id provided.');
  const {cps} = req.params;

  CPS.findOne({_id: cps})
     .then(cps => handleEmpty(cps))
     .then(cps => sendSuccess(res, cps))
     .catch(err => handleError(res, err));
}

/** Creates a CPS. Checks the connection to the CPS.
 * @param {external:Request} req - The request.
 * @param {external:Response} res - The response.
 * @throws Will throw an error if no name is provided.
 * @throws Will throw an error if no connecions are provided.
*/
export function create(req, res) {
  assert.isString(req.body.name, 'No name provided.');
  assert.isArray(req.body.connections, 'No connections provided.');
  const {name, connections} = req.body;

  const cps = new CPS({name, connections});

  cps.save()
     .then(createdCPS => checkAcquisition(createdCPS),
           error => CPS.remove({_id: error._id}).then(() => handleError(res, error)))
     .then(createdCPS => res.status(201).json(createdCPS),
           error => CPS.remove({_id: error._id}).then(() => handleError(res, error)));
}

/** Updates a CPS.
 * @param {external:Request} req - The request.
 * @param {external:Response} res - The response.
 * @throws Will throw an error if no CPS id is provided.
*/
export function update(req, res) {
  assert.isString(req.params.cps, 'No CPS id provided.');
  const {cps} = req.params;

  CPS.findOneAndUpdate({_id: cps}, req.body, {new:true})
     .then(updatedCPS => sendSuccess(res, updatedCPS))
     .catch(error => handleError(res, error));
}

/** Removes a CPS.
 * @param {external:Request} req - The request.
 * @param {external:Response} res - The response.
 * @throws Will throw an error if no CPS id is provided.
*/
export function remove(req, res) {
  assert.isString(req.params.cps, 'No CPS id provided.');
  const {cps} = req.params;

  CPS.remove({_id: cps})
     .then(updatedCPS => sendSuccess(res, cps))
     .catch(error => handleError(res, error));
}

/** Browses a CPS.
 * @param {external:Request} req - The request.
 * @param {external:Response} res - The response.
 * @throws Will throw an error if no CPS id is provided.
 * @throws Will throw an error if no connecion is provided.
*/
export function browse(req, res) {
  assert.isString(req.params.cps, 'No CPS id provided.');
  assert.isString(req.query.connection, 'No connection provided.');
  const {cps} = req.params;
  const {connection, rootFolder} = req.query;

  listAcquisitions(cps, {connection, rootFolder})
                  .then(acquisitions => res.status(200).json(acquisitions))
                  .catch(error => handleError(res, error));
}
