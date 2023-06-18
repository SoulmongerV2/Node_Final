import express from "express"
import { db } from "../database.js"
import { sendMessagesToAllConnections } from "../websockets.js"


export const router = express.Router()


router.post("/new-msg", async (req, res) => {
    
    const newMsg = {
        text: req.body.text,
        chatroomId: req.body.chatroomId
    }

    await db("messages").insert(newMsg)

    sendMessagesToAllConnections()

    res.redirect("/")
})

router.get("/remove-msg/:id", async (req, res) => {
    const idToRemove = Number(req.params.id)

    await db("messages").delete().where("id", idToRemove)

    sendMessagesToAllConnections()

    res.redirect("/")
})

router.get("/toggle-msg/:id", async (req, res, next) => {
    const idToToggle = Number(req.params.id)

    const msgToToggle = await db("messages").select("*").where("id", idToToggle).first()
    if (!msgToToggle) return next()

    await db("messages").update({liked: !msgToToggle.liked}).where("id", idToToggle)

    sendMessagesToAllConnections()

    res.redirect("/")
})

