import { Hono } from 'hono';
import { authMiddleware } from "../midlewares/auth.midleware.js";
import Controller from '../controllers/lostitem.controller.js';

const routes = new Hono();

routes.post('/', authMiddleware, Controller.createPost);
routes.get('/:id{[0-9]+}', authMiddleware, Controller.getPostById);
routes.patch('/:id', authMiddleware, Controller.editPosts);
routes.delete('/:id', authMiddleware, Controller.deletePost);
routes.get('/:id/image', authMiddleware, Controller.getPostImage);

routes.get('/*', authMiddleware, Controller.getPosts);

export default routes;