import type { MetadataRoute } from 'next'

const BASE_URL = 'https://www.belarisumedicalcentre.org'

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    '',
    '/about',
    '/services',
    '/gallery',
    '/unstitched',
    '/contact',
    '/booking',
    '/donate',
  ]

  return routes.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
  }))
}
