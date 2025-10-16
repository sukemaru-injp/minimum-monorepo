import { OpenAPIHono } from '@hono/zod-openapi';
import { getSampleHandler, getSampleRoute } from './GetSample';
import { postSampleHandler, postSampleRoute } from './PostSample';

const wellnessApi = new OpenAPIHono();

wellnessApi.openapi(postSampleRoute, postSampleHandler);
wellnessApi.openapi(getSampleRoute, getSampleHandler);

export default wellnessApi;
