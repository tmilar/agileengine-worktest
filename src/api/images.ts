import { NextFunction, Request, Response } from "express"
import { AgileEngineClient } from "../service/image-client"
import is from "@sindresorhus/is"
import HttpException from "../exception/http-exception"

const agileEngine = new AgileEngineClient()

export async function getImages(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const page = _parsePageQueryParam(req)
    const images = await agileEngine.getImages(page)
    res.json(images)
  } catch (error) {
    next(error)
  }
}

export async function getImageDetails(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = _parseIdPathParam(req)
    const imageDetails = await agileEngine.getImageDetails(id)
    res.json(imageDetails)
  } catch (error) {
    next(error)
  }
}

export async function searchImagesByString(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { searchTerm } = req.params
    const foundPictures = await agileEngine.searchPictures(searchTerm)
    res.json(foundPictures)
  } catch (error) {
    next(error)
  }
}

function _parsePageQueryParam(req: Request) {
  const { page: pageQueryParam } = req.query
  const page = Number(pageQueryParam)
  if (!is.number(page) || (is.number(page) && page < 0)) {
    throw new HttpException(400, "Bad param 'page'")
  }
  return page
}

function _parseIdPathParam(req: Request) {
  const { id } = req.params

  if (!is.string(id) || (is.string(id) && id.length > 40)) {
    throw new HttpException(400, "Bad param 'id'")
  }
  return id
}
