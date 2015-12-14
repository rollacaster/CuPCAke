/** @module VisualizationConfigurator */
import React, {PropTypes} from 'react';
import Formsy from 'formsy-react';
import qs from 'qs';
import _ from 'ramda';
import connectToStores from 'alt/utils/connectToStores';
import CPSActions from '../CPSConfigurator/CPSActions';
import CPSStore from '../CPSConfigurator/CPSStore';
import QueryActions from './QueryActions';
import QueryStore from './QueryStore';
import {OverlayTrigger, Popover} from 'react-bootstrap';
import {FormInput} from '../UI/Forms/FormElements';
import {Modal, Title, Button, RadioButtons, LinkButton} from '../UI';
import {attributeTypes, modals} from '../Helpers/Constants';
import {visBuilder} from '../Helpers/Constants/Help';

/**
 * Allows to specify queries that describe subsets of context.
 * Receives all props from {@link VisualizationConfigurator.QueryStore} and
 * {@link VisualizationConfigurator.CPSStore}.
 * @class
 * @static
 * @augments external:Component 
*/
class QueryBuilder extends React.Component {
  static getStores() {
    return [QueryStore, CPSStore];
  }

  static getPropsFromStores() {
    return {
      QueryStore: QueryStore.getState(),
      CPSStore: CPSStore.getState()
    }
  }

  render() {
    const {allCPS, activeCPS}  = this.props.CPSStore;
    const {cps, type, entity, attribute, attributeType, queries}  = this.props.QueryStore;

    return (
      <div>
          <Title name="Query Builder" help={visBuilder.query} />
          <div className="content">
              <QueryGroups {...this.props.CPSStore}
                           {...this.props.QueryStore}/>
              <QueryOverview queries={queries}/>
              <QueryButtons {...this.props.QueryStore}/>
          </div>
      </div>
    );
  }
}

class QueryGroups extends React.Component {
  static propTypes = {
    cps: PropTypes.object,
    type: PropTypes.object,
    entity: PropTypes.object,
    attributeType: PropTypes.string,
    attribute: PropTypes.string,
    activeCPS: PropTypes.object,
    allCPS: PropTypes.object
  }

  handleCPSClick(cps) {
    QueryActions.cps(cps);
    CPSActions.loadCPSData(cps.id);
  }

  handleTypeClick = type => {
    QueryActions.typeChange(type);
  }

  handleEntityClick = entity => {
    QueryActions.entity(entity);
  }

  handleAttributeTypeClick(attributeType) {
    QueryActions.attributeType(attributeType);
  }

  handleAttributeClick(attribute) {
    QueryActions.attribute(attribute[0]);
  }

  render() {
    const {cps, type, entity, attributeType,
           activeCPS, allCPS, attribute} = this.props;

    let types = new Map();
    let entitys = new Map();
    let subscriptions = new Map();
    let attTypes = []
    let attributes = [];

    if (cps) {
      types = activeCPS.types;
    }

    if (type) {
      entitys = types.get(type.id).entitys;
    }

    if (entity) {
      subscriptions = entitys.get(entity.id).subscriptions;
      attTypes = attributeTypes;
    }

    if (attributeType) {
      const equalsAttributeType = subscription => subscription.statics.type === attributeType;
      const filterAttributes = _.filter(equalsAttributeType);
      const extractAttributes = _.pluck('sensed');
      attributes = extractAttributes(filterAttributes([...subscriptions.values()]));
    }

    return (
      <div className="content__querygroups">
          <QueryGroup label="CPS" items={allCPS} selected={cps}
           onClick={this.handleCPSClick}/>
          {cps? <QueryGroup label="Entity Type" selected={type}
           items={[...types.values()]} onClick={this.handleTypeClick}/> : ''}
          {type? <QueryGroup label="Entity"  selected={entity}
           items={[...entitys.values()]} onClick={this.handleEntityClick}/> : ''}
          {entity? <QueryGroup label="Attribute Type" selected={attributeType}
           items={attTypes} onClick={this.handleAttributeTypeClick}/> : ''}
          {attributeType? <QueryGroup label="Attributes" items={attributes} selected={attribute}
           onClick={this.handleAttributeClick}/> : ''}
      </div>
    );
  }

  componentDidMount() {
    CPSActions.loadCPS();
  }
}

class QueryGroup extends React.Component {
  static defaultProps = {
    label: React.PropTypes.string,
    onClick: React.PropTypes.func,
    items: React.PropTypes.arrayOf(React.PropTypes.object)
  }

  render() {
    const {text, label, onClick, items, selected} = this.props;
    const getButtons = _.map(item => item.name ?
                                   {value: {id: item._id, name: item.name}, text: item.name} :
                                   {value: item, text: item});
    let selectedButton = '';
    if (selected) {
      selectedButton = selected.name? selected.name : selected;
    }

    return (
      <div className="items well--nomargin well">
          <RadioButtons buttons={getButtons(items)}
                        onClick={onClick}
                        label={label}
                        selected={selectedButton}
                        primary/>
      </div>
    );
  }
}

class QueryOverview extends React.Component {
  static propTypes = {
    queries: React.PropTypes.arrayOf(React.PropTypes.object),
  }
  render() {
    const {queries} = this.props;


    return (
      <div className="well content__queryoverview">
          <h4>Selected Data</h4>
          {[...queries.values()].map(query =>
            <OverlayTrigger trigger='click' key={query.label}
            placement='left'
            overlay={
              <Popover title={query.label}>
              <ul className="list-group">
              <li className="list-group-item">{query.cps}</li>
              <li className="list-group-item">{query.type}</li>
              <li className="list-group-item">{query.entity}</li>
              <li className="list-group-item">{query.attribute}</li>
              </ul>
              </Popover>
            }>
            <Button text={query.label}/>
            </OverlayTrigger>
           )}
      </div>
    );
  }

  componentDidMount() {
    QueryActions.clear();
  }
}

class QueryButtons extends React.Component {
  static propTypes = {
    cps: PropTypes.object,
    type: PropTypes.object,
    entity: PropTypes.object,
    attribute: PropTypes.object,
    queries: PropTypes.object,
    queryType: PropTypes.string
  }

  handleAddQuery(form) {
    const {label} = form;
    QueryActions.add(label);
  }

  render() {
    const {cps, type, entity, attribute, queries, queryType} = this.props;
    const isQuerySelected = cps && type && entity && attribute;
    const timeBuilderLink = `visBuilder/time/${qs.stringify({queries: [...queries.values()], queryType})}`;

    return (
      <div className="content__button">
          <div className="content__querygroups">
              <Modal text="Create Query" primary wide disabled={!isQuerySelected}
                     id={modals.createQuery}>
                  <Formsy.Form onValidSubmit={this.handleAddQuery} onValid={this.enableButton}
                               onInvalid={this.disableButton}>
                      <FormInput name="label" type="text" text="Label" required/>
                      <Button text="Create Visualization Label" type="submit" />
                  </Formsy.Form>
              </Modal>
          </div>
          <div className="content__queryoverview">
              <LinkButton link={timeBuilderLink} text="Choose Time" primary wide
                          disabled={queries.size <= 0} />
          </div>
      </div>
    );
  }
}

export default connectToStores(QueryBuilder);
