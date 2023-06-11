import express from "express"
import knex from "knex"
import knexfile from "../knexfile.js"

export const app = express()

app.set("view engine", "ejs")

const db = knex(knexfile)

app.use(express.urlencoded({extended: true}))

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

    res.redirect("/")
})

