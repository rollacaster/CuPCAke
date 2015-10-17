/*jshint -W030 */
import {expect} from 'chai';
import JSONTransformer from './JSONTransformer';

describe('JSONTransformer', function() {
  describe('transform', function() {
    it('should transform a JSON Event', function() {
      const time = new Date(1431867211000);

      const contextDescription = {
        cps: 'weather',
        entityType: 'LightSensor',
        entityName: 'LightSensor1',
        subscription: 'lightSensor1',
        attribute: 'light',
        statics: {type: 'Numeric'}
      };

      const event = {
        value: 20,
        time
      };

      const transformedEvent = {
        cps: 'weather',
        time: time,
        entities: [
          {
            type: 'LightSensor',
            name: 'LightSensor1',
            time: time,
            attributes: {
              light: {
                statics: {
                  type: 'Numeric'
                },
                time: time,
                value: 20
              }
            }
          }
        ]
      };
      const transformer = new JSONTransformer();
      expect(transformer.transform(event, contextDescription))
                        .to.deep.equal(transformedEvent);
    });
  });
});
