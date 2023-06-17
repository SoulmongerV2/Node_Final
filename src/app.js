import express from "express"
import cookieParser from "cookie-parser"
import { db } from "./database.js"
import {  getUserByToken } from "../src/database/users.js"
import { router as messagesRouter } from "./routes/messages.js"
import { router as usersRouter } from "./routes/users.js" 

export const app = express()

const auth = (req, res, next) => {
    if (res.locals.user) {
        next()
    } else {
        res.redirect("/register")
    }
}


app.set("view engine", "ejs")

app.use(express.static("public"))
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())

app.use(async (req, res, next) => {
    const token = req.cookies.token

    if(token) {
        res.locals.user = await getUserByToken(token)
    } else {
        res.locals.user = null
    }

    next()
})


app.get("/", async (req, res) => {

    const messages = await db("messages").select("*")

    res.render("index", {
        messages: messages
    })
})




app.use(messagesRouter)
app.use(usersRouter)