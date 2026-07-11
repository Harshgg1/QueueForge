"use client";

import { useMutation } from "@tanstack/react-query";
import api from "@/lib/axios";

export function useLogout() {
  return useMutation({
    mutationFn: async () => {
      const res = await api.post("/auth/logout");
      return res.data;
    },
  });
}