/*jshint -W030 */
import {CPS} from '../../Storage/CPS';
import {expect} from 'chai';
import {cps, invalidConnectionCPS} from './CPSController.fixtures';
import request from 'supertest';
import config from '../../Config/Environment';
import mongoose from 'mongoose';

const address = config.url + ':' + config.port + '/v1';

describe('CPSController', () => {
  let cpsToFind;
  let cpsToUpdate;
  let cpsToDelete;

  before(done => {
    //Create fixtures in database
    mongoose.connect(config.mongo.uri, config.mongo.options, () => {
      const saveFixtures = [CPS.create(cps), CPS.create(cps), CPS.create(cps)];
      Promise.all(saveFixtures).then(savedCPS => {
        cpsToFind = savedCPS[0]._id;
        cpsToUpdate = savedCPS[1];
        cpsToDelete = savedCPS[2]._id;
      }).then(() => done());
    });
  });

  after(done => {
    //Clear and drop database
    mongoose.connection.db.dropDatabase(() =>
      mongoose.connection.close(() => done())
    );
  });

  describe('get', () => {
    it('should get a cps', (done) => {
      request(address)
        .get(`/cps/${cpsToFind}`)
        .expect(200)
        .end((err, res) => {
          if (err) { return done(err); }

          expect(res.body).to.include.keys('_id', 'connections');
          expect(res.body.name).to.be.equal(cps.name);
          done();
        });
    });

    it('should get all cps', (done) => {
      request(address)
        .get(`/cps/`)
        .expect(200)
        .end((err, res) => {
          if (err) { return done(err); }

          expect(res.body).to.be.an.array;
          expect(res.body[0]).to.include.keys('_id', 'connections');
          expect(res.body[0].name).to.be.equal(cps.name);
          done();
        });
    });
  });

  describe('post', () => {
    it('should create a CPS', done => {
      request(address)
        .post('/cps')
        .send(cps)
        .expect(201)
        .end((err, res) => {
          if (err) { return done(err); }

          expect(res.body).to.include.keys('_id', 'connections');
          expect(res.body.name).to.be.equal(cps.name);
          done();
        });
    });

    it('should not create a new cps', (done) => {
      request(address)
        .post('/cps')
        .send(invalidConnectionCPS)
        .expect(500)
        .end((err, res) => {
          if (err) { return done(err); }

          expect(res.body.error.hostname).to.be.equal(invalidConnectionCPS.connections[0]);
          done();
        });
    });
  });

  describe('put', () => {
    it('should update a connected cps', (done) => {
      cpsToUpdate.name = 'new';

      request(address)
        .put(`/cps/${cpsToUpdate._id}`)
        .send(cpsToUpdate)
        .expect(200)
        .end((err, res) => {
          if (err) { return done(err); }

          expect(res.body).to.include.keys('_id', 'connections');
          expect(res.body.name).to.be.equal('new');
          done();
        });
    });
  });

  describe('delte', () => {
    it('should delete a connected cps', (done) => {
      request(address)
        .delete(`/cps/${cpsToDelete}`)
        .expect(200)
        .end((err, res) => {
          if (err) { return done(err); }

          CPS.findOne({_id: cpsToDelete})
             .then(foundCPS => expect(foundCPS).to.be.null)
             .then(() => done());
        });
    });
  });

  describe('browse', () => {
    it('should browse a cps', (done) => {
      request(address)
     .get(`/cps/${cpsToFind}/browse?connection=${cps.connections[0]}`)
     .expect(200)
     .end((err, res) => {
       if (err) { return done(err); }

       expect(res.body[0]).to.include.keys('name', 'id', 'isFolder');
       done();
     });
    });
  });
});
