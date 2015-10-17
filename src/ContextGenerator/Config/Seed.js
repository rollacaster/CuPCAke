'use strict';
import {CPS, EntityType, Entity, Subscription} from '../Storage/CPS';
import Context from '../Storage/Context';
import os from 'os';
import log from '../Helper/Logger';
import * as lifeCycle from '../ContextLifeCycle';

const cps = {
  name: 'Chemical Factory',
  connections: [
    `opc.tcp://${os.hostname()}:4334`,
    `mqtt://localhost:7000`,
    `coap://localhost`
  ]
};

const factoryLineType = {
  name: 'Factory Line'
};

const line1Entity = {
  name: 'Base Line'
};

const line2Entity = {
  name: 'Acid Line'
};

const line3Entity = {
  name: 'Salt Line'
};

const subscriptionOPC1 = {
  cps: cps.name,
  entityType: factoryLineType.name,
  entityName: line1Entity.name,
  connection: cps.connections[0],
  subscription: 'ns=0;s=temperature_sensor_1',
  modeling: 'opc',
  sensed: ['Temperature'],
  statics: {type: 'Numeric'}
};

const subscriptionOPC2 = {
  cps: cps.name,
  entityType: factoryLineType.name,
  entityName: line2Entity.name,
  connection: cps.connections[0],
  subscription: 'ns=0;s=temperature_sensor_2',
  modeling: 'opc',
  sensed: ['Temperature'],
  statics: {type: 'Numeric'}
};

const subscriptionOPC3 = {
  cps: cps.name,
  entityType: factoryLineType.name,
  entityName: line3Entity.name,
  connection: cps.connections[0],
  subscription: 'ns=0;s=temperature_sensor_3',
  modeling: 'opc',
  sensed: ['Temperature'],
  statics: {type: 'Numeric'}
};

const subscriptionOPC4 = {
  cps: cps.name,
  entityType: factoryLineType.name,
  entityName: line1Entity.name,
  connection: cps.connections[0],
  subscription: 'ns=0;s=smoke_sensor_1',
  modeling: 'opc',
  sensed: ['CO2 Concentration'],
  statics: {type: 'Numeric'}
};

const subscriptionOPC5 = {
  cps: cps.name,
  entityType: factoryLineType.name,
  entityName: line2Entity.name,
  connection: cps.connections[0],
  subscription: 'ns=0;s=smoke_sensor_2',
  modeling: 'opc',
  sensed: ['CO2 Concentration'],
  statics: {type: 'Numeric'}
};

const subscriptionOPC6 = {
  cps: cps.name,
  entityType: factoryLineType.name,
  entityName: line3Entity.name,
  connection: cps.connections[0],
  subscription: 'ns=0;s=smoke_sensor_3',
  modeling: 'opc',
  sensed: ['CO2 Concentration'],
  statics: {type: 'Numeric'}
};

const robotType = {
  name: 'Firefighting Robot'
};

const robot1Entity = {
  name: 'Robot 1'
};

const robot2Entity = {
  name: 'Robot 2'
};

const robot3Entity = {
  name: 'Robot 3'
};

const subscriptionMQTT1 = {
  cps: cps.name,
  entityType: robotType.name,
  entityName: robot1Entity.name,
  connection: cps.connections[1],
  subscription: 'robots/robot1/position',
  modeling: 'json',
  sensed: ['Position'],
  statics: {type: 'Position'}
};

const subscriptionMQTT2 = {
  cps: cps.name,
  entityType: robotType.name,
  entityName: robot2Entity.name,
  connection: cps.connections[1],
  subscription: 'robots/robot2/position',
  modeling: 'json',
  sensed: ['Position'],
  statics: {type: 'Position'}
};

const subscriptionMQTT3 = {
  cps: cps.name,
  entityType: robotType.name,
  entityName: robot3Entity.name,
  connection: cps.connections[1],
  subscription: 'robots/robot3/position',
  modeling: 'json',
  sensed: ['Position'],
  statics: {type: 'Position'}
};

const removeFixtures = [CPS.find({}).remove(),
                        EntityType.find({}).remove(),
                        Entity.find({}).remove(),
                        Subscription.find({}).remove(),
                        Context.find({}).remove()];
let cpsId = 0;

Promise.all(removeFixtures).then(() => CPS.create(cps))
       .then(createdCPS => {
         factoryLineType._parent = createdCPS._id;
         robotType._parent = createdCPS._id;
         cpsId = createdCPS._id;
         const saveTypes = [EntityType.create(factoryLineType),
                            EntityType.create(robotType)];
         return Promise.all(saveTypes);
       })

       .then(types => {
         line1Entity._parent = types[0]._id;
         line2Entity._parent = types[0]._id;
         line3Entity._parent = types[0]._id;

         robot1Entity._parent = types[1]._id;
         robot2Entity._parent = types[1]._id;
         robot3Entity._parent = types[1]._id;

         const saveEntities = [Entity.create(line1Entity),
                               Entity.create(line2Entity),
                               Entity.create(line3Entity),
                               Entity.create(robot1Entity),
                               Entity.create(robot2Entity),
                               Entity.create(robot3Entity)];
         return Promise.all(saveEntities);
       })

       .then(entitys => {
         subscriptionOPC1._parent = entitys[0]._id;
         subscriptionOPC2._parent = entitys[1]._id;
         subscriptionOPC3._parent = entitys[2]._id;
         subscriptionOPC4._parent = entitys[0]._id;
         subscriptionOPC5._parent = entitys[1]._id;
         subscriptionOPC6._parent = entitys[2]._id;

         subscriptionMQTT1._parent = entitys[3]._id;
         subscriptionMQTT2._parent = entitys[4]._id;
         subscriptionMQTT3._parent = entitys[5]._id;

         const saveSubscriptions = [Subscription.create(subscriptionOPC1),
                                    Subscription.create(subscriptionOPC2),
                                    Subscription.create(subscriptionOPC3),
                                    Subscription.create(subscriptionOPC4),
                                    Subscription.create(subscriptionOPC5),
                                    Subscription.create(subscriptionOPC6),
                                    Subscription.create(subscriptionMQTT1),
                                    Subscription.create(subscriptionMQTT2),
                                    Subscription.create(subscriptionMQTT3)];
         return Promise.all(saveSubscriptions);
       })

       .then(subscriptions => {
         const subscribe = [lifeCycle.startAcquisition(cpsId, subscriptions[0]),
                            lifeCycle.startAcquisition(cpsId, subscriptions[1]),
                            lifeCycle.startAcquisition(cpsId, subscriptions[2]),
                            lifeCycle.startAcquisition(cpsId, subscriptions[3]),
                            lifeCycle.startAcquisition(cpsId, subscriptions[4]),
                            lifeCycle.startAcquisition(cpsId, subscriptions[5]),
                            lifeCycle.startAcquisition(cpsId, subscriptions[6]),
                            lifeCycle.startAcquisition(cpsId, subscriptions[7]),
                            lifeCycle.startAcquisition(cpsId, subscriptions[8])];
         return Promise.all(subscribe);
       })

       .then(updatedFixtures => log.info('Loaded seed.'))
       .catch(err => log.info(`Could not load seed. ${err}`));
