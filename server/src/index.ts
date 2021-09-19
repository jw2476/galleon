import * as express from 'express'
import api from './api'
import {config} from "dotenv"
import bot from "./bot";
import {connect} from "mongoose"
import * as jwt from "jsonwebtoken"
import User, {IUser} from "./models/user";
import * as cors from "cors"

const {
    MONGO_URL,
    BOT_TOKEN,
    CLIENT_SECRET,
    PORT
} = process.env

config()
connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(async () => {
    console.log("DB Connected!")
})

const app = express()

// WEB

app.use(require('body-parser').json())
app.use(cors())
app.use(express.static("public"))
app.use("/api", async (req, res, next) => {
    if (!req.headers.authorization) {
        next()
        return
    }
    try {
        let usernameOrID = jwt.verify(req.headers.authorization, CLIENT_SECRET) as string // Removes jwt payload
        if (isNaN(parseInt(usernameOrID))) {
            res.locals.user = await User.findOne({username: usernameOrID})
        } else {
            res.locals.user = await User.findOne({discordID: usernameOrID})
        }
        next()
    } catch {
        next()
    }
})
app.use("/api", api)
app.use("/api", express.static("data"))

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}/`)
})

// DISCORD

bot.on('ready', () => {
    console.log("Discord bot ready!")
})

bot.login(BOT_TOKEN)
