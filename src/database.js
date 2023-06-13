import knex from "knex"
import knexfile from "../knexfile.js"
import crypto from "crypto"

export const db = knex(knexfile[process.env.NODE_ENV || 'development'])

//default export x jmenný export 
//export default db


export const getAllMessages = async () => {
    const messages = await db("messages").select("*")

    return messages
}

export const createUser = async (username, password) => {
    const salt = crypto.randomBytes(16).toString("hex")
    const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, "sha512").toString("hex")
    const token = crypto.randomBytes(16).toString("hex")

    const [user] = await db("users").insert({ username, salt, hash, token }).returning('*')

    return user
}


export const getUser = async (username, password) => {
    const user = await db("users").where({ username }).first()
    if (!user) return null

    const salt = user.salt
    const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, "sha512").toString("hex")
    if (hash !== user.hash) return null

    return user
}

