import {CPS, Entity, EntityType} from '../../../../Storage/CPS';
import {expect} from 'chai';
import {cpsFixture, entityTypeFixture, entityFixture} from './EntityController.fixtures';
import request from 'supertest';
import config from '../../../../Config/Environment';
import mongoose from 'mongoose';

const address = config.url + ':' + config.port + '/v1';

describe('EntityController', () => {
  let cps;
  let entityType;
  let entityToFind;
  let entityToUpdate;
  let entityToDelete;

  before(done => {
    //Create fixtures in database
    const saveFixtures = [CPS.create(cpsFixture),
                          EntityType.create(entityTypeFixture)];

    mongoose.connect(config.mongo.uri, config.mongo.options, () => {
      Promise.all(saveFixtures)
             .then(savedFixtures => {
               cps = savedFixtures[0];
               entityType = savedFixtures[1];
               entityFixture._parent = entityType._id;
               const entityFixtures = [Entity.create(entityFixture),
                                       Entity.create(entityFixture),
                                       Entity.create(entityFixture)];
               return Promise.all(entityFixtures);
             })

             .then(entitys => {
               entityToFind = entitys[0]._id;
               entityToUpdate = entitys[1];
               entityToDelete = entitys[2]._id;
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
    it('should get an Entity', (done) => {
      request(address)
        .get(`/cps/${cps._id}/types/${entityType._id}/entitys/${entityToFind}`)
        .expect(200)
        .end((err, res) => {
          if (err) { return done(err); }

          expect(res.body).to.include.keys('_id', 'name', '_parent');
          expect(res.body.name).to.be.equal(entityFixture.name);
          done();
        });
    });

    it('should get all Entities of a type', (done) => {
      request(address)
        .get(`/cps/${cps._id}/types/${entityType._id}/entitys`)
        .expect(200)
        .end((err, res) => {
          if (err) { return done(err); }

          expect(res.body[0]).to.include.keys('_id', 'name', '_parent');
          expect(res.body[0].name).to.be.equal(entityFixture.name);
          expect(res.body[0]._parent).to.be.equal(entityType._id.toString());
          done();
        });
    });
  });

  describe('post', () => {
    it('should create an Entity', (done) => {
      request(address)
        .post(`/cps/${cps._id}/types/${entityType._id}/entitys`)
        .send(entityFixture)
        .expect(201)
        .end((err, res) => {
          if (err) { return done(err); }

          expect(res.body).to.include.keys('_parent');
          expect(res.body.name).to.be.equal(entityFixture.name);
          done();
        });
    });
  });

  describe('put', () => {
    it('should update a Entity', (done) => {
      entityToUpdate.name = 'new';

      request(address)
        .put(`/cps/${cps._id}/types/${entityType._id}/entitys/${entityToUpdate._id}`)
        .send(entityToUpdate)
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
    it('should delete an Entity', (done) => {
      request(address)
        .delete(`/cps/${cps._id}/types/${entityType._id}/entitys/${entityToDelete}`)
        .expect(204)
        .end((err, res) => {
          if (err) { return done(err); }

          Entity.findOne({_id: entityToDelete})
                .then(foundEntity => expect(foundEntity).to.be.null)
                .then(() => done());
        });
    });
  });
});
