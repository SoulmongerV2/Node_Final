/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
export const up = async function(knex) {
    await knex.schema.alterTable("messages", (table) => {
        table.timestamp("createdAt").defaultTo(knex.fn.now())
    })
  }
  
  /**
   * @param {import("knex").Knex} knex
   * @returns {Promise<void>}
   */
  export const down = async function(knex) {
    await knex.schema.alterTable("messages", (table) => {
      table.dropColumn("createdAt")
    })
  }