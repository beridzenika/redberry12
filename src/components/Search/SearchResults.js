import { ReactComponent as PopCornIcon } from "../../assets/icons/PopCorn.svg";
import { ReactComponent as SearchIcon } from "../../assets/icons/MagnifyingGlass.svg";

import './Search.css';

function HighlightedTitle({ title, query }) {
    if (!query.trim()) {
        return title;
    }

    const searchTerm = query.trim();
    const regex = new RegExp(`(${escapeRegExp(searchTerm)})`, "gi");
    const parts = title.split(regex);

    return parts.map((part, index) => {
        const isMatch = part.toLowerCase() === searchTerm.toLowerCase();

        return isMatch ? (
            <span key={index} className="title-match">
                {part}
            </span>
        ) : (
            <span key={index}>{part}</span>
        );
    });
}
function escapeRegExp(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function SearchResults({ results, loading, error, query }) {
    if (!query.trim()) {
        return (
            <div className="search-state">
                <div className="icon-holder">
                    <PopCornIcon />
                </div>
                <div className="result-text">
                    <p className="text-label-m">
                        What do you want to watch?
                    </p>
                    <span className="text-body-m text-gray">
                        Search by title, director or cast
                    </span>
                </div>
                <button className="text-button btn-gray">
                    Browse all sessions
                </button>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="search-state">
                <p className="text-body-m">
                    Searching...
                </p>
            </div>
        );
    }
    if (error) {
        return (
            <div className="search-state error-state">
                <p className="text-body-m">
                    Something went wrong
                </p>
                <span className="text-body-s text-gray">
                    {error}
                </span>
            </div>
        );
    }

    if (results.length === 0) {
        return (
            <div className="search-state">
                <div className="icon-holder">
                    <SearchIcon />
                </div>
                <div className="result-text">
                    <p className="text-label-m">
                        No results for “{query}”
                    </p>
                    <span className="text-body-m text-gray">
                        Check the spelling or try another film or live event
                    </span>
                </div>
                <button className="text-button btn-gray">
                    Browse all sessions
                </button>
            </div>
        );
    }
    
    return (
        <div className="search-results">
            <div className="result-header">
                <div className="result-title text-label-s">
                    FILMS & EVENTS
                </div>
                <span className="text-body-s">
                    {results.length} results
                </span>
            </div>
            <ul className="results-list">
                {results.map((item) => (
                <li key={item.id} className="result-item">
                    <img 
                        src={item.posterUrl} 
                        alt={`${item.title} poster`}
                        className="result-poster" 
                    />
                    <div className="result-content">
                        <h4 className="text-label-m">
                            <HighlightedTitle
                                title={item.title}
                                query={query}
                            />
                        </h4>
                        <span className="text-body-s">
                            {item.kind.charAt(0).toUpperCase() + item.kind.slice(1)}{" · "}
                            {item.ageRating?.code}{" · "}
                            {item.runtimeMinutes}{" min"}
                        </span>
                    </div>
                    <div className="text-label-m">
                        From ₾ {item.fromPrice}
                    </div>
                </li>
                ))}
            </ul>
        </div>
    );
};

export default SearchResults;