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
    const user = await createUser("name", "password")
  
    t.is(user.name, "name")
    t.not(user.hash, "password")
})

test.serial("get user by name and password", async (t) => {
    const user = await createUser('name', '1234')

    t.deepEqual(await getUser('name', '1234'), user)
    t.notDeepEqual(await getUser('name', 'bad password'), user)
    t.notDeepEqual(await getUser('bad name', '1234'), user)
})
