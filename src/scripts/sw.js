import { precacheAndRoute } from "workbox-precaching";
import { registerRoute } from 'workbox-routing';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';
import { NetworkFirst, CacheFirst, StaleWhileRevalidate } from 'workbox-strategies';
import { API_URL } from "./config";

// event untuk melakukan precaching
const manifest = self.__WB_MANIFEST;
precacheAndRoute(manifest);

// runtime caching
registerRoute(
  ({url})=>{
    return (
      url.origin === 'https://fonts.googleapis.com' || url.origin === 'https://fonts.gstatic.com'
    )
  },

  CacheFirst({
    cacheName: 'google-font'
  })
)

registerRoute(
  ({request, url})=>{
    const baseUrl = new URL(API_URL.BASE_URL)
    return baseUrl.origin === url.origin && request.destination != 'image'
  },

  new NetworkFirst({
    cacheName: 'story-api'
  })

)

registerRoute(
  ({request, url})=>{
    const baseUrl = new URL(API_URL.BASE_URL)
    return baseUrl.origin === url.origin && request.destination === 'image'
  },

  new StaleWhileRevalidate({
    cacheName: 'story-api-image'
  })
)

registerRoute(
  ({url})=>{
    return url.origin.includes('maptiler')

  },
  new NetworkFirst({
    cacheName: 'maptiler-api'
  })
)



self.addEventListener('push', (event) => {
  console.log('[Service worker] pushing...');

  async function showNotification() {
    const data = await event.data.json();

    await self.registration.showNotification(data.title, {
      body: data.options.body,
    });
  }

  event.waitUntil(showNotification());
});