/** @module API/CPS/Entity */
import {handleError, handleEmpty, sendSuccess, sendCreated} from '../../../ApiHelper.js';
import {Entity} from '../../../../Storage/CPS';
import {assert} from 'chai';

/** Loads all Entities.
 * @param {external:Request} req - The request.
 * @param {external:Response} res - The response.
 * @throws Will throw an error if no EntityType id is provided.
*/
export function loadAll(req, res) {
  assert.isString(req.params.type, 'No EntityType id provided.');
  const {type} = req.params;

  Entity.find({_parent: type})
        .then(entity => sendSuccess(res, entity))
        .catch(err => handleError(res, err));
}

/** Loads an Entity.
 * @param {external:Request} req - The request.
 * @param {external:Response} res - The response.
 * @throws Will throw an error if no Entity id is provided.
*/
export function load(req, res) {
  assert.isString(req.params.entity, 'No Entity id provided.');
  const {entity} = req.params;

  Entity.findOne({_id: entity})
        .then(entity => handleEmpty(entity))
        .then(entity => sendSuccess(res, entity))
        .catch(err => handleError(res, err));
}

/** Creates an Entity.
 * @param {external:Request} req - The request.
 * @param {external:Response} res - The response.
 * @throws Will throw an error if no EntityType id is provided.
 * @throws Will throw an error if no name is provided.
*/
export function create(req, res) {
  assert.isString(req.params.type, 'No EntityType id provided.');
  assert.isString(req.body.name, 'No name provided.');
  const {type} = req.params;
  const entity = req.body;

  saveEntity(entity, type)
            .then(savedEntity => sendCreated(res, savedEntity),
                  err => handleError(res, err));
}

function saveEntity(entity, type) {
  const {name} = entity;
  const newEntity = new Entity({
    _parent: type,
    name
  });

  return newEntity.save();
}

/** Updates an Entity.
 * @param {external:Request} req - The request.
 * @param {external:Response} res - The response.
 * @throws Will throw an error if no Entity id is provided.
*/
export function update(req, res) {
  assert.isString(req.params.entity, 'No Entity id provided.');
  const {entity} = req.params;

  Entity.findOneAndUpdate({_id: entity}, req.body, {new:true})
        .then(updatedEntity => sendSuccess(res, updatedEntity))
        .catch(error => handleError(res, error));
}

/** Removes an Entity.
 * @param {external:Request} req - The request.
 * @param {external:Response} res - The response.
 * @throws Will throw an error if no Entity id is provided.
*/
export function remove(req, res) {
  assert.isString(req.params.entity, 'No Entity id provided.');
  const {entity} = req.params;

  Entity.remove({_id: entity})
        .then(entity => res.sendStatus(204))
        .catch(error => handleError(res, error));
}
