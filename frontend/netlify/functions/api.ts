import serverlessHttp from "serverless-http";
import app from "../../api/index";

// Wrap the Express app as a Netlify serverless function
export const handler = serverlessHttp(app);
