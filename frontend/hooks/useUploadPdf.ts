import queryClient from "@/lib/queryClient"
import { useMutation } from "@tanstack/react-query"
import api from "@/lib/axios"

export default function useUploadPdf() {
    return useMutation({
        mutationFn: async(formData: FormData) => {
            return await api.post("/jobs/pdf", formData)
        },
        onSuccess() {
            queryClient.invalidateQueries({ queryKey: ["jobs"] })
        }
    })
}