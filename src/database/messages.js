import { db } from "../database.js"

export const getAllMessages = async () => {
    const messages = await db("messages").select("*")

    return messages
}