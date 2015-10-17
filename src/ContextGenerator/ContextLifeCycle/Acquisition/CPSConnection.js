/**
 * Interface for communication with a CPS.
 * @interface CPSConnection
 * @memberOf module:ContextLifeCycle/Acquisition
 */

/**
 * Connects to a CPS.
 *
 * @function
 * @name module:ContextLifeCycle/Acquisition.CPSConnection#connect
 */

/**
 * Subscribes to events of a CPS.
 *
 * @function
 * @name module:ContextLifeCycle/Acquisition.CPSConnection#subscribe
 * @param {string} subscription - Describes which event should be subscribed.
 */

/**
 * Unsubscribes from events of a CPS.
 *
 * @function
 * @name module:ContextLifeCycle/Acquisition.CPSConnection#unsubscribe
 * @param {string} subscription - Describes which event should be unsubscribed.
 */

export default class CPSConnection {
  constructor() {
    if (this.connect === undefined) {
      throw new TypeError('A CPSConnection must provida a connect method.');
    }
    else if (this.subscribe === undefined) {
      throw new TypeError('A CPSConnection must provida a subscribe method.');
    }
    else if (this.unsubscribe === undefined) {
      throw new TypeError('A CPSConnection must provida an unsubscribe method.');
    }
  }
}
