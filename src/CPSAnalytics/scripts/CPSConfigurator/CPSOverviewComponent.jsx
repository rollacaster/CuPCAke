/** @module CPSConfigurator**/
import React from 'react';
import {Link} from 'react-router';
import {Panel} from 'react-bootstrap';
import {Title, Button} from '../UI';
import {modals} from '../Helpers/Constants';
import {cpsBuilder} from '../Helpers/Constants/Help';
import {CreateForm} from '../UI/Forms/Form';
import {FormInput} from '../UI/Forms/FormElements';
import CPSStore from './CPSStore';
import CPSActions from './CPSActions';
import connectToStores from 'alt/utils/connectToStores';

/**
 * Shows an overview about all saved CPSs and allows their creation.
 * Receives all its props from {@link module:CPSConfigurator.CPSStore}
 * @class
 * @augments external:Component
 * @memberOf module:CPSConfigurator
 */
class CPSOverview  extends React.Component {
  static getStores() {
    return [CPSStore];
  }

  static getPropsFromStores() {
    return {
      CPSStore: CPSStore.getState()
    }
  }

  render() {
    const {allCPS} = this.props.CPSStore;

    return (
      <div className="content">
          <Title name="Available CPS" help={cpsBuilder.cpsOverview} />
          <div className="items well">
              {allCPS.map(cps =>
                (<CPS name={cps.name} id={cps._id} key={cps._id} />)
               )}
              <CreateCPS/>
          </div>
      </div>
    )
  }

  componentDidMount() {
    CPSActions.loadCPS();
  }
}

/**
 * Shows one CPS.
 * @memberOf module:CPSConfigurator
*/
class CPS extends React.Component {
  static propTypes = {
    name: React.PropTypes.string
  }

  render() {
    const {name} = this.props;
    const cpsLink = `cpsBuilder/${this.props.id}`;

    const footer = (
      <Link to={cpsLink}>
      Details
      <span className="glyphicon glyphicon-menu-right"></span>
      </Link>);

    return (
      <Panel footer={footer}>
          {name}
      </Panel>
    );
  }
}


class CreateCPS extends React.Component {
  render() {
    return (
      <CreateForm title="CPS" multi="connections" validations="isHostname"
                  validationError="This is not a valid hostname."
                  onSubmit={CPSActions.createCPS}
                  id={modals.createCPS} wide>
          <FormInput name='name' text='CPS Name' required/>
      </CreateForm>
    );
  }
}

export default connectToStores(CPSOverview);
