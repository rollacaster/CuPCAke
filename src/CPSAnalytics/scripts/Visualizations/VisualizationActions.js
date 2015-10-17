import alt from '../../alt';

/**
 * Actions that allow to mutate the state of visualizations.
 * @class
 * @memberOf module:Visualizations
 * @augments external:Action
 */
class VisualizationActions {
  constructor() {
    /**
     * Starts a stream that receives context information.
     * @function startStream
     * @param {object} contextSubscription - The ContextSubscription.
     * @param {string} contextSubscription.topic - The MQTT topic the contexts should be sent to.
     * @param {?boolean} contextSubscription.realtime - True if subscription disseminates realtime events.
     * @param {?date} contextSubscription.start - Start time for the dissemination of context.
     * @param {object[]} contextSubscription.queries - List of queries specifying which data should be disseminated.
     * @param {string} contextSubscription.queries[].cps - The CPS of the query.
     * @param {string} contextSubscription.queries[].type - The entity type of the query.
     * @param {string} contextSubscription.queries[].entity - The entity of the query.
     * @param {string} contextSubscription.queries[].attribute - The attribute of the query.
     * @instance
     * @memberOf module:Visualizations.VisualizationActions
     */

    /**
     * Stops a stream that receives context information.
     * @function stopStream
     * @param {string} topic - The topic of the stream.
     * @instance
     * @memberOf module:Visualizations.VisualizationActions
     */

    /**
     * Adds data which was received by a stream.
     * @function newData
     * @param {object} visData - The new data.
     * @param {string} topic - The topic of th stream.
     * @instance
     * @memberOf module:Visualizations.VisualizationActions
     */
    this.generateActions('startStream', 'stopStream', 'newData');
  }
}

export default alt.createActions(VisualizationActions);
