import { useCallback, useState } from "react";

import Filters from "../components/Filters/Filters";
import SessionSort from "../components/Sort/SessionSort";
import SessionBrowse from "../components/SessionBrowse/SessionBrowse";
import Pagination from "../components/Pagination/Pagination";

import { useFilterOptions } from "../hooks/useFilterOptions";
import { useFetch } from "../hooks/useFetch";
import { fetchSessions } from "../services/api";

function Sessions() {
    const {
        data: filterOptions,
        loading: filtersLoading,
        error: filtersError,
    } = useFilterOptions();

    const [filters, setFilters] = useState({
        dates: [],
        venues: [],
        formats: [],
        languages: [],
        timeBands: [],
    });

    const [sort, setSort] = useState("price_asc");
    const [page, setPage] = useState(1);

    const getSessions = useCallback(() => {
        return fetchSessions({
            filters,
            sort,
            page,
        });
    }, [filters, sort, page]);

    const {
        data: sessionsData,
        loading: sessionsLoading,
        error: sessionsError,
    } = useFetch(getSessions, [filters, sort, page]);

    const handleFilterChange = (type, values) => {
        setFilters((current) => ({
            ...current,
            [type]: values,
        }));

        setPage(1);
    };

    const handleSortChange = (value) => {
        setSort(value);
        setPage(1);
    };

    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    return (
        <div className="session">
            <Filters
                options={filterOptions}
                filters={filters}
                onChange={handleFilterChange}
                loading={filtersLoading}
                error={filtersError}
            />

            <div className="session-content">
                <SessionSort
                    count={sessionsData?.meta?.totalSessions ?? 0}
                    value={sort}
                    onChange={handleSortChange}
                />

                <SessionBrowse
                    data={sessionsData}
                    loading={sessionsLoading}
                    error={sessionsError}
                />

                <Pagination
                    page={page}
                    lastPage={sessionsData?.meta?.lastPage ?? 1}
                    onChange={handlePageChange}
                />
            </div>
        </div>
    );
}

export default Sessions;