import express from "express" 
import { db } from "../database.js" 
import { sendMessagesToAllConnections } from "../websockets.js" 
import { createChatroom, joinUserToChatroom } from "../database/chatrooms.js" 
import { getAllMessagesByChatroom, getMessagesWithUsers } from "../database/messages.js"
import { getUserById } from "../database/users.js"
//import { requireAuth } from "../middlewares/requireAuth.js" 
import crypto from "crypto"

export const router = express.Router() 

router.post("/new-chatroom", async (req, res) => {
  
  const name = req.body.name
  const password = req.body.password
  const author = res.locals.user.id

  const chatroom = await createChatroom(name, password, author)

  sendMessagesToAllConnections()

  res.redirect("/")
}) 



router.get("/delete-chatroom/:id", async (req, res) => {
    const idToRemove = Number(req.params.id)

    await db("chatrooms").delete().where("id", idToRemove)
    await db("messages").delete().where("chatroomId", idToRemove)

    sendMessagesToAllConnections()

    res.redirect("/")
}) 


router.get("/chatroom/:id", async (req, res) => {
    const chatroomId = Number(req.params.id)

    const messages = await getAllMessagesByChatroom(chatroomId)
    const messagesWithUsers = await getMessagesWithUsers(messages)
    const chatroom = await db("chatrooms").where("id", chatroomId).first();

    res.render("chatroom", {
        chatroom, 
        messagesWithUsers,
        getUserById
    })

  })


router.post("/join-chatroom/", async (req, res) => {
    const chatroomId = Number(req.body.chatroomId)
    const userId = res.locals.user.id
    await joinUserToChatroom(userId, chatroomId)

    // Redirect the user to the chatroom page
    res.redirect(`/chatroom/${chatroomId}`)
    
  })

  function verifyPassword(password, salt, storedHash) {
    const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, "sha512").toString("hex");
    return hash === storedHash;
  }
  
  router.get("/join-chatroom/:id", async (req, res) => {
    const chatroomId = req.params.id


    const chatroom = await db("chatrooms").where({ id: chatroomId }).first()

    if (!chatroom) {
      return res.redirect("/")
    }

    const chatrooms = await db("chatrooms").select()

    res.render("join-chatroom", { chatrooms, chatroomId })
  })
  
  router.post("/join-chatroom/:id", async (req, res) => {
    const chatroomId = req.params.id
    const password = req.body.password
  
    const chatroom = await db("chatrooms").where({ id: chatroomId}).first()

    if(!chatroom) {
      return res.redirect("/")
    }

    const { salt, hash } = chatroom
    const enteredHash = crypto.pbkdf2Sync(password, salt, 100000, 64, "sha512").toString("hex")
    //incorrect password
    if (hash !== enteredHash) {
      return res.redirect(`/join-chatroom/${chatroomId}`)
    }

    res.redirect(`/chatroom/${chatroomId}`)
  })

