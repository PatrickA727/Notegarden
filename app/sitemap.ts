import type { MetadataRoute } from "next"

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://notegardenmusic.com"
  const lastModified = new Date()
  return [
    {
      url: `${base}/`,
      lastModified,
      changeFrequency: "monthly",
      priority: 1.0,
    },
    {
      url: `${base}/practice/guitar-notes`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ]
}
