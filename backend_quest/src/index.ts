import { Hono } from "hono";
import authRoutes from "./routes/auth.route.js";
import itemRoutes from "./routes/lostItem.route.js";
import userRoutes from "./routes/user.route.js";
import { Scalar } from '@scalar/hono-api-reference'
import fs from 'node:fs'
import path from 'node:path'
import yaml from 'yaml'

const app = new Hono();

app.get("/", (c) => c.text("Hello, World!"));

app.get('/doc', (c) => {
  try {
    const filePath = path.resolve('./doc/openapi.yaml')
    const fileContent = fs.readFileSync(filePath, 'utf8')
    const parsedYaml = yaml.parse(fileContent)
    
    return c.json(parsedYaml)
  } catch (error) {
    return c.text('Error reading OpenAPI spec', 500)
  }
})
app.get('/docs', Scalar({ url: '/doc' }))

app.route("/api/auth", authRoutes);
app.route("/api/items", itemRoutes);
app.route("/api/user", userRoutes);

export default {
  port: 3000,
  fetch: app.fetch,
};
