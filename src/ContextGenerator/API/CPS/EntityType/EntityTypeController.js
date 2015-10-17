/** @module API/CPS/EntityType */
import {handleError, handleEmpty, sendSuccess, sendCreated} from '../../ApiHelper.js';
import {EntityType} from '../../../Storage/CPS';
import {assert} from 'chai';

/** Loads all EntityTypes.
 * @param {external:Request} req - The request.
 * @param {external:Response} res - The response.
 * @throws Will throw an error if no CPS id is provided.
*/
export function loadAll(req, res) {
  assert.isString(req.params.cps, 'No CPS id provided.');
  const {cps} = req.params;

  EntityType.find({_parent: cps})
            .then(entityType => sendSuccess(res, entityType))
            .catch(err => handleError(res, err));
}

/** Loads an EntityType.
 * @param {external:Request} req - The request.
 * @param {external:Response} res - The response.
 * @throws Will throw an error if no EntityType id is provided.
*/
export function load(req, res) {
  assert.isString(req.params.type, 'No EntityType id provided.');
  const {type} = req.params;

  EntityType.findOne({_id: type})
            .then(entityType => handleEmpty(entityType))
            .then(entityType => sendSuccess(res, entityType))
            .catch(err => handleError(res, err));
}

/** Creates an EntityType.
 * @param {external:Request} req - The request.
 * @param {external:Response} res - The response.
 * @throws Will throw an error if no CPS id is provided.
 * @throws Will throw an error if no name is provided.
*/
export function create(req, res) {
  assert.isString(req.params.cps, 'No CPS id provided.');
  assert.isString(req.body.name, 'No name provided.');
  const cps = req.params.cps;
  const entityType = req.body;

  saveEntityType(entityType, cps)
     .then(savedEntityType => sendCreated(res, savedEntityType),
           err => handleError(res, err));
}

function saveEntityType(entityType, cps) {
  const {name} = entityType;
  const newEntityType = new EntityType({
    _parent: cps,
    name
  });

  return newEntityType.save();
}

/** Updates an EntityType.
 * @param {external:Request} req - The request.
 * @param {external:Response} res - The response.
 * @throws Will throw an error if no EntityType id is provided.
*/
export function update(req, res) {
  assert.isString(req.params.type, 'No EntityType id provided.');
  const {type} = req.params;

  EntityType.findOneAndUpdate({_id: type}, req.body, {new:true})
            .then(updatedEntityType => sendSuccess(res, updatedEntityType))
            .catch(error => handleError(res, error));
}

/** Removes an EntityType.
 * @param {external:Request} req - The request.
 * @param {external:Response} res - The response.
 * @throws Will throw an error if no EntityType id is provided.
*/
export function remove(req, res) {
  assert.isString(req.params.type, 'No EntityType id provided.');
  const {type} = req.params;

  EntityType.remove({_id: type})
            .then(entityType => res.sendStatus(204))
            .catch(error => handleError(res, error));
}
