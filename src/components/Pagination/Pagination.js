import "./Pagination.css";

function Pagination({ page, lastPage, onChange }) {
    if (lastPage <= 1) {
        return null;
    }

    const handlePrevious = () => {
        if (page > 1) {
            onChange(page - 1);
        }
    };

    const handleNext = () => {
        if (page < lastPage) {
            onChange(page + 1);
        }
    };

    return (
        <nav className="pagination" aria-label="Pagination">
            <button
                type="button"
                onClick={handlePrevious}
                disabled={page === 1}
            >
                Previous
            </button>

            <span>
                Page {page} of {lastPage}
            </span>

            <button
                type="button"
                onClick={handleNext}
                disabled={page === lastPage}
            >
                Next
            </button>
        </nav>
    );
};

export default Pagination;