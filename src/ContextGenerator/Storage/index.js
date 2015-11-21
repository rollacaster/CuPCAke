/** @module Storage */
import mongoose from 'mongoose';

//Use native promises
mongoose.Promise = global.Promise;

export default mongoose;

/**
 * Mongoose Model.
 * @external Model
 * @see {@link http://mongoosejs.com/docs/api.html#model-js}
*/
