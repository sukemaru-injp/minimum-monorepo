import { serve } from "@hono/node-server";
import { logger } from "@minimum-monorepo/shared-lib";
import { Hono } from "hono";

const app = new Hono();

app.get("/", (c) => {
	logger.info("Root endpoint hit", {
		path: c.req.path,
		userAgent: c.req.header("user-agent") ?? "unknown",
	});
	return c.text("Hello Hono!hono hono");
});

app.get("/hc", (c) => {
	logger.warn("Health check requested", {
		path: c.req.path,
	});
	return c.text("Hello Hono! Health Check");
});

serve(
	{
		fetch: app.fetch,
		port: 3050,
	},
	(info) => {
		logger.info("Server started", { port: info.port });
	},
);
