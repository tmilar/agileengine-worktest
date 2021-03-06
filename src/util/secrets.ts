import logger from "./logger"
import dotenv from "dotenv"
import fs from "fs"

if (!fs.existsSync(".env")) {
  const errMsg = "Please initialize the .env file"
  logger.error(errMsg)
  process.exit(1)
}

dotenv.config({ path: ".env" })
logger.debug("Loaded .env file")

// export const NODE_ENV = process.env.NODE_ENV
export const AGILEENGINE_API_KEY = process.env.AGILEENGINE_API_KEY

export const CACHE_REFRESH_INTERVAL = Number(process.env.CACHE_REFRESH_INTERVAL)

if (AGILEENGINE_API_KEY === undefined || AGILEENGINE_API_KEY === "") {
  logger.error("AGILEENGINE_API_KEY env var must be defined.")
  process.exit(1)
}
