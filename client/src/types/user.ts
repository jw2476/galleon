export type IUserBase = {
    username: string,
    discordID: string,
    guildName: string,
    guildID: string,
    skills: Record<string, number>,
    admin: boolean,
    completed: number
}