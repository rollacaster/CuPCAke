import React from 'react';
import {Panel} from 'react-bootstrap';
import {CreateForm} from '../UI/Forms/Form';
import {Title, Button} from '../UI';
import {modals} from '../Helpers/Constants';
import {cpsBuilder} from '../Helpers/Constants/Help';
import CPSStore from './CPSStore';
import CPSActions from './CPSActions';
import connectToStores from 'alt/utils/connectToStores';
import Entity from './EntityDetailsComponent.jsx'

/** 
 * Shows an overview about all entities of one CPS and allows their creation.
 * Receives all props from {@link module:CPSConfigurator.CPSStore}.
 * @class
 * @augments external:Component
 * @alias EntityOverview
 * @memberOf module:CPSConfigurator
*/
class EntityContainer extends React.Component {
  static getStores() {
    return [CPSStore];
  }

  static getPropsFromStores() {
    return {
      CPSStore: CPSStore.getState()
    }
  }

  render() {
    const {activeCPS} = this.props.CPSStore;
    const {cps} = this.props.params;

    return (
      <EntityOverview cpsId={activeCPS._id} cpsName={activeCPS.name} types={activeCPS.types}
                      connections={activeCPS.connections}/>
    );
  }

  componentDidMount() {
    const {cps} = this.props.params;
    CPSActions.loadCPSData(cps);
  }
}

class EntityOverview extends React.Component {
  static propTypes = {
    cpsId: React.PropTypes.string,
    cpsName: React.PropTypes.string,
    types: React.PropTypes.object
  }

  handleNewEntityTypes = (formData) => {
    const {cpsId} = this.props;
    CPSActions.createTypes(cpsId, formData.types);
  }

  render() {
    const {cpsName, types, ...cpsInfo} = this.props;
    const title = `CPS: ${cpsName}`;

    const entityTypes = [];
    for (let [typeId,type] of types.entries()) {
      entityTypes.push(
        <EntityType name={type.name} key={typeId}
                    typeId={typeId} {...cpsInfo}
                    entitys={type.entitys}/>
      );
    }

    return (
      <div className="content">
          <Title name={title} help={cpsBuilder.entities}/>
          <div className="items well">
              <h3 className="items__title">Entities</h3>
              {entityTypes}
              <CreateForm title="Type" multi="types" id={modals.createType}
                          onCreate={this.handleNewEntityTypes} wide/>
          </div>
      </div>
    );
  }
}

class EntityType extends React.Component {
  static propTypes = {
    name: React.PropTypes.string,
    cpsId: React.PropTypes.string,
    typeId: React.PropTypes.string,
    entitys: React.PropTypes.object
  }

  handleNewEntitys = (formData) => {
    const {cpsId, typeId, name} = this.props;
    CPSActions.createEntitys(cpsId, typeId, name, formData.entities);
  }

  render() {
    const {name,  entitys, ...idsAndConnctions} = this.props;
    const entityComponents = [];
    for (let [entityId, entity] of entitys.entries()) {
      entityComponents.push(
        <Entity name={entity.name} key={entityId} entityId={entityId}
                subscriptions={entity.subscriptions} {...idsAndConnctions} />
      );
    }

    return (
      <Panel>
          {name}
          <ul className="list-group entity">
              {entityComponents}
              <CreateForm title="Entity" multi="entities" id={modals.createEntity + name}
                          onCreate={this.handleNewEntitys} wide/>
          </ul>
      </Panel>
    );
  }
}

export default connectToStores(EntityContainer);
