/*jshint -W030 */
import {expect} from 'chai';
import alt from '../../alt';
import * as ajaxHelper from '../Helpers/AjaxHelper';
import CPSStore from './CPSStore';
import CPSActions from './CPSActions';

describe('CPSStore', () => {
  describe('onLoadCPS', () => {
    describe('onCreateCPS', () => {
      it('should create a cps', () => {
        let data = {
          _id: 'cpsId1',
          name: 'cpsName',
          connections: ['cpsConnections']
        };
        let action = CPSActions.CREATE_CPS;
        alt.dispatcher.dispatch({action, data});

        expect(CPSStore.getState().allCPS).to.be.deep.equal([data]);
      });
    });
  });

  describe('onCreateTypes', () => {
    it('should create entity types', () => {
      let data = [{_id: 'typeId1', name: 'type1'}];
      let action = CPSActions.CREATE_TYPES;
      alt.dispatcher.dispatch({action, data});

      const {types} = CPSStore.getState().activeCPS;
      expect(types.get('typeId1').name).to.be.equal('type1');
    });
  });

  describe('onCreateEntitys', () => {
    it('should create entitys', () => {
      let data = {
        typeId: 'typeId1',
        entitys: [
          {_id: 'entityId1', name: 'entity1'}
        ]
      };
      let action = CPSActions.CREATE_ENTITYS;
      alt.dispatcher.dispatch({action, data});

      const {types} = CPSStore.getState().activeCPS;
      const {entitys} = types.get('typeId1');
      expect(entitys.get('entityId1').name).to.be.equal('entity1');
    });
  });

  describe('onCreateSubscriptions', () => {
    it('should create subscription', () => {
      const data = {
        subscription: {
          _id: 'subscriptionId1',
          subscription: 'light',
          connection: 'coap://localhost'
        },
        entityId: 'entityId1',
        typeId: 'typeId1'
      };

      const action = CPSActions.CREATE_SUBSCRIPTION;
      alt.dispatcher.dispatch({action, data});

      const {types} = CPSStore.getState().activeCPS;
      const {entitys} = types.get('typeId1');
      const {subscriptions} = entitys.get('entityId1');
      expect(subscriptions.get('subscriptionId1').subscription).to.be.equal('light');
    });
  });

  describe('onLoadCPSData', () => {
    it('should load all types and entties of a cps', () => {
      const {types} = CPSStore.getState().activeCPS;
      const {entitys} = types.get('typeId1');
      const {subscriptions} = entitys.get('entityId1');

      expect(types.get('typeId1').name).to.be.equal('type1');
      expect(entitys.get('entityId1').name).to.be.equal('entity1');
      expect(subscriptions.get('subscriptionId1').subscription).to.be.equal('light');
    });
  });

  describe('onUpdateSubscription', () => {
    it('should update asubscription', () => {
      const data = {
        subscription: {
          subscription: 'temperature',
          connection: 'coap://localhost'
        },
        entityId: 'entityId1',
        typeId: 'typeId1',
        subscriptionId: 'subscriptionId1'
      };

      const action = CPSActions.UPDATE_SUBSCRIPTION;
      alt.dispatcher.dispatch({action, data});

      const {types} = CPSStore.getState().activeCPS;
      const {entitys} = types.get('typeId1');
      const {subscriptions} = entitys.get('entityId1');
      expect(subscriptions.get('subscriptionId1').subscription).to.be.equal('temperature');
    });
  });

  describe('onDeleteSubscription', () => {
    it('should delete a subscription', () => {
      const data = {
        entityId: 'entityId1',
        typeId: 'typeId1',
        subscriptionId: 'subscriptionId1'
      };

      const action = CPSActions.DELETE_SUBSCRIPTION;
      alt.dispatcher.dispatch({action, data});

      const {types} = CPSStore.getState().activeCPS;
      const {entitys} = types.get('typeId1');
      const {subscriptions} = entitys.get('entityId1');
      expect(subscriptions.get('subscriptionId1')).to.be.empty;
    });
  });
});
