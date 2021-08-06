"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const discord_js_1 = require("discord.js");
const api_1 = require("./api");
const app = express();
const client = new discord_js_1.Client();
// WEB
app.use(require('body-parser').json());
app.use(express.static("public"));
app.use("/api", api_1.default);
app.listen(8000, () => {
    console.log("Server is running at http://localhost:8000/");
});
// DISCORD
client.on('ready', () => {
    console.log("Discord bot ready!");
});
client.login("ODczMTM2OTU0MjkwNjEwMjA4.YQ0CKA.vBgyta2wrBQXl83U7pZL_nigsjo");
//# sourceMappingURL=index.js.map