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

export const AGILEENGINE_API_KEY = process.env.AGILEENGINE_API_KEY

export const CACHE_REFRESH_INTERVAL = Number(process.env.CACHE_REFRESH_INTERVAL)
