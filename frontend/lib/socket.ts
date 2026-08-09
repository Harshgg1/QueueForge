"use client";

import { io} from "socket.io-client";

// Remove '/api' from the end if it exists to get the base backend URL
const backendUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/api$/, '') || "http://localhost:4000";

export const socket = io(backendUrl, {
    withCredentials: true,
    autoConnect: false
});