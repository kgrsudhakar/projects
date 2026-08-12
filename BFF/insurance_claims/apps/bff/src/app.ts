import express from "express";

import cors from "cors";

import helmet from "helmet";

import morgan from "morgan";

import routes from "./routes/index.js";

import {requestId} from "./middlewares/requestId.middleware.js";

import {errorHandler} from "./middlewares/error.middleware.js";

import {notFound} from "./middlewares/notFound.middleware.js";
import policyRoutes from "./modules/policy/routes/policy.routes.js";

import claimRoutes from "./routes/claim.routes.js";

const app=express();

app.use(cors());

app.use(helmet());

app.use(morgan("dev"));

app.use(express.json());

app.use(requestId);


app.use("/api/v1", routes);

app.use("/api/v1/policies", policyRoutes);

app.use("/api/v1/claims", claimRoutes);

app.use(notFound);

app.use(errorHandler);

export default app;