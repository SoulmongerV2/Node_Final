import test from "ava"
import supertest from "supertest"
import { db, createUser } from "../src/database.js"
import { app } from "../src/app.js"

test.beforeEach(async () => {
    await db.migrate.latest()
  })
  
test.afterEach(async () => {
await db.migrate.rollback()
})

test.serial('create new user', async (t) => {
    const user = await createUser('name', 'password')
  
    t.is(user.name, 'name')
    t.not(user.hash, 'password')
})
