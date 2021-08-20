import {Document, model, Schema} from "mongoose";

type IUserBase = {
    username: string,
    discordID: string,
    guildName: string,
    guildID: string,
    skills: string[],
    admin: boolean
}

export type IUser = IUserBase & Document

const userSchema = new Schema({
    username: String,
    discordID: String,
    guildName: String,
    guildID: String,
    skills: [String],
    admin: Boolean
})

const User = model<IUser>("User", userSchema)

export default User