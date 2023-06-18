/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
export const up = async function(knex) {
    await knex.schema.alterTable("messages", (table) => {
      table.integer("chatroomId").unsigned().references("id").inTable("chatrooms")
      table.integer("userId").unsigned().references("id").inTable("users")
    })
  }
  
  /**
   * @param {import("knex").Knex} knex
   * @returns {Promise<void>}
   */
  export const down = async function(knex) {
    await knex.schema.alterTable("messages", (table) => {
      table.dropColumn("chatroomId")
      table.dropColumn("userId")
    })
  }