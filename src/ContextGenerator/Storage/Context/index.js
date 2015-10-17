/** @module Storage/Context */
import objectModeller from 'mongoose';

const contextSchema = objectModeller.Schema({
  cps: String,
  time: Date,
  entities: [
    {
      type: {type: String},
      time: Date,
      name: String,
      attributes: {}
    }
  ]
});

/** Provides a Mongoose Schema for Context
 * @alias Context
 * @memberOf module:Storage/Context
 * @type {external:Model}
 * @property {string} cps - Name of the CPS.
 * @property {date} time - Timestamp of the Context.
 * @property {mdoulde:Storage~entity[]} entities - .
*/
export default objectModeller.model('Context', contextSchema);
