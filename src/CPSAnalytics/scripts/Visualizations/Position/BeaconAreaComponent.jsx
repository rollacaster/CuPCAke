import React, {PropTypes} from 'react';
import {DropTarget} from 'react-dnd';
import d3 from 'd3';
import _ from 'ramda';
import { Button } from '../../UI';
import { ItemTypes } from '../../Helpers/Constants/ItemTypes';
import BeaconActions from './BeaconActions';

const beaconAreaTarget = {
  hover(props, monitor, component) {
    const {sizeInMeter, sizeInPixels, position} = props;
    const scaleXToMeter = d3.scale.linear()
                            .domain([0, sizeInPixels.width])
                            .range([0, sizeInMeter.width]);


    const scaleYToMeter = d3.scale.linear()
                            .domain([0, sizeInPixels.height])
                            .range([0, sizeInMeter.height]);
    const {x, y} = monitor.getClientOffset();
    BeaconActions.moveActiveBeacon({
      x: scaleXToMeter(x - position.x),
      y: scaleYToMeter(y - position.y)
    });
  },

  drop(props, monitor) {
    BeaconActions.placeBeacon(monitor.getItem().id);
  }
}

function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget()
  }
}

/**
 * Represents a DropTarget that allow to drop
 * {@link module:Visualizations/Position~Beacon}
 * @class
 * @memberOf module:Visualizations/Position
 * @augments external:Component
 */
class BeaconArea extends React.Component {
  static propTypes = {
    allBeacons: PropTypes.object.isRequired,
    sizeInPixels: PropTypes.object.isRequired,
    sizeInMeter: PropTypes.object.isRequired,
    activeBeacon: PropTypes.string
  }

  render() {
    const {connectDropTarget, allBeacons, activeBeacon,
           sizeInPixels, sizeInMeter, onClick} = this.props;

    const placedBeacons = [];
    const isActiveBeacon = _.equals(activeBeacon);

    for (let [beaconId, beaconPosition] of allBeacons.entries()) {
      if (beaconPosition && sizeInPixels) {
        placedBeacons.push(
          <g key={beaconId}>
              <PlacedBeacon beacon={beaconId} position={beaconPosition}
                            sizeInMeter={sizeInMeter}
                            sizeInPixels={sizeInPixels}
                            isActive={isActiveBeacon(beaconId)} />
          </g>
        );
      }
    }

    return connectDropTarget(
      <div onClick={onClick}>
          {sizeInPixels ?
           <svg width={sizeInPixels.width} height={sizeInPixels.height}>
               {placedBeacons}
           </svg> : ''}
      </div>
    )
  }
}

class PlacedBeacon extends React.Component {
  static propTypes = {
    beacon: PropTypes.string,
    position: PropTypes.object,
    sizeInPixels: PropTypes.object,
    sizeInMeter: PropTypes.object,
    isActive: PropTypes.bool
  }

  render() {
    const {beacon, position, sizeInMeter, sizeInPixels, isActive} = this.props;
    const xInMeter = `${Math.round(position.x * 100) / 100} m`;
    const yInMeter = `${Math.round(position.y * 100) / 100} m`;


    const scaleMeterToX = d3.scale.linear()
                            .domain([0, sizeInMeter.width])
                            .range([0, sizeInPixels.width]);

    const scaleMeterToY = d3.scale.linear()
                            .domain([0, sizeInMeter.height])
                            .range([0, sizeInPixels.height]);

    const xInPixels = scaleMeterToX(position.x);
    const yInPixels = scaleMeterToX(position.y);

    const textPadding = 10;
    return (
      <g className="beaconpos__navigationlines">
          <g>
              <text x={xInPixels - 19} y={yInPixels + 15} style={isActive? {display: 'none'} : {}}>
                  {beacon}
              </text>
          </g>
          <g style={isActive? {} : {display: 'none'}}>
              <text x={xInPixels / 2} y={yInPixels - textPadding}>
                  {xInMeter}
              </text>
              <line x1='0' y1={yInPixels} x2={xInPixels} y2={yInPixels}  />
              <text x={xInPixels - textPadding * 5} y={yInPixels / 2} >
                  {yInMeter}
              </text>
              <line x1={xInPixels} y1='0' x2={xInPixels} y2={yInPixels}  />
          </g>
      </g>
    );
  }
}

export default DropTarget(ItemTypes.BEACON, beaconAreaTarget, collect)(BeaconArea)
