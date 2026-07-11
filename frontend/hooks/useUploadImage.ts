import queryClient from "@/lib/queryClient"
import { useMutation } from "@tanstack/react-query"
import api from "@/lib/axios"

export default function useUploadImage() {
    return useMutation({
        mutationFn: async(formData: FormData) => {
            return await api.post("/jobs/image", formData)
        },
        onSuccess() {
            queryClient.invalidateQueries({ queryKey: ["jobs"] })
        }
    })
}