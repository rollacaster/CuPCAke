import {CPS, EntityType, Entity, Subscription} from '../../../../../Storage/CPS';
import {expect} from 'chai';
import {cpsFixture, entityTypeFixture, entityFixture,
        subscriptionFixture, subscriptionFixtureMQTT,
        subscriptionFixtureCoAP} from './SubscriptionController.fixtures';
import request from 'supertest';
import config from '../../../../../Config/Environment';
import mongoose from 'mongoose';

const address = config.url + ':' + config.port + '/v1';

describe('SubscriptionController', function() {
  let cps;
  let entityType;
  let entity;
  let subscriptionToDelete;

  before(done => {
    //Create fixtures in database
    mongoose.connect(config.mongo.uri, config.mongo.options, () => {
      CPS.create(cpsFixture)
         .then(loadedCPS => {
           cps = loadedCPS;
           entityTypeFixture._parent = cps._id;
           return EntityType.create(entityTypeFixture);
         })

         .then(loadedType => {
           entityType = loadedType;
           entityFixture._parent = entityType._id;
           return Entity.create(entityFixture);
         })

         .then(loadedEntity => {
           entity = loadedEntity;
           subscriptionFixture._parent = entity._id;
           subscriptionFixtureMQTT._parent = entity._id;
           subscriptionFixtureCoAP._parent = entity._id;
           return Subscription.create(subscriptionFixture);
         })

         .then(() => done());
    });
  });

  after(done => {
    //Clear and drop database
    mongoose.connection.db.dropDatabase(() =>
      mongoose.connection.close(() => done())
    );
  });

  describe('get', () => {
    it('should load all subscriptions of an entity', (done) => {
      request(address)
          .get(`/cps/${cps._id}/types/${entityType._id}/entitys/${entity._id}/subscriptions`)
          .expect(200)
          .end((err, res) => {
            if (err) { return done(err); }

            expect(res.body[0]).to.include.keys('_id', 'subscription', 'connection', '_parent');
            expect(res.body[0].subscription).to.be.equal('ns=0;s=temperature_sensor_3');
            expect(res.body[0]._parent).to.be.equal(entity._id.toString());
            done();
          });
    });
  });

  describe('post', () => {
    it('should create a Subscription via OPC', (done) => {
      subscribe(subscriptionFixture, done);
    });

    it('should create a Subscription via MQTT', (done) => {
      subscribe(subscriptionFixtureMQTT, done);
    });

    it('should create a Subscription via MQTT', (done) => {
      subscribe(subscriptionFixtureCoAP, done);
    });
  });

  describe('put', () => {
    it('should update a Subscription', (done) => {
      createSubscription().then(activeSubscription => {
        activeSubscription.subscription = 'ns=0;s=temperature_sensor_2';

        request(address)
          .put(`/cps/${cps._id}/types/${entityType._id}/entitys/${entity._id}/subscriptions/${activeSubscription._id}`)
          .send(activeSubscription)
          .expect(200)
          .end((err, res) => {
            if (err) { return done(err); }

            expect(res.body).to.include.keys('_id', 'subscription', 'connection', '_parent');
            expect(res.body.subscription).to.be.equal('ns=0;s=temperature_sensor_2');
            done();
          });
      });
    });
  });

  describe('delete', () => {
    it('should delete an Subscription', (done) => {
      request(address)
        .delete(`/cps/${cps._id}/types/${entityType._id}/entitys/${entity._id}/subscriptions/${subscriptionToDelete}`)
        .expect(204)
        .end((err, res) => {
          if (err) { return done(err); }

          Subscription.findOne({_id: subscriptionToDelete})
                      .then(found => expect(found).not.to.be.ok)
                      .then(() => done());
        });
    });
  });

  function createSubscription() {
    return new Promise((resolve, reject) => {
      request(address)
       .post(`/cps/${cps._id}/types/${entityType._id}/entitys/${entity._id}/subscriptions`)
       .send(subscriptionFixture)
       .end((err, res) => {
         if (err) { return reject(err); }

         subscriptionToDelete = res.body._id;
         resolve(res.body);
       });
    });
  }

  function subscribe(data, done) {
    request(address)
      .post(`/cps/${cps._id}/types/${entityType._id}/entitys/${entity._id}/subscriptions`)
      .send(data)
      .expect(201)
      .end((err, res) => {
        if (err) { return done(err); }

        expect(res.body).to.include.keys('_id', 'subscription', 'connection', '_parent');
        done();
      });
  }
});
