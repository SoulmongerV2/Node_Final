export default async (req, res, next) => {
    const userId = res.locals.user.id
    createWebSocketServer(server, userId)
    next()
  }

  /*DELETUS*/