import { db } from "../database.js"
import { getUserById } from "./users.js"

export const getAllMessages = async () => {
    const messages = await db("messages").select("*")
    return messages
}


export const getAllMessagesByChatroom = async (chatroomId) => {
    const messages = await db("messages").select("*").where("chatroomId", chatroomId)
    return messages
  }


  export const getMessagesWithUsers = async (messages) => {
    const messagesWithUsers = await Promise.all(
      messages.map(async (msg) => {
        const user = await getUserById(msg.userId)
        //spreading msg object - new username property from user.username if user is truthy.. Unknown User if not
        return { ...msg, username: user ? user.username : "Unknown User" }
      })
    )
    
  
    return messagesWithUsers
  }

