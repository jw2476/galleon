import {Document, model, Schema} from "mongoose";

type IUserBase = {
    username: String,
    discordID: String,
    guildName: String,
    guildID: String
}

export type IUser = IUserBase & Document

const userSchema = new Schema({
    username: String,
    discordID: String,
    guildName: String,
    guildID: String
})

const User = model<IUser>("User", userSchema)

export default User