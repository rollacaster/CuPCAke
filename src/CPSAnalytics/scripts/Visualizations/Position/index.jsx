/** @module Visualizations/Position */
import React, {PropTypes} from 'react';
import {DragDropContext} from 'react-dnd';
import { Input } from 'react-bootstrap';
import HTML5Backend from 'react-dnd/modules/backends/HTML5';
import BeaconStore from './BeaconStore';
import connectToStores from 'alt/utils/connectToStores';
import BeaconHolder from './BeaconHolderComponent';
import BeaconArea from './BeaconAreaComponent';
import SizeForm from './SizeFormComponent';
import {Title} from '../../UI';
import {visBuilder} from '../../Helpers/Constants/Help';
import {Button} from '../../UI';
import heatmap from 'heatmap.js/heatmap.min.js';
import trilateration from './Trilateration';
import d3 from 'd3';

/**
 * Describes the format of position data.
 * @typedef {object} PositionData
 * @property {module:Visualizations/Position~Beacon[]}
   beacons - List of Beacons, which are visible for the
   current position
 * @property {string} unit - Name of the unit for distances.
 */

/**
 * Describes the format of  a Beacon.
 * @typedef {object} Beacon
 * @property {string} id - Id of the beacon
 * @property {number} dist - Distance between a beacon and a position.
 */


/**
 * Holds the current state of the beacons. Recevies all props from
 * {@link module:Visualizations/Position.BeaconStore}. Allows to set allows 
 * to set a background image.
 * @class
 * @memberOf module:Visualizations/Position
 * @augments external:Component
 */
@DragDropContext(HTML5Backend)
  @connectToStores
export default class BeaconPositioner extends React.Component {
  static getStores() {
    return [BeaconStore];
  }

  static getPropsFromStores() {
    return {
      beaconStore: BeaconStore.getState()
    }
  }

  state = {
    background: ''
  }

  handleFinishPlacing = () => {
    const {background} = this.state
    const {onFinishPlacing, beaconStore} = this.props;
    const {allBeacons, sizeInMeter} = beaconStore;
    onFinishPlacing({options: {allBeacons, sizeInMeter, background}});
  }

  loadBackground = () => {
    const fileInput = React.findDOMNode(this.refs.fileInput);
    fileInput.click();
  }

  changeBackground = (files) => {
    const file = document.getElementById('file').files[0];
    const imageType = /^image\//;

    if (!file) {
      return;
    } else if (!imageType.test(file.type)) {
      return;
    }

    const reader = new FileReader();
    reader.onload = (theFile =>
      e => this.setState({background: e.target.result})
    )(file);
    reader.readAsDataURL(file);
  }

  render() {
    const {background} = this.state;
    const {data, beaconStore, onFinishPlacing} = this.props;
    const {allBeacons, activeBeacon, sizeInMeter} = beaconStore;

    return (
      <div>
          <Title name="Beacon Positioner" help={visBuilder.beaconPositioner}/>
          <SizeForm/>
          <div className="beaconpos__container">
              <BeaconHolder beaconIds={allBeacons.keys()} onFinishPlacing={this.handleFinishPlacing}/>
              <BeaconContainer data={data}
                                allBeacons={allBeacons} activeBeacon={activeBeacon}
                                sizeInMeter={sizeInMeter} id="heatmap"
                                changeBackground={this.loadBackground}
                                background={background}/>
          </div>
          <input type="file" id="file" ref="fileInput"
                 style={{display: 'none'}} onChange={this.changeBackground}/>
      </div>
    )
  }
}

/**
 * Specifies the position of a container for the beacon and
 * computes the correct ratio with regard to the real container
 * size in meter.
 * @class
 * @memberOf module:Visualizations/Position
 * @augments external:Component
 */
export class BeaconContainer extends React.Component {
  state = {
    sizeInPixels: {width: 0, height: 0},
    position: {x: 0, y: 0}
  }

  setComponentPosition = areaRef => {
    if (React.findDOMNode(areaRef)) {
      const {top, left, width, height} = React.findDOMNode(areaRef).getBoundingClientRect();
      const {sizeInPixels} = this.state;

      if (sizeInPixels.width === 0) {
        this.setState({sizeInPixels: {width, height},
                       position: {x: left, y: top}});
      }
    }
  }

  render() {
    const {sizeInPixels, position} = this.state;
    const {id, data, background, sizeInMeter, allBeacons, activeBeacon, changeBackground} = this.props;

    const {width, height} = ratioHelper.adjustRatioToScreen(sizeInMeter, sizeInPixels, position);
    const backgroundStyle = {backgroundImage: `url('${background}')`,
                             backgroundSize: `${width}px ${height}px`,
                             backgroundRepeat: 'no-repeat',
                             width, height}

    return (
      <div className="beaconpos__areacontainer" ref={this.setComponentPosition}>
          <div className="beaconpos__area" style={backgroundStyle}>
              {!data? <BeaconArea allBeacons={allBeacons} sizeInPixels={{width, height}}
               sizeInMeter={sizeInMeter} activeBeacon={activeBeacon} onClick={changeBackground}
               position={position}/> :
                        <HeatMap id={id} data={data} sizeInMeter={sizeInMeter} allBeacons={allBeacons}
               sizeInPixels={{width, height}}/>
               }
          </div>
      </div>
    );
  }
}

const ratioHelper = {
  adjustRatioToScreen(sizeInMeter, sizeInPixels, position) {
    const windowHeight = window.innerHeight;
    const maxSize = windowHeight - position.y
    const areaRatio =  sizeInMeter.height / sizeInMeter.width;
    const height = sizeInPixels.width * areaRatio;
    const fitsNotOnScreen = height > maxSize;

    if (fitsNotOnScreen) {
      const scrollBarHeight = 20;
      const padding = 0.98;
      return {
        height: windowHeight - position.y - scrollBarHeight,
        width: (windowHeight - position.y - scrollBarHeight)  / areaRatio * padding
      }
    } else {
      return {width: sizeInPixels.width, height};
    }
  }
}


/**
 * HeatMap visualization.
 * @class
 * @augments external:Component
 * @todo extract to own file
 */
class HeatMap extends React.Component {
  static propTypes = {
    id: PropTypes.string,
    data: PropTypes.object,
    sizeInMeter: PropTypes.object,
    allBeacons: PropTypes.object,
    sizeInPixels: PropTypes.object
  }

  state = {
    visualization: ''
  }

  render() {
    const {id, sizeInPixels} = this.props;
    const {width, height} = sizeInPixels;

    return (
      <div id={id} className="visualization" style={{width, height}}/>
    );
  }

  componentDidUpdate() {
    const {visualization} = this.state;
    let {data, sizeInMeter, sizeInPixels, allBeacons, id} = this.props;

    //The visualization has to be set after the size could be determined
    if (!visualization && sizeInPixels.width > 0) {
      this.setState({visualization:heatmap.create({
        container: document.getElementById(id),
        maxOpacity: 0.5,
        minOpacity: 0.1
      })});
    }

    if (data && visualization) {
      const scaleMeterToX = d3.scale.linear()
                              .domain([0, sizeInMeter.width])
                              .range([0, sizeInPixels.width]);

      const scaleMeterToY = d3.scale.linear()
                              .domain([0, sizeInMeter.height])
                              .range([0, sizeInPixels.height]);

      //allBeacons is an array if it was loaded from a cookie
      if (Array.isArray(allBeacons)) {
        allBeacons = new Map(allBeacons);
      }

      for (let [beaconId, beaconPos] of allBeacons.entries()) {
        //TODO remove after updateing trilateration to work with strings
        if (typeof beaconPos[0] === 'string') {
          beaconPos = [parseInt(beaconPos[0]), beaconPos[1]];
        }
        trilateration.addBeacon(beaconId, trilateration.vector(beaconPos.x, beaconPos.y));
      }

      for (let label of Object.keys(data)) {
        const attributeData = data[label];
        for (let dataPoint of attributeData) {
          if (dataPoint.value) {
            for (let beacon of dataPoint.value.beacons) {
              trilateration.setDistance(beacon.id, beacon.dist);
            }
            const {x, y} = trilateration.calculatePosition();
            visualization.addData({
              x: scaleMeterToX(x),
              y: scaleMeterToY(y),
              value: {
                attribute: label,
                time: dataPoint.time
              }
            });
          }
        }
      }
    }
  }
}
