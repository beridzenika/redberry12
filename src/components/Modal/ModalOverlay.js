import { useRef } from "react";
import { useDismiss } from "../../hooks/useDismiss";

import "./Modal.css";

function ModalOverlay({
    open,
    onClose,
    children,
    labelledBy,
}) {
    const modalRef = useRef(null);

    useDismiss({
        ref: modalRef,
        open,
        onDismiss: onClose,
    });

    if (!open) return null;

    return (
        <div
            className="modal-overlay"
            onMouseDown={onClose}
        >
            <div
                ref={modalRef}
                className="modal-content"
                role="dialog"
                aria-modal="true"
                aria-labelledby={labelledBy}
                onMouseDown={(event) => event.stopPropagation()}
            >
                <div className="modal">
                    {children}
                </div>
            </div>
        </div>
    );
}

export default ModalOverlay;
