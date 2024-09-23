import express from "express";
import cors from "cors";
import config from "./config.js";
import { db } from "./src/utils/dbConnection.js";
import { routes } from "./src/routers/router.js";

const port = config.port;
const app = express();

db();

app.use(cors());

app.use(express.json());

for (const route of routes) {
  app.use(route.path, route.router);
}

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
