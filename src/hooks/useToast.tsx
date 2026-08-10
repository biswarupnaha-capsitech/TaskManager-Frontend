import { useContext } from "react"
import { ToastContext } from "../context/ToastContext"

export function useToast() {
    const context = useContext(ToastContext)

    if (!context) {
        throw new Error("useToasts must be used inside TostProvider")
    }

    return context
}