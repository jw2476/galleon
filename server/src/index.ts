import * as express from 'express'
import {Client} from 'discord.js'
import api from './api'
import { config } from "dotenv"
import bot from "./bot";

config()

const app = express()

// WEB

app.use(require('body-parser').json())
app.use(express.static("public"))
app.use("/api", api)

app.listen(8000, () => {
    console.log("Server is running at http://localhost:8000/")
})

// DISCORD

bot.on('ready', () => {
    console.log("Discord bot ready!")
})

bot.login(process.env.BOT_TOKEN)
