import express from "express"
import cookieParser from "cookie-parser"
import { db } from "./database.js"
import { createUser, getUserByPassword, getUserByToken } from "../src/database/users.js"
import { router as messagesRouter } from "./routes/messages.js"

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

app.get("/login", async (req, res) => {
    res.render("login")
})

app.post("/login", async (req, res) => {
    const username = req.body.username
    const password = req.body.password

    const user = await getUserByPassword(username, password)

    res.cookie("token", user.token)

    res.redirect("/")
})

app.get("/logout", async (req, res) => {

    res.cookie("token", "")

    res.redirect("/")
})

app.use(messagesRouter)