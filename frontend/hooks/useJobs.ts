"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";

export function useJob(id: string) {
    return useQuery({
        queryKey:["jobs", id],

        queryFn: async () => {

            const res = await api.get(`/jobs/${id}`);

            return res.data;

        },
        enabled: !!id,
    });
}

export function useJobs() {
    return useQuery({
        queryKey:["jobs"],

        queryFn: async () => {

            const res = await api.get("/jobs");

            return res.data;

        }
    });
}