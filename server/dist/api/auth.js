"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
const dotenv_1 = require("dotenv");
const jwt = require("jsonwebtoken");
const bot_1 = require("../bot");
dotenv_1.config();
async function default_1(req, res) {
    let { code } = req.body;
    const { CLIENT_ID, CLIENT_SECRET } = process.env;
    let redirect_uri = "http://localhost:8000/"; // TODO: CHANGE THIS
    let data = {
        "client_id": CLIENT_ID,
        "client_secret": CLIENT_SECRET,
        "grant_type": "authorization_code",
        code,
        redirect_uri
    };
    try {
        let tokenResponse = await axios_1.default.post("https://discord.com/api/oauth2/token", new URLSearchParams(data), {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        });
        const discord_token = tokenResponse.data.access_token;
        const user = await axios_1.default.get("https://discord.com/api/users/@me", {
            headers: {
                "Authorization": `Bearer ${discord_token}`
            }
        });
        const matching_users = (await Promise.all(bot_1.default.guilds.cache.map((guild) => guild.members.fetch(user.data.id)))).flat();
        if (matching_users.length !== 0) {
            const user_token = jwt.sign(user.data.username, CLIENT_SECRET);
            res.json(user_token);
        }
        else {
            res.sendStatus(403);
        }
    }
    catch (error) {
        console.error(error);
        res.sendStatus(400);
    }
}
exports.default = default_1;
//# sourceMappingURL=auth.js.map