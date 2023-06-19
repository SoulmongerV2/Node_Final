import { db } from "../database.js";

export const joinUserToChatroom = async (userId, chatroomId) => {
await db("user_chatroom").insert({ 
    userId: userId, 
    chatroomId: chatroomId 
})
}




  //export const deleteChatroom
  //export const getChatroomById
  //export const updateChatroom