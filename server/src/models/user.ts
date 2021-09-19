import {Document, model, Schema} from "mongoose";

type IUserBase = {
    username: string,
    discordID: string,
    guildName: string,
    guildID: string,
    skills: Record<string, number>,
    admin: boolean,
    completed: number
}

export type IUser = IUserBase & Document

const userSchema = new Schema({
    username: String,
    discordID: String,
    guildName: String,
    guildID: String,
    skills: Object,
    admin: Boolean,
    completed: Number
})

const User = model<IUser>("User", userSchema)

export default User