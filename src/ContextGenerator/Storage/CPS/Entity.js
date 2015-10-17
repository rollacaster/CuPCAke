import objectModeller, {Schema} from 'mongoose';

const entitySchema = objectModeller.Schema({
  name: String,
  _parent: { type: Schema.Types.ObjectId, ref: 'EntityType'}
});

/** Provides a Mongoose Schema for Entity
 * @alias Entity
 * @memberOf module:Storage/CPS
 * @type {external:Model}
 * @property {string} name - Name of the Entity.
 * @property {string} _parent - The id of the parent.
*/
export default objectModeller.model('Entity', entitySchema);
