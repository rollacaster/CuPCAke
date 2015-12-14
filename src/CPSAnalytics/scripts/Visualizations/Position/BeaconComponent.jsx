import React, { PropTypes } from 'react';
import {Badge} from 'react-bootstrap';
import { DragSource } from 'react-dnd';
import { ItemTypes } from '../../Helpers/Constants/ItemTypes';
import BeaconActions from './BeaconActions';
import {Button} from '../../UI';

const beaconSource = {
  beginDrag(props) {
    BeaconActions.setActiveBeacon(props.id);
    return {
      id: props.id
    };
  },
};

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
  }
}

/**
 * Represents a Beacon. The Beacon is a draggable component it can be dropped in
 * a {@link Components/Viusalization/Position~BeaconArea}.
 * @class
 * @memberOf module:Visualizations/Position
 * @augments external:Component
 */
class Beacon {
  static propTypes = {
    connectDragSource: PropTypes.func.isRequired,
    id: PropTypes.string.isRequired
  };

  activateBeacon = (e) => {
    e.preventDefault();
    const {id} = this.props;
    BeaconActions.setActiveBeacon(id);
  }

  render() {
    const { connectDragSource, id } = this.props;

    return connectDragSource(
      <Button onClick={this.activateBeacon}>
          <Badge>{id}</Badge>
      </Button>
    );
  }
}

export default DragSource(ItemTypes.BEACON, beaconSource, collect)(Beacon)
