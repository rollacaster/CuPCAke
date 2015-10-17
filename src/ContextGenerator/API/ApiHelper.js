/** @module API */
import log from '../Helper/Logger';
import _ from 'ramda';

/** Defines how to handle a request that could not find a result
 * @param {object} result - The result of a request.
 * @param {object} search - The search query of the request.
*/
export function handleEmpty(result, search) {
  return new Promise((resolve, reject) => {
    if (_.isEmpty(result)) {
      const err = new Error(`Could not find get a result with search query ${search}`);
      err.element = search;
      reject(err);
    }

    resolve(result);
  });
}

/** Defines how to handle a request that throwed an error
 * @param {external:Response} res - The response.
 * @param {Error} err - The throwed error.
*/
export function handleError(res, err) {
  log.info(err);
  res.status(500).json({error: err});
}

/** Defines how to handle a succesfull request
 * @param {external:Response} res - The response.
 * @param {object} data - The response body.
*/
export function sendSuccess(res, data) {
  res.status(200).json(data);
}

/** Defines how to handle a succesfull request that created
 * a resource.
 * @param {external:Response} res - The response.
 * @param {object} data - The response body.
*/
export function sendCreated(res, data) {
  res.status(201).json(data);
}
