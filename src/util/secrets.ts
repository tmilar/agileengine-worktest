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

export const NODE_ENV = process.env.NODE_ENV
export const AGILEENGINE_API_KEY = process.env.AGILEENGINE_API_KEY

// const isProd = NODE_ENV === "production" // Anything else is treated as 'dev'
//
// export const SESSION_SECRET = process.env.SESSION_SECRET
// export const MONGODB_URI = isProd ? process.env.MONGODB_URI : process.env.MONGODB_URI_LOCAL
//
// if (!SESSION_SECRET) {
//   logger.error("No client secret. Set SESSION_SECRET environment variable.")
//   process.exit(1)
// }
//
// if (!MONGODB_URI) {
//   if (isProd) {
//     logger.error("No mongo connection string. Set MONGODB_URI environment variable.")
//   } else {
//     logger.error("No mongo connection string. Set MONGODB_URI_LOCAL environment variable.")
//   }
//   process.exit(1)
// }
