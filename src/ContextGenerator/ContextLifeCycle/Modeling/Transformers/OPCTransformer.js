import Transformer from './Transformer';

/**
 * Represents a transformer for events received via node-opcua.
 *
 * @class
 * @memberOf module:ContextLifeCycle/Modeling
 * @implements {module:ContextLifeCycle/Modeling.Transformer}
 */
export default class OPCTransformer extends Transformer {
  transform(cpsEvent, contextDescription) {
    let attributes = {};
    let transformedTime;

    if (!cpsEvent.sourceTimestamp) {
      transformedTime = new Date();
    } else {
      transformedTime =  new Date(cpsEvent.sourceTimestamp);
    }

    const {cps, entityType, entityName, attribute, statics} = contextDescription;

    attributes[attribute] = {
      time: transformedTime,
      value: cpsEvent.value.value,
      statics
    };

    const transformedEvent = {
      cps: cps,
      time: transformedTime,
      entities:[
        {
          type: entityType,
          name: entityName,
          time: transformedTime,
          attributes: attributes
        }
      ]
    };

    return transformedEvent;
  }
}
