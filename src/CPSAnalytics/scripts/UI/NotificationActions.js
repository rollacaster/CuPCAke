import alt from '../../alt';

/**
 * Actions that allow to mutate the state of notifications.
 * @class
 * @memberOf module:UI
 * @augments external:Action
 */
class NotificationActions {
  /**
   * Initiate the notification system.
   * @function initiate
   * @param {external:NotificationSystem} notificationSystem - The notification system.
   * @instance
   * @memberOf module:UI.NotificationActions
   */

  /**
   * Sets the active beacon.
   * @function notify
   * @param {object} notification - A notification.
   * @param {string} notification.title - The title of the notfication.
   * @param {string} notification.message - The message of the notification.
   * @param {string} notification.level - The level of the notfication.
   * @instance
   * @memberOf module:UI.NotificationActions
   */
  constructor() {
    this.generateActions('initiate', 'notify');
  }
}

export default alt.createActions(NotificationActions);
