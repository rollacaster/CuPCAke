import log from '../ContextGenerator/Helper/Logger';
import mqttBroker from 'mosca';
import mqtt from 'mqtt';

const settings =   {
  port: 7000,
  backend: {
    type: 'mongo',
    pubsubCollection: 'events',
    mongo: {},
    url: 'mongodb://localhost/projecttemplate-test'
  },
  persistence: {
    factory: mqttBroker.persistence.Mongo,
    url: 'mongodb://localhost/projecttemplate-test'
  },
  http: {
    port: 3000,
    bundle: true,
    static: './'
  }
};

let broker = new mqttBroker.Server(settings);

broker.on('ready', function() {
  log.info('MQTT Test-Broker sending over websockets on port', settings.http.port);
});

//Test-Client publishing data
const client = mqtt.connect('mqtt://127.0.0.1:7000');

const beacon1Pos = {x: 4, y: 11};
const beacon2Pos = {x: 16, y: 2};
const beacon3Pos = {x: 35, y: 19};

const robot1Name = 'robot1';
const robot2Name = 'robot2';
const robot3Name = 'robot3';

const robot1Path =  [
  {x: 7, y: 18},
  {x: 18, y: 18},
  {x: 18, y: 14},
  {x: 21, y: 14},
  {x: 21, y: 10}
];

const robot2Path =  [
  {x: 33.5, y: 11},
  {x: 33.5, y: 6}
];

const robot3Path = [
  {x: 18.5, y: 3}
];

const line2Path = [
  {x: 20, y: 11},
  {x: 25, y: 11},
  {x: 25, y: 5},
  {x: 35, y: 5},
  {x: 35, y: 1.5},
  {x: 20, y: 1.5}
];

const speedInMeterPerSecond = 2;
let walkIndex1 = 0;
let walkIndex2 = 0;
let walkIndex3 = 0;

client.on('connect', () => {
  setTimeout(() => {
    setInterval(() => {
      if (walkIndex1 < robot1Path.length - 1) {
        walkRobot(robot1Path[walkIndex1], robot1Path[walkIndex1 + 1], robot1Name, speedInMeterPerSecond);
        walkIndex1++;
      }
    }, 1000);

    setInterval(() => {
      if (walkIndex2 < robot2Path.length - 1) {
        walkRobot(robot2Path[walkIndex2], robot2Path[walkIndex2 + 1], robot2Name, speedInMeterPerSecond);
        walkIndex2++;
      }
    }, 2000);

    setInterval(() => {
      if (walkIndex3 < robot3Path.length - 1) {
        walkRobot(robot3Path[walkIndex3], robot3Path[walkIndex3 + 1], robot3Name, speedInMeterPerSecond);
        walkIndex3++;
      }
    }, 3000);

    setTimeout(() => {
      setInterval(() => walkAroundLine2(robot1Path[robot1Path.length - 1], robot1Name), 1000);
    }, 4000);
  }, 10000);
});

let walkAroundIndex = 0;

function walkAroundLine2(start, robot) {
  let startPointIndex = 0;
  let distToStartPoint = Number.MAX_VALUE;
  let index = 0;
  for (let line2Postition of line2Path) {
    const dist = euclidDist(line2Postition, start);
    if (dist < distToStartPoint) {
      distToStartPoint = dist;
      startPointIndex = index;
    }

    index++;
  }

  const startPoint = line2Path[startPointIndex];
  if (walkAroundIndex == line2Path.length - 1) {
    walkAroundIndex = 0;
  }

  walkRobot(line2Path[walkAroundIndex], line2Path[walkAroundIndex + 1],
            robot, speedInMeterPerSecond);
  walkAroundIndex++;
}

function publishRobotPosition(position, robot) {
  //console.log(`Position: ${position.x} ${position.y}`);
  const beacon1Dist = euclidDist(position, beacon1Pos);
  const beacon2Dist = euclidDist(position, beacon2Pos);
  const beacon3Dist = euclidDist(position, beacon3Pos);
  const beaconData = {
    beacons: [
      {id: 'Beacon1', dist: beacon1Dist},
      {id: 'Beacon2', dist: beacon2Dist},
      {id: 'Beacon3', dist: beacon3Dist}
    ]
  };

  client.publish(`robots/${robot}/position`, JSON.stringify(beaconData));
}

function walkRobot(start, end, robot, speed) {
  if (!end) {
    end = start;
  }

  const hasToWalkHorizontal = start.x != end.x;
  const hasToWalkVertical = start.y != end.y;
  let distanceToWalk = euclidDist(start, end);
  let newPosition = start;
  const positions = [];
  do {
    distanceToWalk -= speed;
    if (hasToWalkHorizontal) {
      const hasToWalkRight = start.x < end.x;
      if (hasToWalkRight) {
        const walkRight = newPosition.x + speed;
        const isArrived = walkRight > end.x;
        if (isArrived) {
          newPosition = {x: end.x, y: start.y};
        } else {
          newPosition = {x: walkRight, y: start.y};
        }
      } else {
        const walkLeft = newPosition.x - speed;
        const isArrived = walkLeft <= end.x;
        if (isArrived) {
          newPosition = {x: end.x, y: start.y};
        } else {
          newPosition = {x: walkLeft, y: start.y};
        }
      }
    }

    if (hasToWalkVertical) {
      const hasToWalkUp = start.y < end.y;
      if (hasToWalkUp) {
        const walkUp = newPosition.y + speed;
        const isArrived = walkUp > end.y;
        if (isArrived) {
          newPosition = {x: start.x, y: end.y};
        } else {
          newPosition = {x: start.x, y: walkUp};
        }
      } else {
        const walkDown = newPosition.y - speed;
        const isArrived = walkDown <= end.y;
        if (isArrived) {
          newPosition = {x: start.x, y: end.y};
        } else {
          newPosition = {x: start.x, y: walkDown};
        }
      }
    }

    positions.push(newPosition);
  } while (distanceToWalk > 0);

  let posIndex = 0;
  setInterval(() => {
    if (posIndex < positions.length - 1) {
      publishRobotPosition(positions[posIndex], robot);
      posIndex++;
    }
  }, 1000);
}

function euclidDist(point1, point2) {
  return Math.sqrt(Math.pow(point1.x - point2.x, 2) +
                   Math.pow(point1.y - point2.y, 2));
}
