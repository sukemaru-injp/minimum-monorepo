import { postSampleHandler, postSampleRoute } from './PostSample';
import { getSampleRoute, getSampleHandler } from './GetSample';

import { OpenAPIHono } from '@hono/zod-openapi';

const wellnessApi = new OpenAPIHono();

wellnessApi.openapi(postSampleRoute, postSampleHandler);
wellnessApi.openapi(getSampleRoute, getSampleHandler);

export default wellnessApi;
