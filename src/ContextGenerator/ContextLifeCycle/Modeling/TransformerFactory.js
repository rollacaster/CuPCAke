import JSONTransformer from './Transformers/JSONTransformer';
import OPCTransformer from './Transformers/OPCTransformer';

/**
 * Finds a transformer to transform a CPS event into context.
 * @memberOf module:ContextLifeCycle/Modeling
 * @param {string} modeling - Describes which transformer should be used.
 * @returns {module:ContextLifeCycle/Modeling.Transformer} A suitable transformer
*/
export default function TransformerFactory(modeling) {
  if (modeling === 'opc') {
    return new OPCTransformer();
  } else {
    return new JSONTransformer();
  }
}

