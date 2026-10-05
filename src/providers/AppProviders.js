import { ModalProvider } from "../contexts/ModalContext";
import { AuthProvider } from "../contexts/AuthContext";

export function AppProviders({ children }) {
    return (
        <AuthProvider>
            <ModalProvider>
                {children}
            </ModalProvider>
        </AuthProvider>
    );
}
