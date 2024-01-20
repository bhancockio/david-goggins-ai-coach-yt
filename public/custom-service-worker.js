// This will be replaced by Workbox with the list of assets to precache
self.__WB_MANIFEST;

self.addEventListener("push", function (event) {
  const data = event.data.text();
  const title = data || "A new message!";
  const options = {
    body: data.body || "You have a new notification.",
    icon: "/icons/icon-192x192.png",
    badge: "/icons/badge-72x72.png",
  };

  event.waitUntil(self.registration.showNotification(title, options));
});
