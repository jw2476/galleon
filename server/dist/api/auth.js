"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
const dotenv_1 = require("dotenv");
const jwt = require("jsonwebtoken");
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
        if (!tokenResponse)
            return;
        const discord_token = tokenResponse.data.access_token;
        const user = await axios_1.default.get("https://discord.com/api/users/@me", {
            headers: {
                "Authorization": `Bearer ${discord_token}`
            }
        });
        if (!user)
            return;
        console.log(user.data);
        const user_token = jwt.sign(user.data.username, CLIENT_SECRET);
        res.json(user_token);
    }
    catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
}
exports.default = default_1;
//# sourceMappingURL=auth.js.map