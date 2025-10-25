import { handle } from 'hono/aws-lambda';
import app from './app';

export const appEntry = handle(app);
