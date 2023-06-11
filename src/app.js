import express from "express"
import knex from "knex"
import knexfile from "../knexfile.js"

export const app = express()

app.set("view engine", "ejs")

const db = knex(knexfile[process.env.NODE_ENV || 'development'])

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

app.get("/remove-msg/:id", async (req, res) => {
    const idToRemove = Number(req.params.id)

    await db("messages").delete().where("id", idToRemove)

    res.redirect("/")
})

