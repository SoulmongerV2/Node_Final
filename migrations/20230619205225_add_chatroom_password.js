/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
export const up = async function(knex) {
    await knex.schema.alterTable("chatrooms", (table) => {
        table.string("salt").notNullable()
        table.string("hash").notNullable()
        table.integer("authorId").unsigned().references("id").inTable("users")
    })
  }
  
  /**
   * @param {import("knex").Knex} knex
   * @returns {Promise<void>}
   */
  export const down = async function(knex) {
    await knex.schema.alterTable("chatrooms", (table) => {
      table.dropColumn("salt")
      table.dropColumn("hash")
      table.dropColumn("authorId")
    })
  }