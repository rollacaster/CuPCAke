import React from 'react';
import qs from 'qs';
import Formsy from 'formsy-react';
import {FormInput} from '../UI/Forms/FormElements';
import {modals} from '../Helpers/Constants';
import {Button, Modal} from '../UI';
import ModalActions from '../UI/ModalActions';
import NumericVisualization from '../Visualizations/Numeric';
import BeaconActions from '../Visualizations/Position/BeaconActions';
import PositionVisualization from '../Visualizations/Position';
import VisualizationActions from '../Visualizations/VisualizationActions';
import VisualizationStore from '../Visualizations/VisualizationStore';
import connectToStores from 'alt/utils/connectToStores';
import uuid from 'uuid';

/**
 * Allows to customize a visualization and save it to the Dashboard.
 * Gets all props from {@link Visualizations.VisualizationStore}
 * @class
 * @augments external:Component
 * @memberOf module:VisualizationConfigurator
 */
@connectToStores
export default class VisualizationBuilder extends React.Component {
  static getStores() {
    return [VisualizationStore];
  }

  static getPropsFromStores() {
    return {
      VisualizationStore: VisualizationStore.getState()
    }
  }
  state = {
    options: {},
  }

  handleOptionChange = (options) => {
    this.setState({options});
  }

  saveVisToDashboard = (formData) => {
    const subscription = qs.parse(this.props.params.query);
    const {options, topic} = this.state;
    subscription.name = formData.name;
    subscription.topic = topic;

    const savedVisualizations = JSON.parse(localStorage.getItem('dashboard')) || [];
    savedVisualizations.push({subscription, options});
    localStorage.setItem('dashboard', JSON.stringify(savedVisualizations));
    ModalActions.toogleModal(modals.saveVisualization);
  }

  enableButton = () => { this.setState({canSubmit: true}) }

  disableButton = () => { this.setState({canSubmit: false}) }

  handleFinishPlacing = (options) => {
    const {topic} = this.state;
    const query = qs.parse(this.props.params.query);
    query.topic = topic;
    VisualizationActions.startStream({contextSubscription: query});
    this.setState(options);
  }

  render() {
    const {options, topic} = this.state;
    const {visData} = this.props.VisualizationStore;
    const {queryType} = qs.parse(this.props.params.query);
    const data = visData.get(topic);
    let labels = [];
    let dataReceived;
    if (data) {
      labels = Object.keys(data);
      dataReceived = labels.length > 0;
    }

    let visualization;
    if(queryType === 'Numeric' && dataReceived)
      visualization = (
        <NumericVisualization data={data} labels={labels}
                              options={options} onOptionChange={this.handleOptionChange}/>
      );
    else if(queryType === 'Numeric') {
      visualization = (<span>Waiting to receive data...</span>);
    }
    else {
      visualization = (
        <PositionVisualization data={data} onFinishPlacing={this.handleFinishPlacing}/>
      );
    }

    return (
      <div className="content">
          <div className="visualization">
              {visualization}
          </div>
          <Modal text='Add to dashboard'
                 id={modals.saveVisualization} wide primary>
              <Formsy.Form onValidSubmit={this.saveVisToDashboard} onValid={this.enableButton}
                           onInvalid={this.disableButton}>
                  <FormInput name="name" type="text" text="Visualization Name" required/>
                  <Button text="Add to dashboard" type="submit" disabled={!this.state.canSubmit}/>
              </Formsy.Form>
          </Modal>
      </div>
    );
  }

  componentDidMount() {
    const query = qs.parse(this.props.params.query);
    const topic = uuid.v1();
    query.topic = topic;
    this.setState({topic});
    if (query.queryType === 'Numeric') {
      VisualizationActions.startStream({contextSubscription: query, numeric: true});
    }
  }

  componentWillUnmount() {
    const {topic} = this.state;
    const query = qs.parse(this.props.params.query);

    if (query.realtime) {
      VisualizationActions.stopStream(topic);
    }
  }
}
