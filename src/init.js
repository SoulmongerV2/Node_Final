async function initializeLobbyChatroom() {
    const lobbyChatroom = {
      name: "Lobby Chatroom",
    };
  
    
    const existingLobbyChatroom = await db("chatrooms")
      .where("name", lobbyChatroom.name)
      .first();
  
    // Create the default chatroom if it doesn't exist
    if (!existingLobbyChatroom) {
      await db("chatrooms").insert(defaultChatroom);
      console.log("Default chatroom created.");
    } else {
      console.log("Default chatroom already exists.");
    }
  }
  
  // Call the initialization function when the application starts
  initializeDefaultChatroom().catch((error) => {
    console.error("Error initializing default chatroom:", error);
  });