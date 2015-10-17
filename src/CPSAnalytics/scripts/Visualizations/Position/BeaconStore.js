import alt from '../../../alt';
import BeaconActions from './BeaconActions';
import d3 from 'd3';

/**
 * Stores the state of all beacons.
 * @class
 * @memberOf module:Visualizations/Position
 * @augments external:Store
 */
class BeaconStore {
  constructor() {
    this.bindActions(BeaconActions);
    this.allBeacons = new Map();
    this.activeBeacon = null;
    this.sizeInMeter = {width: 20, height: 20};
  }

  /**
   * @see {@link module:Visualizations/Position.BeaconActions#setActiveBeacon}
   * @function onSetActiveBeacon
   * @instance
   * @memberOf module:Visualizations/Position.BeaconStore
   */
  onSetActiveBeacon(beaconId) {
    this.activeBeacon = beaconId;
  }

  /**
   * @see {@link module:Visualizations/Position.BeaconActions#moveActiveBeacon}
   * @function onMoveActiveBeacon
   * @instance
   * @memberOf module:Visualizations/Position.BeaconStore
   */
  onMoveActiveBeacon(position) {
    if (typeof position === 'string') {
      const currentPosition = this.allBeacons.get(this.activeBeacon);
      const {x, y} = currentPosition;
      switch (position) {
        case 'up':
          this.setActiveBeaconPosition({x, y: y - 0.05});
          break;
        case 'down':
          this.setActiveBeaconPosition({x: x, y: y + 0.05});
          break;
        case 'left':
          this.setActiveBeaconPosition({x: x - 0.05, y: y});
          break;
        case 'right':
          this.setActiveBeaconPosition({x: x + 0.05, y: y});
          break;
      }
    } else {
      const {x, y} = position;
      this.setActiveBeaconPosition(position);
    }
  }

  setActiveBeaconPosition(position) {
    this.allBeacons.set(this.activeBeacon, position);
  }
  /**
   * @see {@link module:Visualizations/Position.BeaconActions#placeBeacon}
   * @function onPlaceBeacon
   * @instance
   * @memberOf module:Visualizations/Position.BeaconStore
   */
  onPlaceBeacon(beaconId) {
    const {x, y} = this.allBeacons.get(this.activeBeacon);
    this.allBeacons.set(beaconId, {x, y});
  }

  /**
   * @see {@link module:Visualizations/Position.BeaconActions#setSizeInMeter}
   * @function onSetSizeInMeter
   * @instance
   * @memberOf module:Visualizations/Position.BeaconStore
   */
  onSetSizeInMeter(size) {
    this.sizeInMeter = size;
  }

  /**
   * Creates Beacons and closes the beacon modal.
   * @function createBeacons
   * @param {object[]} beacons - Formdata for new beacons.
   * @param {string} beacons[].name - Name of the Beacon.
   * @see {@link module:Visualizations/Position.BeaconActions#createBeacons}
   * @function onCreateBeacons
   * @instance
   * @memberOf module:Visualizations/Position.BeaconStore
   */
  onCreateBeacons(beacons) {
    beacons.map(beacon => this.allBeacons.set(beacon, {x:-30, y:-30}));
  }
}

export default alt.createStore(BeaconStore, 'BeaconStore');
