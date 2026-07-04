// public/sw.js — Service Worker untuk Push Notification Hari Raya Bali

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener("push", (event) => {
  const data = event.data?.json() || {};
  const title = data.title || "Lavanya Upakara";
  const options = {
    body: data.body || "Ada hari raya yang mendekati!",
    icon: "/icons/icon-192.png",
    badge: "/icons/badge-72.png",
    image: data.image,
    data: { url: data.url || "/" },
    actions: [
      { action: "view", title: "Lihat Rekomendasi" },
      { action: "dismiss", title: "Tutup" },
    ],
    vibrate: [200, 100, 200],
    tag: "hari-raya-reminder",
    renotify: true,
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  if (event.action === "dismiss") return;
  const url = event.notification.data?.url || "/";
  event.waitUntil(
    clients.matchAll({ type: "window" }).then((clientList) => {
      for (const client of clientList) {
        if (client.url === url && "focus" in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});
