import * as express from 'express'
import api from './api'
import {config} from "dotenv"
import bot from "./bot";
import {connect} from "mongoose"
import * as jwt from "jsonwebtoken"
import User from "./models/user";

const {
    MONGO_URL,
    BOT_TOKEN,
    CLIENT_SECRET
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
app.use("/api", async (req, res, next) => {
    if (!req.headers.authorization) {
        next()
        return
    }
    try {
        let username = jwt.verify(req.headers.authorization, CLIENT_SECRET) as string // Removes jwt payload
        res.locals.user = await User.findOne({username})
        next()
    } catch {
        res.sendStatus(401)
    }
})
app.use("/api", api)
app.use("/api", express.static("data"))

app.listen(8000, () => {
    console.log("Server is running at http://localhost:8000/")
})

// DISCORD

bot.on('ready', () => {
    console.log("Discord bot ready!")
})

bot.login(BOT_TOKEN)
