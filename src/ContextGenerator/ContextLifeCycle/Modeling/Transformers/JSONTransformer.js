import Transformer from './Transformer';

/**
 * Represents a transformer for events which contain JSON as payload.
 *
 * @class
 * @memberOf module:ContextLifeCycle/Modeling
 * @implements {module:ContextLifeCycle/Modeling.Transformer}
 */
export default class JSONTransformer extends Transformer {
  transform(cpsEvent, contextDescription) {
    const {cps, entityType, entityName, attribute, statics} = contextDescription;
    const time = this.extractTime(cpsEvent);
    const value = this.extractValue(cpsEvent);

    const attributes = {
      [attribute]: {
        value,
        time,
        statics
      }
    };

    const transformedEvent = {
      cps,
      time,
      entities: [{
        type: entityType,
        name: entityName,
        time,
        attributes
      }]
    };

    return transformedEvent;
  }

  extractTime(event) {
    let {time} = event;
    if (!time) {
      time = new Date();
    }

    return time;
  }

  extractValue(event) {
    if (event.value) {
      return event.value;
    }

    return event;
  }
}
