/** @module API/Context */
import {startDissemination, stopDissemination} from '../../ContextLifeCycle';
import {handleError} from '../ApiHelper';
import {assert} from 'chai';

/** Starts to stream context according to a ContextSubscription
 *  @see {@link module:ContextLifeCycle/Dissemination}
 * @param {external:Request} req - The request.
 * @param {external:Response} res - The response.
 * @throws Will throw an error if no topic is provided.
 * @throws Will throw an error if no queries are provided.
 */
export function streamContext(req, res) {
  assert.isString(req.body.topic, 'No topic provided.');
  assert.isArray(req.body.queries, 'No queries provided.');
  try {
    if (startDissemination(req.body)) {
      res.sendStatus(201);
    }
  } catch (err) {
    handleError(res, err);
  }
}

/** Stops to stream context.
 * @param {external:Request} req - The request.
 * @param {external:Response} res - The response.
 * @throws Will throw an error if no topic is provided.
 */
export function stopStreamContext(req, res) {
  assert.isString(req.query.topic, 'No topic provided.');
  const {topic} = req.query;
  try {
    if (stopDissemination(topic)) {
      res.sendStatus(201);
    }
  } catch (err) {
    handleError(res, err);
  }
}
