import { useEffect } from "react";
import useSearch from "../../hooks/useSearch";
import SearchResults from "./SearchResults";

import "./Search.css";

function SearchOverlay({ isOpen, query }) {
    const {
        results,
        loading,
        error,
        handleSearch
    } = useSearch();

    useEffect(() => {
        handleSearch(query);
    }, [query, handleSearch]);

    if (!isOpen) return null;

    return (
        <div className="search-overlay">
            <SearchResults
                results={results}
                loading={loading}
                error={error}
                query={query}
            />
        </div>
    );
}

export default SearchOverlay;
