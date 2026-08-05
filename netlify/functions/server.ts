import serverless from "serverless-http";
import app from "../../api/index.ts";

export const handler = serverless(app);
