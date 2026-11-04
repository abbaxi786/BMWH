const { createServer } = require("http");
const next = require("next");

const port = process.env.PORT || 3000;

const app = next({
    dev: false,
    hostname: "0.0.0.0",
});

const handle = app.getRequestHandler();

app.prepare().then(() => {
    createServer((req, res) => {
        handle(req, res);
    }).listen(port, "0.0.0.0", () => {
        console.log(`Next.js running on port ${port}`);
    });
});