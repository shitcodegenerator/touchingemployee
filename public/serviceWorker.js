const cacheName = '踏取打卡系統'

self.addEventListener('install', (e) => {
  // e.waitUntil(
  //   caches.open(cacheName).then((cache) => {
  //     return cache.addAll(['/', '/index.html', '/manifest.json'])
  //   })
  // )
  e.waitUntil(self.skipWaiting())
})

self.addEventListener('activate', (e) => {
  e.waitUntil(
    Promise.all([
      // 更新客户端
      self.clients.claim(), // 清理旧版本
      caches.keys().then((cacheList) => {
        return Promise.all(
          cacheList.map(function (cacheName) {
            if (cacheName !== '踏取打卡系統') {
              return caches.delete(cacheName)
            }
          })
        )
      })
    ])
  )
})

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches
      .open(cacheName)
      .then((cache) => cache.match(event.request, { ignoreSearch: true }))
      .then((response) => {
        return response || fetch(event.request)
      })
      .catch((err) => console.log(err))
  )
})
