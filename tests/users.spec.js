import test from "ava"
import supertest from "supertest"
import { db, createUser, getUser } from "../src/database.js"
import { app } from "../src/app.js"

test.beforeEach(async () => {
    await db.migrate.latest()
  })
  
test.afterEach(async () => {
await db.migrate.rollback()
})

test.serial("create new user", async (t) => {
    const user = await createUser("username", "password")
  
    t.is(user.username, "username")
    t.not(user.hash, "password")
})

test.serial("get user by username and password", async (t) => {
    const user = await createUser("username", "password")

    t.deepEqual(await getUser("username", "password"), user)
    t.notDeepEqual(await getUser("username", "bad"), user)
    t.notDeepEqual(await getUser("bad", "password"), user)
})

test.serial("GET /register shows registration form", async(t) => {
    const response = await supertest(app).get("/register")

    t.assert(response.text.includes("Registrace"))
})