"use client";

import { io} from "socket.io-client";

// WebSockets connect directly to the backend (can't be proxied through Next.js rewrites)
const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "https://api.queueforge.harshgg.me";

export const socket = io(backendUrl, {
    withCredentials: true,
    autoConnect: false
});