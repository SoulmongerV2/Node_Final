import test from "ava"
import supertest from "supertest"
import { db } from "../src/database.js"
import { app } from "../src/app.js"


test.beforeEach(async () => {
    await db.migrate.latest()
  })
  
test.afterEach.always(async () => {
await db.migrate.rollback()
})


test.serial('GET / shows list of messages', async (t) => {
await db("messages").insert({ text: "Message test!!" })

const response = await supertest(app).get('/')

t.assert(response.text.includes("Message test!!"))
})