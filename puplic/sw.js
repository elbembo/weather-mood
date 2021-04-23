const staticWeather = "dev-weathe-site-v1"
const assets = [
  "/",
  "/index.html",
  "/style.css",
  "/sound/thunder_effect.mp3",
  "/app.js",
  "/images/Atmosphere.jpg",
  "/images/Clear.jpg",
  "/images/Clouds.jpg",
  "/images/Drizzle.jpg",
  "/images/Rain.jpg",
  "/images/Snow.jpg",
  "/images/Thunderstorm.jpg",
  "/images/Thunderstorm2.jpg",
]

self.addEventListener("install", installEvent => {
  installEvent.waitUntil(
    caches.open(staticWeather).then(cache => {
      cache.addAll(assets)
    })
  )
})
self.addEventListener("fetch", fetchEvent => {
    fetchEvent.respondWith(
      caches.match(fetchEvent.request).then(res => {
        return res || fetch(fetchEvent.request)
      })
    )
  })