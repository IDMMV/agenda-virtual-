const CACHE_NAME = "mi-hogar-disciplina-v6.0.0";
const APP_SHELL = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icons/icon.svg",
  "./icons/icon-192.svg",
  "./icons/icon-512.svg"
];

// Instalar y precachear shell
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(APP_SHELL);
    }).then(() => self.skipWaiting())
  );
});

// Activar y limpiar versiones viejas
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

// Estrategia Network First con fallback a Cache para HTML/datos, Cache First para estáticos
self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);

  // Evitar interceptar peticiones a APIs de Google o Supabase directamente
  if (url.origin.includes("googleapis.com") || url.origin.includes("supabase.co")) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then(networkResponse => {
        if (networkResponse && networkResponse.status === 200 && url.origin === location.origin) {
          const clone = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return networkResponse;
      })
      .catch(() => {
        return caches.match(event.request).then(cached => {
          return cached || caches.match("./index.html");
        });
      })
  );
});

// Manejo de Notificaciones locales y en segundo plano
self.addEventListener("notificationclick", event => {
  event.notification.close();
  const urlToOpen = event.notification.data?.url || "./";

  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(clientList => {
      for (const client of clientList) {
        if (client.url.includes(location.origin) && "focus" in client) {
          return client.focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(urlToOpen);
      }
    })
  );
});

// Escuchar mensajes de la página para programar o disparar recordatorios
self.addEventListener("message", event => {
  if (!event.data) return;

  if (event.data.type === "SHOW_NOTIFICATION") {
    const { title, body, icon, tag, data } = event.data.payload || {};
    self.registration.showNotification(title || "Gestión Personal", {
      body: body || "Recordatorio diario de disciplina y finanzas.",
      icon: icon || "./icons/icon-192.svg",
      badge: "./icons/icon-192.svg",
      tag: tag || "mh-reminder",
      vibrate: [150, 80, 150],
      data: data || { url: "./" }
    });
  }

  if (event.data.type === "SCHEDULE_REMINDER") {
    const { delayMs, title, body, tag, data } = event.data.payload || {};
    if (delayMs && delayMs > 0) {
      setTimeout(() => {
        self.registration.showNotification(title || "Recordatorio de Agenda", {
          body: body || "Tienes una actividad pendiente para hoy.",
          icon: "./icons/icon-192.svg",
          badge: "./icons/icon-192.svg",
          tag: tag || "mh-scheduled",
          vibrate: [200, 100, 200],
          data: data || { url: "./" }
        });
      }, delayMs);
    }
  }
});
