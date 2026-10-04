import { useEffect } from "react";

export function useDismiss({
    ref, 
    open, 
    onDismiss, 
    escape = true, 
    clickOutside = true
}) {
    
    useEffect(() => {
        if(!open) return;

        const handleMouseDown = (event) => {
            if(
                clickOutside && 
                ref.current && 
                !ref.current.contains(event.target)
            ){
                onDismiss();
            }
        }
        const handleKeyDown = (event) => {
            if(escape && event.key === "Escape") {
                onDismiss();
            }
        }

        if(clickOutside) {
            document.addEventListener("mousedown", handleMouseDown);
        }
        if(escape) {
            document.addEventListener("keydown", handleKeyDown);
        }
        

        return () => {
            document.removeEventListener("mousedown", handleMouseDown);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [ref, open, onDismiss, escape, clickOutside]);
};
