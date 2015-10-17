import alt from '../../../alt';
import {modals} from '../../Helpers/Constants';
import ModalActions from '../../UI/ModalActions';

/**
 * Actions that allow to mutate the state of beacons.
 * @class
 * @memberOf module:Visualizations/Position
 * @augments external:Action
 */
class BeaconActions {
  constructor() {
    /**
     * Moves the the active Beacon.
     * @function moveActiveBeacon
     * @param {object} position - The new position.
     * @param {number} position.x - The x position.
     * @param {number} position.y - The y position.
     * @instance
     * @memberOf module:Visualizations/Position.BeaconActions
     */

    /**
     * Places a Beacon.
     * @function placeBeacon
     * @param {string} beaconId - The id of a Beacon.
     * @instance
     * @memberOf module:Visualizations/Position.BeaconActions
     */

    /**
     * Sets the size of an the area in meter.
     * @function setSizeInMeter
     * @param {object} size - The size of the area.
     * @param {number} size.width - The width in meter.
     * @param {number} size.height - The height in meter.
     * @instance
     * @memberOf module:Visualizations/Position.BeaconActions
     */

    /**
     * Sets the active beacon.
     * @function setActiveBeacon
     * @param {string} beaconId - The id of a beacon.
     * @instance
     * @memberOf module:Visualizations/Position.BeaconActions
     */

    this.generateActions('moveActiveBeacon', 'placeBeacon',
                         'setSizeInMeter', 'setActiveBeacon');
  }

  /**
   * Creates Beacons and closes the beacon modal.
   * @function createBeacons
   * @param {object} beaconForm - Formdata for new beacons.
   * @param {object[]} beaconForm.beacons - List of Beacons
   * @param {string} beaconForm.beacons[].name - Name of the Beacon.
   * @instance
   * @memberOf module:Visualizations/Position.BeaconActions
   */
  createBeacons(beaconForm){
    this.dispatch(beaconForm.beacons);
    ModalActions.toogleModal.defer(modals.createBeacon);
  }
}

export default alt.createActions(BeaconActions);
