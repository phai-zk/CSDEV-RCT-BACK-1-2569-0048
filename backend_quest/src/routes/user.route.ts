import { Hono } from 'hono';
import { authMiddleware } from '../midlewares/auth.midleware.js';
import Controller from '../controllers/user.controller.js';

const routes = new Hono();

routes.get('/@me/items', authMiddleware, Controller.getPostLists);

export default routes;