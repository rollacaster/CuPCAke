/*jshint -W030 */
import Modeling from './index';
import {cpsEvents, contexts, descriptions} from './Modeling.fixtures';
import {expect} from 'chai';
import Context from '../../Storage/Context';
import Pipeline from 'pipes-and-filters';

describe('Modeling', function() {
  let modelingPipeline;

  before(function() {
    modelingPipeline = Pipeline.create();
    modelingPipeline.use(Modeling);
  });

  function testContextMatch(event, contextDescription, context, expectedContext, done) {
    const pipeInput = {event, context, contextDescription};
    modelingPipeline.execute(pipeInput, (err, mergedContext) => {
      expect(err).to.be.null;
      expect(mergedContext).to.deep.equal(expectedContext);
      done();
    });
  }

  describe('mergeContext', function() {
    it('should merge a person', function(done) {
      testContextMatch(cpsEvents.person, descriptions.person,
                       contexts.initial, contexts.person,
                       done);
    });

    it('should merge a temperaturesensor', function(done) {
      testContextMatch(cpsEvents.temperature, descriptions.temperature,
                       contexts.person, contexts.temperature,
                       done);
    });

    it('should updated a person', function(done) {
      testContextMatch(cpsEvents.personUpdate, descriptions.person,
                       contexts.temperature, contexts.personUpdate,
                       done);
    });
  });
});
