import alt from '../../alt';

/**
 * Actions that allow to mutate the state of modals.
 * @class
 * @memberOf module:UI
 * @augments external:Action
 */
class ModalActions {
  /**
   * Toggles a model.
   * @function toggleModal
   * @instance
   * @param {(string|event)} modal - The modal.
   * @memberOf module:UI.ModalActions
   */
  toogleModal(modal) {
    if (modal.target) {
      return modal.target.id;
    } else {
      return modal;
    }
  }
}

export default alt.createActions(ModalActions);
