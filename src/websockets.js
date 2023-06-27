import { WebSocketServer } from "ws"
import ejs from "ejs"
import { db } from "./database.js"
import { getMessagesWithUsers } from "./database/messages.js"



/** @type {Set<Websocket>} */ 
const connections = new Set()



export const createWebSocketServer = (server, userId) => {
    const wss = new WebSocketServer({ server })

    wss.on("connection", (ws) => {
        
        ws.userId = userId
        console.log(userId)

        connections.add(ws)
        console.log("New connection", connections.size)
        //console.log(request.url)
        sendUserInfoToAllConnections("A user has joined")
        

        ws.on("close", () => {
            connections.delete(ws)
            console.log("Closed connection", connections.size)
            sendUserInfoToAllConnections("A user has disconnected")
        })
    })
}


export const sendMessagesToAllConnections = async (userId) => {
    const messages = await db("messages").select("*")
    const messagesWithUsers = await getMessagesWithUsers(messages)

    const html = await ejs.renderFile("views/_messages.ejs", {
        messagesWithUsers,
        userId
    })

    const message = {
        type: "messages",
        html: html
    }

    for (const connection of connections) {
        const json = JSON.stringify(message)
        connection.send(json)
    }
    console.log(userId)
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
/*
export const sendUserInfoToAllConnections = () => {
  const userCount = connections.size;
  const connectedUsers = Array.from(connections).map((ws) => {
    const url = new URL(ws.upgradeReq.url, `http://${ws.upgradeReq.headers.host}`);
    const chatroomId = url.pathname.split("/")[2];
    return { chatroomId, userId };
  });

  const userInfo = {
    type: "userInformation",
    userCount,
    connectedUsers,
  };

  const json = JSON.stringify(userInfo);

  for (const connection of connections) {
    connection.send(json);
  }
}



  

*/