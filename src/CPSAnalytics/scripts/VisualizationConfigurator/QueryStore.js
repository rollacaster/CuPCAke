//jscs:disable safeContextKeyword
import alt from '../../alt';
import QueryActions from './QueryActions';
import ModalActions from '../UI/ModalActions';
import {modals} from '../Helpers/Constants';

/**
 * Stores the state of all queries.
 * @class
 * @memberOf module:VisualizationConfigurator
 * @augments external:Store
 */
class QueryStore {
  constructor() {
    this.bindActions(QueryActions);
    this.cps = null;
    this.type = null;
    this.entity = null;
    this.attribute = null;
    this.attributeType = null;
    this.queries = new Map();
  }

  /**
   * @see {@link module:VisualizationConfigurator.QueryActions#cps}
   * @function onCPS
   * @instance
   * @memberOf module:VisualizationConfigurator.QueryStore
   */
  onCPS(cps) {
    this.cps = cps;
    this.type = null;
    this.entity = null;
    this.attribute = null;
    this.attributeType = null;
  }

  /**
   * @see {@link module:VisualizationConfigurator.QueryActions#type}
   * @function onTypeChange
   * @instance
   * @memberOf module:VisualizationConfigurator.QueryStore
   */
  onTypeChange(type) {
    this.type = type;
    this.entity = null;
    this.attribute = null;
    this.attributeType = null;
  }

  /**
   * @see {@link module:VisualizationConfigurator.QueryActions#entity}
   * @function onEntity
   * @instance
   * @memberOf module:VisualizationConfigurator.QueryStore
   */
  onEntity(entity) {
    this.entity = entity;
    this.attribute = null;
    this.attributeType = null;
  }

  /**
   * @see {@link module:VisualizationConfigurator.QueryActions#attributeType}
   * @function onAttributeType
   * @instance
   * @memberOf module:VisualizationConfigurator.QueryStore
   */
  onAttributeType(attributeType) {
    this.attributeType = attributeType;
    this.attribute = null;
  }

  /**
   * @see {@link module:VisualizationConfigurator.QueryActions#attribute}
   * @function onAttribute
   * @instance
   * @memberOf module:VisualizationConfigurator.QueryStore
   */
  onAttribute(attribute) {
    this.attribute = attribute;
  }

  /**
   * @see {@link module:VisualizationConfigurator.QueryActions#add}
   * @function onAdd
   * @instance
   * @memberOf module:VisualizationConfigurator.QueryStore
   */
  onAdd(label) {
    const {cps, type, entity, attribute, attributeType} = this;
    const invalidQuery = !cps || !type || !entity || !attribute;

    if (invalidQuery) {
      const err = new Error('Query not complete.');
      err.query({cps, type, entity, attribute});
      throw err;
    }

    if (this.queryType && this.queryType != attributeType) {
      const err = new Error('Your queries may not contain different attribute types.');
      err.query = {cps, type, entity, attribute, attributeType};
      throw err;
    }

    this.queries.set(label, {cps: cps.name,
                             type:type.name,
                             entity: entity.name,
                             attribute,
                             label});

    this.queryType = attributeType;
    ModalActions.toogleModal.defer(modals.createQuery);
  }

  /**
   * @see {@link module:VisualizationConfigurator.QueryActions#clear}
   * @function onClear
   * @instance
   * @memberOf module:VisualizationConfigurator.QueryStore
   */
  onClear() {
    this.queries = new Map();
    this.queryType = null;
  }
}

export default alt.createStore(QueryStore, 'QueryStore');
