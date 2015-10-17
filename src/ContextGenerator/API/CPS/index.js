'use strict';
import express from 'express';
import * as cpsController from './CPSController';
import * as entityTypeController from './EntityType/EntityTypeController';
import * as entityController from './EntityType/Entity/EntityController';
import * as subscriptionController from './EntityType/Entity/Subscription/SubscriptionController';

let router = express.Router();

router.get('/', cpsController.loadAll);
router.get('/:cps', cpsController.load);
router.post('/', cpsController.create);
router.put('/:cps', cpsController.update);
router.delete('/:cps', cpsController.remove);
router.get('/:cps/browse', cpsController.browse);

router.get('/:cps/types/:type', entityTypeController.load);
router.get('/:cps/types', entityTypeController.loadAll);
router.post('/:cps/types', entityTypeController.create);
router.put('/:cps/types/:type', entityTypeController.update);
router.delete('/:cps/types/:type', entityTypeController.remove);

router.get('/:cps/types/:type/entitys/:entity', entityController.load);
router.get('/:cps/types/:type/entitys', entityController.loadAll);
router.post('/:cps/types/:type/entitys', entityController.create);
router.put('/:cps/types/:type/entitys/:entity', entityController.update);
router.delete('/:cps/types/:type/entitys/:entity', entityController.remove);

router.get('/:cps/types/:type/entitys/:entity/subscriptions/:subscription', subscriptionController.load);
router.get('/:cps/types/:type/entitys/:entity/subscriptions', subscriptionController.loadAll);
router.post('/:cps/types/:type/entitys/:entity/subscriptions', subscriptionController.create);
router.put('/:cps/types/:type/entitys/:entity/subscriptions/:subscription', subscriptionController.update);
router.delete('/:cps/types/:type/entitys/:entity/subscriptions/:subscription', subscriptionController.remove);

export default router;
