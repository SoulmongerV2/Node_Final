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




/*
async function initializeLobbyChatroom() {
    const lobbyChatroom = {
      name: "Lobby Chatroom",
    };
  
    
    const existingLobbyChatroom = await db("chatrooms")
      .where("name", lobbyChatroom.name)
      .first();
  
    // Create the default chatroom if it doesn't exist
    if (!existingLobbyChatroom) {
      await db("chatrooms").insert(lobbyChatroom);
      console.log("Default chatroom created.");
    } else {
      console.log("Default chatroom already exists.");
    }
  }
  
  // Call the initialization function when the application starts
  initializeLobbyChatroom().catch((error) => {
    console.error("Error initializing default chatroom:", error);
  });
  
*/

app.get("/", async (req, res) => {
    const chatrooms = await db("chatrooms").select("*")

    //const lobbyChatroom = await db("chatrooms").where("id", LOBBY_CHATROOM_ID).first()
    //const lobbyChatroomMessages = await getAllMessagesByChatroom(LOBBY_CHATROOM_ID)
    
    res.render("index", {
        chatrooms: chatrooms,
        //lobbyChatroom: lobbyChatroom,
        //lobbyChatroomMessages: lobbyChatroomMessages
    })
})



app.use(chatroomsRouter)
app.use(messagesRouter)
app.use(usersRouter)
