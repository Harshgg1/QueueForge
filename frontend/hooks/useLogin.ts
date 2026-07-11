"use client";
import { useMutation } from "@tanstack/react-query";
import api from "@/lib/axios";

interface LoginData {
    email: string;
    password: string;
}   

export function useLogin() {
    const mutation = useMutation({
        mutationFn: async (data: LoginData) => {
            const response = await api.post("/login", data);
            return response.data;
        }
    });
    return mutation;
}