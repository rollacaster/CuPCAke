import {expect} from 'chai';
import transformC3 from './C3TransformerGenerator';

describe('C3Transformer', () => {
  describe('transform for c3', () => {
    it('should transform data to be used for a c3 graph', () => {
      const data = [
        {
          time: new Date(1370044700000),
          value: 17859
        },
        {
          time: new Date(1370044800000),
          value: 17860
        },
        {
          time: new Date(1370044900000),
          value: 17861
        }
      ];

      const c3Data = {
        bindto: `#visualization`,
        data: {
          x: 'x',
          xFormat: '%Y-%m-%d %H:%M:%S',
          columns: [
            ['x',
             '2013-06-01 01:58:20',
             '2013-06-01 02:00:0',
             '2013-06-01 02:01:40'
            ],
            ['test', 17859, 17860, 17861]
          ]
        },
        axis: {
          x: {
            type: 'timeseries',
            tick: {
              count: 5,
              format: '%Y-%m-%d %H:%M:%S'
            }
          }
        }
      };

      expect(transformC3('timeseries', 'test', data)).to.be.deep.equal(c3Data);
    });
  });
});
