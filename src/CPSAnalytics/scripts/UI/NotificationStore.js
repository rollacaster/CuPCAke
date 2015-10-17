import alt from '../../alt';
import NotificationActions from './NotificationActions';

/**
 * Stores the state of all notifications.
 * @class
 * @memberOf module:UI
 * @augments external:Store
 */
class NotificationStore {
  constructor() {
    this.bindActions(NotificationActions);
    this.notificationSystem = null;
  }

  /**
   * @see {@link module:UI.NotificationActions#initiate}
   * @function onInitiate
   * @instance
   * @memberOf module:UI.NotificationStore
   */
  onInitiate(notificationSystem) {
    this.notificationSystem = notificationSystem;
  }

  /**
   * @see {@link module:UI.NotificationActions#notify}
   * @function onNotify
   * @instance
   * @memberOf module:UI.NotificationStore
   */
  onNotify(notification) {
    this.notificationSystem.addNotification(notification);
  }
}

export default alt.createStore(NotificationStore, 'NotificationStore');
