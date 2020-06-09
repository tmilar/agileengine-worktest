import { expect } from "chai"
import nock from "nock"

import { AgileEngineClient, baseUrl, authUrl, imagesUrl } from "../../src/service/image-client"
import { images as imagesMockResponse, authResponse } from "../mock/image-client.response"

const agileEngine = new AgileEngineClient()

describe("AgileEngine Service", () => {
  beforeEach(() => {
    const authResource = authUrl.replace(baseUrl, "")
    const imagesResource = imagesUrl.replace(baseUrl, "")

    // mock API auth response
    nock(baseUrl).post(authResource).reply(200, authResponse)

    // mock API images response
    nock(baseUrl, {
      reqheaders: {
        authorization: (authHeaderValue) => authHeaderValue.includes(authResponse.token)
      }
    })
      .get(imagesResource)
      .reply(200, imagesMockResponse)
  })

  it("Get images", async () => {
    const images = await agileEngine.getImages()

    //expect an object back
    expect(typeof images).to.equal("object")

    //Test result of name, company and location for the response
    expect(images.pictures).to.be.instanceOf(Array)
    expect(images.pictures[0].id).to.equal("e9e5c1d285a133340fe2")
  })
})
