import objectModeller, {Schema} from 'mongoose';

const cpsSchema = objectModeller.Schema({
  name: String,
  connections: []
});

/** Provides a Mongoose Schema for CPS
 * @alias CPS
 * @memberOf module:Storage/CPS
 * @type {external:Model}
 * @property {string} name - Name of the CPS.
 * @property {string[]} connections - List of the available connections.
 */
export default objectModeller.model('CPS', cpsSchema);
