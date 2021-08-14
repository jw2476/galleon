import * as express from 'express'
import {Client} from 'discord.js'
import api from './api'
import { config } from "dotenv"
import bot from "./bot";
import {connect} from "mongoose"

const {
    MONGO_URL,
    BOT_TOKEN
} = process.env

config()
connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("DB Connected!")
})

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

bot.login(BOT_TOKEN)
