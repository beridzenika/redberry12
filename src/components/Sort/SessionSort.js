import { useEffect, useRef, useState } from "react";

import { ReactComponent as OpenIcon } from "../../assets/icons/Open.svg";

import "./Sort.css";

const SORT_OPTIONS = [
    {
        value: "time_asc",
        label: "Showtime: Earliest First",
    },
    {
        value: "time_desc",
        label: "Showtime: Latest First",
    },
    {
        value: "price_asc",
        label: "Price: Low to High",
    },
    {
        value: "price_desc",
        label: "Price: High to Low",
    },
    {
        value: "title_asc",
        label: "Title: A–Z",
    },
];

function SessionSort({count, value, onChange}) {
    const [isOpen, setIsOpen] = useState(false);
    const sortRef = useRef(null);

    const selectedOption =
        SORT_OPTIONS.find((option) => option.value === value) ||
        SORT_OPTIONS[0];

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                sortRef.current &&
                !sortRef.current.contains(event.target)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );
        };
    }, []);

    const handleSelect = (option) => {
        onChange(option.value);
        setIsOpen(false);
    };

    return (
        <div className="session-sort-container">
            <div className="text-label-m">
                Showing {count} sessions
            </div>

            <div
                ref={sortRef}
                className="session-sort"
            >
                <span className="text-body-m text-gray">
                    Sort:
                </span>

                <button
                    type="button"
                    className="session-sort-trigger text-button"
                    onClick={() => setIsOpen((current) => !current)}
                    aria-expanded={isOpen}
                    aria-haspopup="listbox"
                >
                    <span>{selectedOption.label}</span>

                    <OpenIcon
                        className={`sort-open-icon ${
                            isOpen ? "open-icon-rotated" : ""
                        }`}
                        aria-hidden="true"
                    />
                </button>

                {isOpen && (
                    <div
                        className="session-sort-options"
                        role="listbox"
                    >
                        {SORT_OPTIONS.map((option) => (
                            <button
                                key={option.value}
                                type="button"
                                className={`session-sort-option ${
                                    option.value === value
                                        ? "session-sort-option-active"
                                        : ""
                                }`}
                                onClick={() => handleSelect(option)}
                                role="option"
                                aria-selected={
                                    option.value === value
                                }
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default SessionSort;