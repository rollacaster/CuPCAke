/*jshint -W030 */
import {expect} from 'chai';
import OPCTransformer from './OPCTransformer';

describe('OPCTransformer', function() {
  describe('transform', function() {
    it('should transform an OPC Event', function() {
      const contextDescription = {
        entityType: 'TemperatureSensor',
        entityName: 'TemperatureSensor#1',
        attribute: 'temperature',
        cps: 'weather',
        statics: {
          type: 'Numeric'
        }
      };

      const event = {
        value:
        { dataType: undefined,
          arrayType: undefined,
          value: 17859 },
        statusCode: { value: 0, description: 'No Error', name: 'Good' },
        sourceTimestamp: 'Sun May 17 2015 14:53:31 GMT+0200 (CEST)',
        sourcePicoseconds: 0,
        serverTimestamp: null,
        serverPicoseconds: 0
      };

      const transformedEvent = {
        cps: 'weather',
        time: new Date('Sun May 17 2015 14:53:31 GMT+0200 (CEST)'),
        entities: [
          {
            type: 'TemperatureSensor',
            name: 'TemperatureSensor#1',
            time: new Date('Sun May 17 2015 14:53:31 GMT+0200 (CEST)'),
            attributes: {
              temperature: {
                statics: {
                  type: 'Numeric'
                },
                time: new Date('Sun May 17 2015 14:53:31 GMT+0200 (CEST)'),
                value: 17859
              }
            }
          }
        ]
      };

      const transformer = new OPCTransformer();
      expect(transformer.transform(event, contextDescription))
                        .to.deep.equal(transformedEvent);
    });
  });
});
