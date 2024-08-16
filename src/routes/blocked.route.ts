// routes/blockedWebsites.ts

import express from 'express';
import { BlockedWebsiteController } from '../controllers/BlockedWebsiteController';

const blockRouter = express.Router();
const controller = new BlockedWebsiteController();

blockRouter.post('/block', controller.createBlockedWebsite);
blockRouter.get('/block', controller.getBlockedWebsites);
blockRouter.put('/block/:id', controller.updateBlockedWebsite);
blockRouter.delete('/block/:id', controller.deleteBlockedWebsite);

export default blockRouter;