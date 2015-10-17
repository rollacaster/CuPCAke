const beacons = new Map();
const sqr = function(a) {
  return Math.pow(a, 2);
};

export default {
  vector(x, y) {
    return {
      x: x,
      y: y
    };
  },

  setDistance(index, distance) {
    let beacon = beacons.get(index);
    beacon.dis = distance;
    beacons.set(index, beacon);
  },

  addBeacon(index, {x, y}) {
    let beacon = beacons.get(index) || {};
    beacon.x = x;
    beacon.y = y;
    beacons.set(index, beacon);
  },

  calculatePosition() {
    if (beacons.length < 3) {
      console.error('Error! Please add at least three beacons!');
      return {x: 0, y: 0};
    }

    let j;
    let k;
    let x;
    let y;
    const beaconKeys = [...beacons.keys()];

    k = (sqr(beacons.get(beaconKeys[0]).x) + sqr(beacons.get(beaconKeys[0]).y) - sqr(beacons.get(beaconKeys[1]).x) - sqr(beacons.get(beaconKeys[1]).y) - sqr(beacons.get(beaconKeys[0]).dis) + sqr(beacons.get(beaconKeys[1]).dis)) / (2 * (beacons.get(beaconKeys[0]).y - beacons.get(beaconKeys[1]).y)) - (sqr(beacons.get(beaconKeys[0]).x) + sqr(beacons.get(beaconKeys[0]).y) - sqr(beacons.get(beaconKeys[2]).x) - sqr(beacons.get(beaconKeys[2]).y) - sqr(beacons.get(beaconKeys[0]).dis) + sqr(beacons.get(beaconKeys[2]).dis)) / (2 * (beacons.get(beaconKeys[0]).y - beacons.get(beaconKeys[2]).y));
    j = (beacons.get(beaconKeys[2]).x - beacons.get(beaconKeys[0]).x) / (beacons.get(beaconKeys[0]).y - beacons.get(beaconKeys[2]).y) - (beacons.get(beaconKeys[1]).x - beacons.get(beaconKeys[0]).x) / (beacons.get(beaconKeys[0]).y - beacons.get(beaconKeys[1]).y);
    x = k / j;
    y = ((beacons.get(beaconKeys[1]).x - beacons.get(beaconKeys[0]).x) / (beacons.get(beaconKeys[0]).y - beacons.get(beaconKeys[1]).y)) * x + (sqr(beacons.get(beaconKeys[0]).x) + sqr(beacons.get(beaconKeys[0]).y) - sqr(beacons.get(beaconKeys[1]).x) - sqr(beacons.get(beaconKeys[1]).y) - sqr(beacons.get(beaconKeys[0]).dis) + sqr(beacons.get(beaconKeys[1]).dis)) / (2 * (beacons.get(beaconKeys[0]).y - beacons.get(beaconKeys[1]).y));

    return {x, y};
  }
};
