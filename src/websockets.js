import { WebSocketServer } from "ws"
import ejs from "ejs"
import { db } from "./database.js"

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

    const html = await ejs.renderFile("views/_messages.ejs", {
        messages,
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

