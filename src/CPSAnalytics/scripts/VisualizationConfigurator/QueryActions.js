import alt from '../../alt';

/**
 * Actions that allow to mutate the state of queries.
 * @class
 * @memberOf module:VisualizationConfigurator
 * @augments external:Action
*/
class QueryActions {
  constructor() {
    /**
     * Selects a CPS for a query.
     * @function cps
     * @param {object} cps - The selected cps.
     * @param {string} cps.name - The name of the cps.
     * @param {string} cps.id - The id of the cps.
     * @instance
     * @memberOf module:VisualizationConfigurator.QueryActions
     */

    /**
     * Selects an entity type for a query.
     * @function type
     * @param {object} type - The selected type.
     * @param {string} type.name - The name of the type.
     * @param {string} type.id - The id of the type.
     * @instance
     * @memberOf module:VisualizationConfigurator.QueryActions
     */

    /**
     * Selects an entity for a query.
     * @function entity
     * @param {object} entity - The selected entity.
     * @param {string} entity.name - The name of the entity.
     * @param {string} entity.id - The id of the entity.
     * @instance
     * @memberOf module:VisualizationConfigurator.QueryActions
     */

    /**
     * Selects an attribute type for a query.
     * @function attributeType
     * @param {object} attributeType - The selected attribute type.
     * @param {string} attributeType.name - The name of the attribute type.
     * @param {string} attributeType.id - The id of the attribute type.
     * @instance
     * @memberOf module:VisualizationConfigurator.QueryActions
     */

    /**
     * Selects an attribute for a query.
     * @function attribute
     * @param {object} attribute - The selected attribute.
     * @param {string} attribute.name - The name of the attribute.
     * @param {string} attribute.id - The id of the attribute.
     * @instance
     * @memberOf module:VisualizationConfigurator.QueryActions
     */

    /**
     * Adds the selected QueryItems as a Query.
     * @function add
     * @param {string} label - Label of the query.
     * @instance
     * @memberOf module:VisualizationConfigurator.QueryActions
     */

    /**
     * Clears the saved queries.
     * @function clear
     * @instance
     * @memberOf module:VisualizationConfigurator.QueryActions
     */

    this.generateActions('cps', 'type', 'entity',
                         'attribute', 'attributeType',
                         'add', 'clear');
  }
}

export default alt.createActions(QueryActions);
