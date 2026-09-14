"use client";

import { useEffect } from "react";

const HEALTH_CHECK_INTERVAL_MS = 20 * 60 * 1000;

export default function BackendHealthCheck() {
  useEffect(() => {
    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL;
    if (!socketUrl) return;

    const healthUrl = new URL("/health", socketUrl).toString();
    const checkHealth = () => {
      void fetch(healthUrl, { method: "GET", cache: "no-store" }).catch(() => {
        // The health check is best effort and should not affect the app UI.
      });
    };

    checkHealth();
    const interval = window.setInterval(checkHealth, HEALTH_CHECK_INTERVAL_MS);

    return () => window.clearInterval(interval);
  }, []);

  return null;
}
