import alt from '../../alt';
import ModalActions from './ModalActions';

/**
 * Stores the state of all modals.
 * @class
 * @memberOf module:UI
 * @augments external:Store
 */
class ModalStore {
  constructor() {
    this.bindActions(ModalActions);
    this.modals = new Map();
  }

  /**
   * Toggles a model.
   * @function onToogleModal
   * @instance
   * @param {string} modal - The name of the modal.
   * @memberOf module:UI.ModalStore
   */
  onToogleModal(modal) {
    const isModalShown = this.modals.get(modal);
    this.modals.set(modal, !isModalShown);
  }
}

export default alt.createStore(ModalStore, 'ModalStore');
