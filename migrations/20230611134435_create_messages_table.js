/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async function(knex) {
    await knex.schema.createTable("messages", (table) => {
        table.increments("id")
        table.string("text").notNullable()
        table.boolean("liked").notNullable().defaultTo(false)
      })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async function(knex) {
    await knex.schema.dropTable("messages")
};
