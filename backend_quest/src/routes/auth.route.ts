import { Hono } from 'hono';
import Controller from '../controllers/auth.controller.js';
    
const routes = new Hono();

routes.post('/register', Controller.register);
routes.post('/login', Controller.login);

export default routes;