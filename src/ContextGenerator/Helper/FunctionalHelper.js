/** @module Helper */
import _ from 'ramda';

/**
 * Concatenates a property that is extracted from an array of
 * objects into an array.
 * @param {string} prop - The property.
 * @param {array} values - The array of objects.
 * @returns An array with the concatenated property.
*/
export const concatProp = _.curry((prop, values) =>
  _.reduce((prev, curr) => prev.concat(curr[prop]), [], values)
);

/**
 * This function can be placed in a compostion of functions to
 * log out the results of its predecessor function.
 * @param {tag} string - A tag to reconcile the log statement.
 * @param {object} output - The output of the predecessor function
 * @returns The output of the predecessor function.
*/
export const trace = _.curry((tag, output) => {
  console.log(tag, output);
  return output;
});
