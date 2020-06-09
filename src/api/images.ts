import { NextFunction, Request, Response } from "express"
import { AgileEngineClient } from "../service/image-client"

const agileEngine = new AgileEngineClient()

export async function getImages(req: Request, res: Response, next: NextFunction) {
  const { page } = req.body

  try {
    const images = await agileEngine.getImages(page)
    res.json(images)
  } catch (error) {
    next(error)
  }
}
