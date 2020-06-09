import app from "./app"
import { cache, load } from "./util/cache"
import logger from "./util/logger"
import { CACHE_REFRESH_INTERVAL } from "./util/secrets"

/**
 * Start Express server.
 */
const server = app.listen(app.get("port"), () => {
  console.log("  App is running at http://localhost:%d in %s mode", app.get("port"), app.get("env"))
  console.log("  Press CTRL-C to stop\n")
})

load({ refreshInterval: CACHE_REFRESH_INTERVAL }).then(() =>
  logger.debug(`Initialized cache with ${cache.size} entries at ${new Date().toISOString()}`)
)

export default server
