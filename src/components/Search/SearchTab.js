import { useRef, useState } from "react";

import SearchOverlay from "./SearchOverlay";
import { useDismiss } from "../../hooks/useDismiss";

import { ReactComponent as SearchIcon } from "../../assets/icons/MagnifyingGlass.svg";
import { ReactComponent as ClearIcon } from "../../assets/icons/Clear.svg";

import "./Search.css";

function SearchTab() {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [query, setQuery] = useState("");

    const searchRef = useRef(null);
    const inputRef = useRef(null);

    const handleFocus = () => {
        setIsSearchOpen(true);
    };

    const handleClose = () => {
        setIsSearchOpen(false);
        setQuery("");
        inputRef.current?.blur();
    };

    useDismiss({
        ref: searchRef,
        open: isSearchOpen,
        onDismiss: handleClose,
    })

    return (
        <div className="search-container" ref={searchRef}>
            <div
                className={`search-tab ${
                    isSearchOpen ? "search-tab-open" : ""
                }`}
            >
                <SearchIcon className="search-icon" />
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={handleFocus}
                    placeholder="Search films and live events"
                    className="search-input text-body-m"
                    autoComplete="off"
                />
                {isSearchOpen && (
                    <button
                        type="button"
                        className="search-clear-btn"
                        onClick={handleClose}
                        aria-label="Close search"
                    >
                        <ClearIcon />
                    </button>
                )}
            </div>
            <SearchOverlay
                isOpen={isSearchOpen}
                query={query}
            />
        </div>
    );
}

export default SearchTab;