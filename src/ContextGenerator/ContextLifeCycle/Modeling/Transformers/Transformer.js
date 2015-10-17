/**
 * Interface for the transformation of a CPS event into Context.
 * @interface Transformer
 * @memberOf module:ContextLifeCycle/Modeling
 */

/**
 * Transforms one CPS event into context.
 *
 * @function
 * @name module:ContextLifeCycle/Modeling~Transformer#transform
 * @param {object} cpsEvent - The CPS event.
 * @param {module:ContextLifeCycle/Acquisition~ContextDescription} contextDescription - Describes the context of the event.
 * @returns {module:Storage.Context} A new context.
 */

export default class CPSConnection {
  constructor() {
    if (this.transform === undefined) {
      throw new TypeError('A Transformer  must provida a transform method.');
    }
  }
}
