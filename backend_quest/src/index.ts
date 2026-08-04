import { Hono } from "hono";
import authRoutes from "./routes/auth.route.js";
import itemRoutes from "./routes/lostItem.route.js";
import userRoutes from "./routes/user.route.js";
import { Scalar } from '@scalar/hono-api-reference';
// import yaml from 'yaml';
// import { join } from "node:path";
// import { readFileSync } from "node:fs";

// const filePath = join(process.cwd(), 'doc/openapi.yaml');
// const fileContent = readFileSync(filePath, 'utf8');
// const parsedYaml = yaml.parse(fileContent);

const app = new Hono();

app.get("/", (c) => c.text("Hello, World!"));

// app.get('/doc', (c) => {
//   return c.json(parsedYaml)
// })

// app.get('/docs', Scalar({ url: '/doc' }))

app.route("/api/auth", authRoutes);
app.route("/api/items", itemRoutes);
app.route("/api/user", userRoutes);

export default app;
