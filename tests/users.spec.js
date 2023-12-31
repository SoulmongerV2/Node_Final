import test from "ava"
import supertest from "supertest"
import { db } from "../src/database.js"
import { createUser, getUserByPassword } from "../src/database/users.js"
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

    t.deepEqual(await getUserByPassword("username", "password"), user)
    t.notDeepEqual(await getUserByPassword("username", "bad"), user)
    t.notDeepEqual(await getUserByPassword("bad", "password"), user)
})

test.serial("GET /register shows registration form", async(t) => {
    const response = await supertest(app).get("/register")

    t.assert(response.text.includes("Registrace"))
})

test.serial("GET /login shows login form", async(t) => {
    const response = await supertest(app).get("/login")

    t.assert(response.text.includes("Login"))
})

test.serial("POST /register creates a new user", async (t) => {
    await supertest(app).post("/register").type("form").send({ 
        username: "mike", 
        password: "1234"
    })

    t.not(await getUserByPassword("mike", "1234"), null)
})

test.serial("username is visible after registration and redirect", async (t) => {
    const agent = supertest.agent(app)

    const response = await agent.post("/register").type("form").send({ 
        username: "mike", 
        password: "1234"
    })
    .redirects(1)

    t.assert(response.text.includes("mike"))
})

test.serial("username is visible after login and redirect", async (t) => {
    const agent = supertest.agent(app)

    await createUser("mike", "1234")
    
    const response = await agent.post("/login").type("form").send({ 
        username: "mike", 
        password: "1234"
    })
    .redirects(1)

    t.assert(response.text.includes("mike"))
})


test.serial("username is not visible after logout", async (t) => {
    const agent = supertest.agent(app)

    await createUser("mike", "1234")
    
    const response1 = await agent.post("/login").type("form").send({ 
        username: "mike", 
        password: "1234"
    })
    .redirects(1)

    t.assert(response1.text.includes("mike"))

    const response2 = await supertest(app).get("/logout").redirects(1)

    t.assert(!response2.text.includes("mike"))
})