import * as express from 'express'
import {Client} from 'discord.js'
import api from './api'
import { config } from "dotenv"

config()

const app = express()
const client = new Client()

// WEB

app.use(require('body-parser').json())
app.use(express.static("public"))
app.use("/api", api)

app.listen(8000, () => {
    console.log("Server is running at http://localhost:8000/")
})

// DISCORD

client.on('ready', () => {
    console.log("Discord bot ready!")
})

client.login(process.env.BOT_TOKEN)
