import { Hono } from 'hono';
import authRoutes from './routes/auth.route.js'; 
import itemRoutes from './routes/lostItem.route.js';
import userRoutes from './routes/user.route.js';

const app = new Hono();

app.get('/', (c) => c.text('Hello, World!'));
app.route('/api/auth', authRoutes);
app.route('/api/items', itemRoutes);
app.route('/api/user', userRoutes);

export default {
  port: 3000,
  fetch: app.fetch,
};