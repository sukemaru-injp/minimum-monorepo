import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { calledSharedLib } from "@minimum-monorepo/shared-lib";

const app = new Hono();

app.get("/", (c) => {
	return c.text("Hello Hono!");
});

app.get("/hc", (c) => {
	console.log(calledSharedLib());
	return c.text("Hello Hono! Health Check");
});

serve(
	{
		fetch: app.fetch,
		port: 3050,
	},
	(info) => {
		console.log(`Server is running on http://localhost:${info.port}`);
	},
);
