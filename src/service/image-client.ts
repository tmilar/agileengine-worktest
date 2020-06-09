import request, { RequestPromiseOptions } from "request-promise"
import { UrlOptions } from "request"

import { AGILEENGINE_API_KEY as apiKey } from "../util/secrets"
import logger from "../util/logger"

export const baseUrl = "http://interview.agileengine.com"
export const authUrl = `${baseUrl}/auth`
export const imagesUrl = `${baseUrl}/images`
export const imageDetailsUrl = (id: string) => `${baseUrl}/images/${id}`

export interface Image {
  id: string
  cropped_picture: string
}

export interface ImageDetails extends Image {
  camera: string
  author: string
  tags: string
  full_picture: string
}

export interface ImagesResponse {
  pictures: Array<Image>
  page: number
  pageCount: number
  hasMore: boolean
}

export class AgileEngineClient {
  private accessToken: string

  /**
   * Fetch images from AgileEngine API
   *
   * @param page
   */
  async getImages(page?: number): Promise<ImagesResponse> {
    const requestOptions = {
      url: imagesUrl
    }

    if (page !== undefined) {
      Object.assign(requestOptions, {
        qs: {
          page
        }
      })
    }

    return this._authorizedRequest(requestOptions)
  }

  async getImageDetails(id: string): Promise<ImageDetails> {
    const requestOptions = {
      url: imageDetailsUrl(id)
    }

    return this._authorizedRequest(requestOptions)
  }

  /**
   * Run a given request, initializing access token if it was not previously set.
   * If request failed due to 401 Unauthorized error, attempt to refresh the token,
   * and try to run the request again.
   *
   * @param requestOptions
   * @private
   */
  private async _authorizedRequest(requestOptions: UrlOptions & RequestPromiseOptions) {
    if (this.accessToken === undefined) {
      await this._authorize()
    }

    // combine authorization params with actual request options
    const authorizedRequestOptions = () => ({
      method: "GET",
      headers: {
        Authorization: `Bearer ${this.accessToken}`
      },
      json: true,
      ...requestOptions
    })

    const _authorizedRequest = () => {
      const _authorizedReqOpts = authorizedRequestOptions()
      return request(_authorizedReqOpts)
    }

    try {
      return _authorizedRequest()
    } catch (error) {
      const isAuthError = error.statusCode === 401
      if (!isAuthError) {
        throw error
      }
      // auth error => attempt to authorize and try again
      logger.info("Token expired, attempting to refresh...")
      try {
        await this._authorize()
      } catch (error) {
        const errMsg = `AgileEngine token authorization failed, aborting request. Reason: ${error.message}`
        logger.error(errMsg)
        throw new Error(errMsg)
      }
      logger.info("Token authorized. Retrying... ")
      return _authorizedRequest()
    }
  }

  /**
   * Request a new token to the AgileEngine server
   */
  private async _authorize() {
    let authResponse: { auth: boolean; token: string }
    try {
      authResponse = await request({
        method: "POST",
        url: authUrl,
        body: {
          apiKey
        },
        json: true // Automatically stringifies the body to JSON
      })
    } catch (error) {
      error.message = `AgileEngine auth failed. Reason: ${error.message}`
      logger.error(error)
      throw new Error(error)
    }

    const { auth, token } = authResponse

    if (auth === false) {
      const errMsg = "Got 'false' Auth response"
      logger.error(errMsg)
      throw new Error(errMsg)
    }

    this.accessToken = token
  }
}
