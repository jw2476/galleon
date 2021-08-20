import {Request, Response} from "express"
import axios from "axios"
import {config} from "dotenv"
import * as jwt from "jsonwebtoken"
import {Guild} from "discord.js"
import bot from "../bot";
import User from "../models/user"

config()

export default async function (req: Request, res: Response) {
    let {code} = req.body
    const {CLIENT_ID, CLIENT_SECRET} = process.env
    let redirect_uri = "http://localhost:8000/" // TODO: CHANGE THIS

    let data = {
        "client_id": CLIENT_ID,
        "client_secret": CLIENT_SECRET,
        "grant_type": "authorization_code",
        code,
        redirect_uri
    }
    try {
        let tokenResponse = await axios.post("https://discord.com/api/oauth2/token", new URLSearchParams(data), {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        })

        const discord_token = tokenResponse.data.access_token
        const user = await axios.get("https://discord.com/api/users/@me", {
            headers: {
                "Authorization": `Bearer ${discord_token}`
            }
        })

        const matching_users = (await Promise.all(bot.guilds.cache.map((guild: Guild) => guild.members.fetch(user.data.id)))).flat()
        if (matching_users.length !== 0) {
            const member = matching_users[0]

            const user_token = jwt.sign(member.user.username, CLIENT_SECRET)
            res.json(user_token)
            if (!await User.findOne({discordID: member.user.id})) {
                await new User({
                    username: member.user.username,
                    discordID: member.user.id,
                    guildName: member.guild.name,
                    guildID: member.guild.id,
                    admin: member.hasPermission("ADMINISTRATOR")
                }).save()
            }
        } else {
            res.sendStatus(403)
        }
    } catch (error) {
        console.error(error)
        res.sendStatus(400)
    }

}