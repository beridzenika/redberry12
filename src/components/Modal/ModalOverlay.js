import { useRef } from "react";
import { useDismiss } from "../../hooks/useDismiss";

import "./Modal.css";

function ModalOverlay({open, onClose, children}) {
    const modalRef = useRef(null);
    
    useDismiss({
        ref: modalRef,
        open,
        onDismiss: onClose,
    });

    if(!open) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div
                className="modal-content"
                ref={modalRef}
                onClick={(e) => e.stopPropagation()}
            >
                {children}
            </div>
        </div>
    )
};

export default ModalOverlay;