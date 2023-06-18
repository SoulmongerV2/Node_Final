/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async function(knex) {
    await knex.schema.createTable("user_chatroom", (table) => {
      table.increments("id");
      table
        .integer("userId")
        .unsigned()
        .references("id")
        .inTable("users")
        .onDelete("CASCADE")
        .onUpdate("CASCADE");
      table
        .integer("chatroomId")
        .unsigned()
        .references("id")
        .inTable("chatrooms")
        .onDelete("CASCADE")
        .onUpdate("CASCADE");
      // Add any additional columns you need
    });
  };
  
  /**
   * @param { import("knex").Knex } knex
   * @returns { Promise<void> }
   */
  export const down = async function(knex) {
    await knex.schema.dropTable("user_chatroom");
  };
  