import express from "express"
import { createUser, db, getUserByToken } from "./database.js"
import { sendMessagesToAllConnections } from "./websockets.js"
import cookieParser from "cookie-parser"


export const app = express()

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

app.post("/new-msg", async (req, res) => {
    const newMsg = {
        text: req.body.text
    }

    await db("messages").insert(newMsg)

    sendMessagesToAllConnections()

    res.redirect("/")
})

app.get("/remove-msg/:id", async (req, res) => {
    const idToRemove = Number(req.params.id)

    await db("messages").delete().where("id", idToRemove)

    sendMessagesToAllConnections()

    res.redirect("/")
})

app.get("/toggle-msg/:id", async (req, res, next) => {
    const idToToggle = Number(req.params.id)

    const msgToToggle = await db("messages").select("*").where("id", idToToggle).first()
    if (!msgToToggle) return next()

    await db("messages").update({liked: !msgToToggle.liked}).where("id", idToToggle)

    sendMessagesToAllConnections()

    res.redirect("/")
})

app.get("/register", async (req, res) => {
    res.render("register")
})


app.post("/register", async (req, res) => {
    const username = req.body.username
    const password = req.body.password

    const user = await createUser(username, password)

    res.cookie("token", user.token)

    res.redirect("/")
})