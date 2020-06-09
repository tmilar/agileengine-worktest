import { AgileEngineClient, ImageDetails, ImagesResponse } from "../service/image-client"
import logger from "./logger"

const agileEngineClient = new AgileEngineClient()

export let cache: Map<string, ImageDetails> = new Map()

interface CacheConfig {
  refreshInterval?: number
}

/**
 * Fetch all pictures with details, and re-fresh the cache
 * @param cacheConfig
 */
export async function load(cacheConfig: CacheConfig = {}) {
  // fetch all pictures with details
  const allImages = await fetchAllPictures()

  // replace current cache instance with the fresher one
  cache = initCache(allImages)

  const { refreshInterval } = cacheConfig

  if (refreshInterval === undefined) {
    return
  }
  logger.info(`Refreshing cache in ${refreshInterval}ms...`)
  setTimeout(
    () =>
      load(cacheConfig).then(() =>
        logger.debug(`Refreshed cache with ${cache.size} entries at ${new Date().toISOString()}`)
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

/**
 * Initialize a fresh cache
 * @param allImages
 */
function initCache(allImages: ImageDetails[]) {
  const freshCache = new Map()
  // store in a new cache map
  for (const image of allImages) {
    freshCache.set(image.id, image)
  }
  return freshCache
}
