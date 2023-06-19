import { db } from "../database.js";
import crypto from "crypto"

export const joinUserToChatroom = async (userId, chatroomId) => {
await db("user_chatroom").insert({ 
    userId: userId, 
    chatroomId: chatroomId 
})
}


export const createChatroom = async (name, password, authorId) => {
  const salt = crypto.randomBytes(16).toString("hex")
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, "sha512").toString("hex")

  const [chatroom] = await db("chatrooms").insert({ name, salt, hash, authorId}).returning('*')

  return chatroom
}
/*
export const getChatroomByPassword = async (name, password) => {
  const chatroom = await db("chatrooms").where({ name }).first()
  //if (!chatroom) return null

  const salt = chatroom.salt
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, "sha512").toString("hex")
  if (hash !== chatroom.hash) return null

  return chatroom
}
*/




  //export const deleteChatroom
  //export const getChatroomById
  //export const updateChatroom