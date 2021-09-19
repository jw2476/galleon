export type IUserBase = {
    username: string,
    discordID: string,
    guildName: string,
    guildID: string,
    skills: string[],
    admin: boolean,
    completed: number
}