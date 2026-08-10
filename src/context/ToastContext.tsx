import {
    useId,
    Toaster,
    useToastController,
    Toast,
    ToastTitle,
    type ToastIntent,
} from "@fluentui/react-components";
import { createContext, type ReactNode } from "react";
import type { ToastContextType } from "../common/types";

export const ToastContext = createContext<ToastContextType | null>(null)

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
                timeout={2000}
            />
            {children}
        </ToastContext.Provider>
    )
}
