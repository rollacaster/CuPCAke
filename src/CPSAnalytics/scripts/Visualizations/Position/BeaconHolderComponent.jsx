import React, {PropTypes} from 'react';
import {Glyphicon} from 'react-bootstrap';
import {Button} from '../../UI';
import Beacon from './BeaconComponent';
import BeaconActions from './BeaconActions';
import {CreateForm} from '../../UI/Forms/Form';
import {modals} from '../../Helpers/Constants';

/**
 * Holds all created beacons. A form to create new beacons and
 * controls to adjust the position of a beacon.
 * @class
 * @memberOf module:Visualizations/Position
 * @augments external:Component
 */ 
export default class BeaconHolder extends React.Component {
  static propTypes = {
    beaconIds: PropTypes.object.isRequired,
    onFinishPlacing: PropTypes.func.isRequired
  }

  render() {
    const {beaconIds, onFinishPlacing} = this.props;

    let beacons = [];
    for (let beaconId of beaconIds) {
      beacons.push(<Beacon id={beaconId} key={beaconId}
                           position={{x: 0, y: 0}}/>);
    }

    return (
      <div className="well well--nomargin beaconpos__holder">
          <h4>Beacons</h4>
          {beacons}
          <CreateForm title="Beacon" multi="beacons" id={modals.createBeacon}
                      onCreate={BeaconActions.createBeacons}/>
          <Adjustments/>
          <Button text='Generate Heatmap' onClick={onFinishPlacing} primary/>
      </div>
    );
  }
}

class Adjustments extends React.Component {
  render() {
    return (
      <div className="beaconpos__adjustments">
          <h4>Adjustments</h4>
          <div className="beaconpos__adjustments--arrow">
              <ArrowButton direction="up" />
          </div>
          <div className="beaconpos__adjustments--arrow-mid">
              <ArrowButton direction="left" />
              <ArrowButton direction="right" />
          </div>
          <div className="beaconpos__adjustments--arrow">
              <ArrowButton direction="down" />
          </div>
      </div>
    );
  }
}

class ArrowButton extends React.Component {
  static propTypes = {
    direction: PropTypes.string.isRequired
  }

  handleAdjustment = (e) => {
    BeaconActions.moveActiveBeacon(e.target.id);
  }

  render() {
    const {direction} = this.props;

    const glyph = `arrow-${direction}`;
    return (
      <Button id={direction} onClick={this.handleAdjustment}>
          <Glyphicon id={direction} glyph={glyph} />
      </Button>
    );
  }
}
