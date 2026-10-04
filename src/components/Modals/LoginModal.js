import { useModal } from "../../hooks/useModal";
import ModalOverlay from "../Modal/ModalOverlay";

function LoginModal() {
    const { modals, closeModal } = useModal();
    
    const handleClose = () => closeModal("login");
    
    return (
        <ModalOverlay
            open={modals.login}
            onClose={() => closeModal("login")}
        >
            <div className="">login</div>
        </ModalOverlay>
    );
};

export default LoginModal;