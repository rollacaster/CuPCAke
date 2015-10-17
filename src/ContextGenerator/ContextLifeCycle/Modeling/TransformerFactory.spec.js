/*jshint -W030 */
import {expect} from 'chai';
import TranformerFactory from './TransformerFactory';
import JSONTransformer from './Transformers/JSONTransformer';
import OPCTransformer from './Transformers/OPCTransformer';

describe('TranformerFactory', () => {
  it('should create an OPCTransformer', () => {
    const transformer = TranformerFactory({modeling: 'opc'});
    expect(transformer).to.be.ok;
  });

  it('should create a JSONTransformer', () => {
    const transformer = TranformerFactory({modeling: ''});
    expect(transformer).to.be.ok;
  });
});
