import { db } from "../database.js"

export const getAllMessages = async () => {
    const messages = await db("messages").select("*")

    return messages
}


export const getAllMessagesByChatroom = async (chatroomId) => {
    const messages = await db("messages").select("*").where("chatroomId", chatroomId);
  
    return messages
  }

