/** @module ContextLifeCycle/Modeling */
import _ from 'lodash';
import TransformerFactory from './TransformerFactory';

/**
 * A Filter that merges a CPS event into a context.
 * @param {module:ContextLifeCycle~pipeInput} pipeInput - The input object of the pipeline.
 * @param {function} next - Calls the next filter of the pipe.
*/
export default function mergeContext(pipeInput, next) {
  const {context, event, contextDescription} = pipeInput;
  const transformer = TransformerFactory(contextDescription.modeling);
  const contextEvent = transformer.transform(event, contextDescription);
  context.time = contextEvent.time;
  mergeEntity(context.entities, contextEvent.entities[0]);
  next(null, context);
}

function mergeEntity(contextEntities, contextEventEntity) {
  const entityNames = _.pluck(contextEntities, 'name');
  const isNewEntity = !_.includes(entityNames, contextEventEntity.name);

  if (isNewEntity) {
    contextEntities.push(contextEventEntity);
  } else {
    const entityToBeUpdated = _.find(contextEntities,
                                     (entity) => entity.name === contextEventEntity.name);
    _.merge(entityToBeUpdated, contextEventEntity);
  }
}
