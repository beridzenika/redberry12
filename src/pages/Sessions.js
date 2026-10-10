import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

import Filters from "../components/Filters/Filters";
import SessionSort from "../components/Sort/SessionSort";
import SessionBrowse from "../components/SessionBrowse/SessionBrowse";
import Pagination from "../components/Pagination/Pagination";

import { useFilterOptions } from "../hooks/useFilterOptions";
import { useFetch } from "../hooks/useFetch";
import { fetchSessions } from "../services/api";

const DEFAULT_SORT = "price_asc";

const parseArrayParam = (searchParams, key) => {
    const value = searchParams.get(key);

    if (!value) {
        return [];
    }

    return value.split(",").filter(Boolean);
};

function Sessions() {
    const [searchParams, setSearchParams] = useSearchParams();

    const {
        data: filterOptions,
        loading: filtersLoading,
        error: filtersError,
    } = useFilterOptions();

    const filters = useMemo(
        () => ({
            dates: searchParams.get("date")
                ? [searchParams.get("date")]
                : [],

            venues: parseArrayParam(searchParams, "venue"),

            formats: parseArrayParam(searchParams, "format"),

            languages: parseArrayParam(searchParams, "language"),

            timeBands: parseArrayParam(searchParams, "timeBand"),
        }),
        [searchParams]
    );

    const sort = searchParams.get("sort") || DEFAULT_SORT;

    const page = Math.max(
        1,
        Number(searchParams.get("page")) || 1
    );

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
        setSearchParams((current) => {
            const next = new URLSearchParams(current);

            const paramMap = {
                dates: "date",
                venues: "venue",
                formats: "format",
                languages: "language",
                timeBands: "timeBand",
            };

            const param = paramMap[type];

            next.delete(param);

            if (type === "dates") {
                if (values.length > 0) {
                    next.set("date", values[0]);
                }
            } else if (values.length > 0) {
                next.set(param, values.join(","));
            }

            next.set("page", "1");

            return next;
        });
    };

    const handleSortChange = (value) => {
        setSearchParams((current) => {
            const next = new URLSearchParams(current);

            next.set("sort", value);

            next.set("page", "1");

            return next;
        });
    };

    const handlePageChange = (newPage) => {
        setSearchParams((current) => {
            const next = new URLSearchParams(current);

            next.set("page", String(newPage));

            return next;
        });
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