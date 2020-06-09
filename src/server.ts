import app from "./app"
import { cachedImages, load } from "./util/cache"
import logger from "./util/logger"
import { CACHE_REFRESH_INTERVAL } from "./util/secrets"

/**
 * Start Express server.
 */
const server = app.listen(app.get("port"), () => {
  console.log("  App is running at http://localhost:%d in %s mode", app.get("port"), app.get("env"))
  console.log("  Press CTRL-C to stop\n")
})

load({ refreshInterval: CACHE_REFRESH_INTERVAL })
  .then(() =>
    logger.debug(
      `Initialized cache with ${cachedImages.length} entries at ${new Date().toISOString()}`
    )
  )
  .catch((error) => {
    const errMsg = `Unexpected error from cache: ${error.message || error}`
    logger.error(errMsg)
    process.exit(1)
  })

export default server
