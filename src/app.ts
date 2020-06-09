import express from "express"
import bodyParser from "body-parser"

import errorMiddleware from "./middleware/error.middleware"
import { getImageDetails, getImages } from "./api/images"

// Create Express server
const app = express()

// Configuration
app.set("port", process.env.PORT || 3000)

// Middlewares
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(errorMiddleware)

// API endpoints
app.get("/images", getImages)
app.get("/images/:id", getImageDetails)

export default app
