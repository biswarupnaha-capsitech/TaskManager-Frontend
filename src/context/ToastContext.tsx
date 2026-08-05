import {
    useId,
    Toaster,
    useToastController,
    Toast,
    ToastTitle,
    type ToastIntent,
} from "@fluentui/react-components";
import { createContext, useContext, type ReactNode } from "react";
import type { ToastContextType } from "../common/types";

const ToastContext = createContext<ToastContextType | null>(null)

export function ToastProvider({ children }: { children: ReactNode }) {
    const toasterId = useId("toaster");
    const { dispatchToast } = useToastController(toasterId);
    const notify = (msg: string, intent: ToastIntent) =>
        dispatchToast(
            <Toast>
                <ToastTitle>{msg}</ToastTitle>
            </Toast>,
            { intent }
        );

    return (
        <ToastContext.Provider
            value={{ notify }}
        >
            <Toaster
                toasterId={toasterId}
                position="top-end"
                pauseOnHover
                pauseOnWindowBlur
                timeout={1000}
            />
            {children}
        </ToastContext.Provider>
    )
}

export function useToast() {
    const context = useContext(ToastContext)

    if (!context) {
        throw new Error("useToasts must be used inside TostProvider")
    }

    return context
}
