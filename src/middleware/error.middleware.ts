import {NextFunction, Request, Response} from "express"
import HttpException from "../exception/http-exception"

export default function errorMiddleware(
  error: HttpException,
  _request: Request,
  response: Response,
  _next: NextFunction
) {
  const status = error.status || 500
  const message = error.message || "Something went wrong"
  response.status(status).send({
    status,
    message
  })
}
