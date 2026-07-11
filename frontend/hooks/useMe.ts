"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";

export function useMe() {
  return useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const res = await api.get("/auth/me");
      return res.data;
    },
    retry: false,
  });
}