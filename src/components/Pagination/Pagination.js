import "./Pagination.css";
import { ReactComponent as OpenIcon } from "../../assets/icons/Open.svg";

function Pagination({ page, lastPage, onChange }) {
    if (lastPage <= 1) {
        return null;
    }

    const getPages = () => {
        if (lastPage <= 7) {
            return Array.from({ length: lastPage }, (_, index) => index + 1);
        }

        const pages = [1];

        if (page <= 4) {
            pages.push(2, 3, 4, 5, "ellipsis", lastPage);
        } else if (page >= lastPage - 3) {
            pages.push(
                "ellipsis",
                lastPage - 4,
                lastPage - 3,
                lastPage - 2,
                lastPage - 1,
                lastPage
            );
        } else {
            pages.push(
                "ellipsis",
                page - 1,
                page,
                page + 1,
                "ellipsis",
                lastPage
            );
        }

        return pages;
    };

    return (
        <nav className="pagination" aria-label="Pagination">
            <button
                type="button"
                className="pagination-arrow pagination-arrow-left"
                onClick={() => page > 1 && onChange(page - 1)}
                disabled={page === 1}
                aria-label="Previous page"
            >
                <OpenIcon />
            </button>

            <div className="pagination-pages">
                {getPages().map((item, index) => {
                    if (item === "ellipsis") {
                        return (
                            <span
                                key={`ellipsis-${index}`}
                                className="pagination-ellipsis"
                            >
                                ...
                            </span>
                        );
                    }

                    return (
                        <button
                            key={item}
                            type="button"
                            className={`pagination-page ${
                                item === page ? "active" : ""
                            }`}
                            onClick={() => onChange(item)}
                            aria-current={item === page ? "page" : undefined}
                        >
                            {item}
                        </button>
                    );
                })}
            </div>

            <button
                type="button"
                className="pagination-arrow pagination-arrow-right"
                onClick={() => page < lastPage && onChange(page + 1)}
                disabled={page === lastPage}
                aria-label="Next page"
            >
                <OpenIcon />
            </button>
        </nav>
    );
}

export default Pagination;