import express from "express" 
import { db } from "../database.js" 
import { sendMessagesToAllConnections } from "../websockets.js" 
import { joinUserToChatroom, getAllMessagesByChatroom } from "../database/chatrooms.js" 
//import { requireAuth } from "../middlewares/requireAuth.js" 

export const router = express.Router() 

router.post("/new-chatroom", async (req, res) => {
  const newChatroom = {
    name: req.body.name
  }

  await db("chatrooms").insert(newChatroom)

  sendMessagesToAllConnections()

  res.redirect("/")
}) 



router.get("/delete-chatroom/:id", async (req, res) => {
    const idToRemove = Number(req.params.id)

    await db("chatrooms").delete().where("id", idToRemove)

    sendMessagesToAllConnections()

    res.redirect("/")
}) 


router.get("/chatroom/:id", async (req, res) => {
    const chatroomId = Number(req.params.id)
  
    const messages = await getAllMessagesByChatroom(chatroomId)

    res.render("chatroom", { messages }); 

  })


router.post("/join-chatroom", async (req, res) => {
    const chatroomId = Number(req.body.chatroomId)
    const userId = res.locals.user.id
    await joinUserToChatroom(userId, chatroomId)

    // Redirect the user to the chatroom page
    res.redirect(`/chatroom/${chatroomId}`)
    
  })

