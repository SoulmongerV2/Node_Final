import express from "express"
import cookieParser from "cookie-parser"
import { db } from "./database.js"
import { router as messagesRouter } from "./routes/messages.js"
import { router as usersRouter } from "./routes/users.js" 
import { router as chatroomsRouter } from "./routes/chatrooms.js" 
import loadUser from "./middlewares/loadUser.js"
import requireAuth from "./middlewares/requireAuth.js"
import { getAllMessagesByChatroom } from "./database/messages.js"

export const app = express()
//export const LOBBY_CHATROOM_ID = 7


app.set("view engine", "ejs")

app.use(express.static("public"))
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())

app.use(loadUser)



app.get("/", async (req, res) => {
    const chatrooms = await db("chatrooms").select("*")


    
    res.render("index", {
        chatrooms: chatrooms,
    })
})



app.use(chatroomsRouter)
app.use(messagesRouter)
app.use(usersRouter)
