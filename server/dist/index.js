"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const api_1 = require("./api");
const dotenv_1 = require("dotenv");
const bot_1 = require("./bot");
dotenv_1.config();
const app = express();
// WEB
app.use(require('body-parser').json());
app.use(express.static("public"));
app.use("/api", api_1.default);
app.listen(8000, () => {
    console.log("Server is running at http://localhost:8000/");
});
// DISCORD
bot_1.default.on('ready', () => {
    console.log("Discord bot ready!");
});
bot_1.default.login(process.env.BOT_TOKEN);
//# sourceMappingURL=index.js.map