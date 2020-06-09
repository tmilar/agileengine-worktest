import { NextFunction, Request, Response } from "express"
import { AgileEngineClient } from "../service/image-client"
import is from "@sindresorhus/is"
import HttpException from "../exception/http-exception"

const agileEngine = new AgileEngineClient()

export async function getImages(req: Request, res: Response, next: NextFunction): Promise<void> {
  const { page } = req.body

  if (!is.number(page) || (is.number(page) && page < 0)) {
    next(new HttpException(400, "Unexpected param 'page'"))
    return
  }

  try {
    const images = await agileEngine.getImages(page)
    res.json(images)
  } catch (error) {
    next(error)
  }
}
