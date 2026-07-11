"use client";
import { useMutation } from "@tanstack/react-query";
import api from "@/lib/axios";

interface SignupData {
    name: string;
    email: string;
    password: string;
}   

export function useSignup() {
    const mutation = useMutation({
        mutationFn: async (data: SignupData) => {
            const response = await api.post("/auth/signup", data);
            return response.data;
        }
    });
    return mutation;
}