import { expect } from "chai"
import nock from "nock"

import {
  AgileEngineClient,
  baseUrl,
  authUrl,
  imagesUrl,
  imageDetailsUrl
} from "../../src/service/image-client"

import {
  authResponse,
  images as imagesMockResponse,
  imageDetails as imageDetailsMockResponse
} from "../mock/image-client.response"

const agileEngine = new AgileEngineClient()

describe("AgileEngine Service", () => {
  beforeEach(() => {
    const authResource = authUrl.replace(baseUrl, "")
    const imagesResource = imagesUrl.replace(baseUrl, "")
    const imageId = "e9e5c1d285a133340fe2"
    const imageDetailsResource = imageDetailsUrl(imageId).replace(baseUrl, "")

    // mock API auth response
    nock(baseUrl).post(authResource).reply(200, authResponse)

    const nockAuthScope = nock(baseUrl, {
      reqheaders: {
        authorization: (authHeaderValue) => authHeaderValue.includes(authResponse.token)
      }
    })

    // mock API images response
    nockAuthScope.get(imagesResource).reply(200, imagesMockResponse)

    nockAuthScope.get(imageDetailsResource).reply(200, imageDetailsMockResponse)
  })

  it("Get images", async () => {
    const images = await agileEngine.getImages()

    //expect an object back
    expect(typeof images).to.equal("object")

    //Test result of name, company and location for the response
    expect(images.pictures).to.be.instanceOf(Array)
    expect(images.pictures[0].id).to.equal("e9e5c1d285a133340fe2")
  })

  it("Get image details", async () => {
    const imageId = "e9e5c1d285a133340fe2"
    const imageDetails = await agileEngine.getImageDetails("e9e5c1d285a133340fe2")

    //expect an object back
    expect(typeof imageDetails).to.equal("object")

    //Test result of name, company and location for the response
    expect(imageDetails.id).to.equal(imageId)
    expect(imageDetails.author).to.equal("Back Boss")
    expect(imageDetails.camera).to.equal("Sony Cyber-shot RX10 III")
  })
})
