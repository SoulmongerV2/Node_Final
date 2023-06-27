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
        //console.log(request.url)
        //sendUserInfoToAllConnections()

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