import { useState } from "react";

import Filters from "../components/Filters/Filters";
import { useFilterOptions } from "../hooks/useFilterOptions";

function Sessions() {
    const { data: filterOptions, loading, error } = useFilterOptions();

    const [filters, setFilters] = useState({
        dates: [],
        venues: [],
        formats: [],
        languages: [],
        timeBands: [],
    });

    const handleFilterChange = (type, values) => {
        setFilters((current) => ({
            ...current,
            [type]: values,
        }));
    };

    return (
        <div className="session">
            <Filters
                options={filterOptions}
                filters={filters}
                onChange={handleFilterChange}
            />

            {/* Results will go here */}
        </div>
    );
};

export default Sessions;