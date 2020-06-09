import { AgileEngineClient, ImageDetails, ImagesResponse } from "../service/image-client"
import logger from "./logger"

export let cachedImages: ImageDetails[] = []

interface CacheConfig {
  refreshInterval?: number
}

let agileEngineClient: AgileEngineClient

/**
 * Fetch all pictures with details, and re-fresh the cache
 * @param cacheConfig
 */
export async function load(cacheConfig: CacheConfig = {}): Promise<void> {
  const { refreshInterval } = cacheConfig

  if (refreshInterval === undefined || refreshInterval === 0) {
    // don't setup cache if refresh interval is undefined or 0
    logger.info(`Skipping cache load (refreshInterval is ${refreshInterval})`)
    return
  }

  if (agileEngineClient === undefined) {
    // init API client only once
    agileEngineClient = new AgileEngineClient()
  }

  // fetch all pictures with details
  const allImages = await fetchAllPictures()

  // replace current cache instance with the fresher one
  cachedImages = allImages

  scheduleCacheRefresh(cacheConfig)
}

function scheduleCacheRefresh(cacheConfig: CacheConfig) {
  const { refreshInterval } = cacheConfig

  logger.info(`Refreshing cache in ${refreshInterval}ms...`)
  setTimeout(
    () =>
      load(cacheConfig).then(() =>
        logger.debug(
          `Refreshed cache with ${cachedImages.length} entries at ${new Date().toISOString()}`
        )
      ),
    refreshInterval
  )
}

async function fetchAllPictures() {
  const imagesFirstPage = await _getImagesWithDetails()
  const {
    images: { pageCount },
    picturesWithDetails: picturesWithDetailsFirstPage
  } = imagesFirstPage

  // get the rest of pages (all except the first one)
  const imagesRemainderPages = await Promise.all(
    [...Array(pageCount - 1)].map((_, i) => _getImagesWithDetails(i + 2))
  )

  // join all remainder pictures in a flat array
  const picturesWithDetailsRest = imagesRemainderPages.reduce(
    (pictures, { picturesWithDetails }) => pictures.concat(...picturesWithDetails),
    [] as ImageDetails[]
  )

  // join all pictures in a single array
  const allPicturesWithDetails = [...picturesWithDetailsFirstPage, ...picturesWithDetailsRest]

  return allPicturesWithDetails
}

async function _getImagesWithDetails(
  page?: number
): Promise<{ images: ImagesResponse; picturesWithDetails: ImageDetails[] }> {
  const images = await agileEngineClient.getImages(page)

  const picturesWithDetails = await Promise.all(
    images.pictures.map(({ id }) => agileEngineClient.getImageDetails(id))
  )

  return {
    images,
    picturesWithDetails
  }
}
