import { WebSocketServer } from "ws"
import ejs from "ejs"
import { db } from "./database.js"
import { getMessagesWithUsers } from "./database/messages.js"



/** @type {Set<Websocket>} */ 
const connections = new Set()



export const createWebSocketServer = (server) => {
    const wss = new WebSocketServer({ server })

    wss.on("connection", (ws) => {
        

        connections.add(ws)
        console.log("New connection", connections.size)
        
        

        ws.on("close", () => {
            connections.delete(ws)
            console.log("Closed connection", connections.size)
        })
    })
}


export const sendMessagesToAllConnections = async () => {
  const messages = await db("messages").select("*")
  const messagesWithUsers = await getMessagesWithUsers(messages)

  const html = await ejs.renderFile("views/_messages.ejs", {
      messagesWithUsers,
  })

  const message = {
      type: "messages",
      html: html
  }

  for (const connection of connections) {
      const json = JSON.stringify(message)
      connection.send(json)
  }
}



export const sendUserInfoToAllConnections = (message) => {
    const systemMessage = {
      type: "systemMessage",
      message: message,
    }
  
    for (const connection of connections) {
      const json = JSON.stringify(systemMessage);
      connection.send(json)
    }
  }
