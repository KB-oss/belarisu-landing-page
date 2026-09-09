import type { MetadataRoute } from 'next'

const BASE_URL = 'https://www.belarisumedicalcentre.org'

export default function sitemap(): MetadataRoute.Sitemap {
  /* '/donate' is intentionally absent: app/donate/page.tsx renders an empty div
     (commit 484610b, "fix: remove donate"), so listing it advertises a blank
     page to search engines. Restore it here when the route is restored. */
  const routes = [
    '',
    '/about',
    '/services',
    '/gallery',
    '/unstitched',
    '/contact',
    '/booking',
    '/golf-day',
    '/privacy-policy',
    '/terms-of-service',
  ]

  return routes.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
  }))
}
