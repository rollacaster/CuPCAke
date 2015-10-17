import objectModeller, {Schema} from 'mongoose';

const entityTypeSchema = objectModeller.Schema({
  name: String,
  _parent: { type: Schema.Types.ObjectId, ref: 'CPS'}
});

/** Provides a Mongoose Schema for EntityType
 * @alias EntityType
 * @memberOf module:Storage/CPS
 * @type {external:Model}
 * @property {string} name - Name of the EntityType.
 * @property {string} _parent - The id of the parent.
*/
export default objectModeller.model('EntityType', entityTypeSchema);
