import objectModeller, {Schema} from 'mongoose';

const subscriptionSchema = objectModeller.Schema({
  _parent: { type: Schema.Types.ObjectId, ref: 'Entity'},
  subscription: String,
  connection: String,
  modeling: String,
  sensed: [],
  statics: {}
});

/** Provides a Mongoose Schema for Subscription
 * @alias Subscription
 * @memberOf module:Storage/CPS
 * @type {external:Model}
 * @property {string} subscription - The value that should be subscribed.
 * @property {string} connection - The URL for the subscription.
 * @property {string} modeling - Describes how this subscription has to be modelled.
 * @property {string[]} sensed - Names of  the values that are subscribed.
 * @property {object} statics - Static information that is added to the subscription.
 * @property {string} _parent - The id of the parent.
*/
export default objectModeller.model('Subscription', subscriptionSchema);
