import {CPS, EntityType} from '../../../Storage/CPS';
import {expect} from 'chai';
import {cpsFixture, entityTypeFixture} from './EntityTypeController.fixtures';
import request from 'supertest';
import config from '../../../Config/Environment';
import mongoose from 'mongoose';

const address = config.url + ':' + config.port + '/v1';

describe('EntityTypeController', () => {
  let cps;
  let entityTypeToFind;
  let entityTypeToUpdate;
  let entityTypeToDelete;

  before(done => {
    //Create fixtures in database
    mongoose.connect(config.mongo.uri, config.mongo.options, () => {
      CPS.create(cpsFixture)
         .then(loadedCPS => {
           entityTypeFixture._parent = loadedCPS._id;
           cps = loadedCPS;
           const saveFixtures = [EntityType.create(entityTypeFixture),
                                 EntityType.create(entityTypeFixture),
                                 EntityType.create(entityTypeFixture)];

           return Promise.all(saveFixtures);
         })

         .then(savedFixtures => {
           entityTypeToFind = savedFixtures[0]._id;
           entityTypeToUpdate = savedFixtures[1];
           entityTypeToDelete = savedFixtures[2]._id;
           done();
         });
    });
  });

  after(done => {
    //Clear and drop database
    mongoose.connection.db.dropDatabase(() =>
      mongoose.connection.close(() => done())
    );
  });

  describe('get', () => {
    it('should get an EntityType', (done) => {
      request(address)
        .get(`/cps/${cps._id}/types/${entityTypeToFind}`)
        .expect(200)
        .end((err, res) => {
          if (err) { return done(err); }

          expect(res.body).to.include.keys('name', '_parent');
          expect(res.body.name).to.be.equal(entityTypeFixture.name);
          done();
        });
    });

    it('should get all EntityTypes of a CPS', (done) => {
      request(address)
        .get(`/cps/${cps._id}/types`)
        .expect(200)
        .end((err, res) => {
          if (err) { return done(err); }

          expect(res.body[0]).to.include.keys('name', '_parent');
          expect(res.body[0].name).to.be.equal(entityTypeFixture.name);
          expect(res.body[0]._parent).to.be.equal(cps._id.toString());
          done();
        });
    });
  });

  describe('post', () => {
    it('should create an EntityType', (done) => {
      request(address)
        .post(`/cps/${cps._id}/types`)
        .send(entityTypeFixture)
        .expect(201)
        .end((err, res) => {
          if (err) { return done(err); }

          expect(res.body).to.include.keys('_id', '_parent');
          expect(res.body.name).to.be.equal(entityTypeFixture.name);
          done();
        });
    });
  });

  describe('put', () => {
    it('should update an EntityType', (done) => {
      entityTypeToUpdate.name = 'new';

      request(address)
        .put(`/cps/${cps._id}/types/${entityTypeToUpdate._id}`)
        .send(entityTypeToUpdate)
        .expect(200)
        .end((err, res) => {
          if (err) { return done(err); }

          expect(res.body).to.include.keys('_id', '_parent');
          expect(res.body.name).to.be.equal('new');
          done();
        });
    });
  });

  describe('delete', () => {
    it('should delete an EntityType', (done) => {
      request(address)
        .delete(`/cps/${cps._id}/types/${entityTypeToDelete}`)
        .expect(204)
        .end((err, res) => {
          if (err) { return done(err); }

          EntityType.findOne({_id: entityTypeToDelete})
             .then(foundEntityType => expect(foundEntityType).to.be.null)
             .then(() => done());
        });
    });
  });
});
