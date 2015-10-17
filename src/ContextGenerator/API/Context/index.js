import express from 'express';
import * as controller from './ContextController';

let router = express.Router();

router.post('/', controller.streamContext);
router.delete('/', controller.stopStreamContext);

export default router;
