import { useEffect } from "react";
import toast from "react-hot-toast";

function useServiceWorker() {
  useEffect(() => {
    async function registerServiceWorker() {
      if ("serviceWorker" in navigator) {
        try {
          const registrations =
            await navigator.serviceWorker.getRegistrations();

          console.log(registrations);

          if (registrations.length) {
            // Assume the first registration is the one we want to keep
            // and unregister any additional ones
            for (let i = 1; i < registrations.length; i++) {
              registrations[i].unregister();
              console.log(
                "Unregistered redundant service worker:",
                registrations[i]
              );
            }
          } else {
            // If there are no registrations, register the service worker
            const registration = await navigator.serviceWorker.register(
              "/sw.js"
            );
            console.log(
              "Service Worker registered with scope:",
              registration.scope
            );
          }

          // Assuming we have a registration at this point, attach the updatefound listener
          const registration = await navigator.serviceWorker.ready;
          console.log("Service Worker ready:", registration);

          // Check for updates to the service worker.
          if (registration) {
            registration.onupdatefound = () => {
              const installingWorker = registration?.installing;
              if (installingWorker) {
                installingWorker.onstatechange = () => {
                  if (installingWorker.state === "installed") {
                    toast.success(
                      "New update available! Please refresh page to update."
                    );
                  }
                };
              }
            };
          }
        } catch (error) {
          console.error("Service Worker registration failed:", error);
        }
      }
    }

    registerServiceWorker();
  }, []);
}

export default useServiceWorker;
