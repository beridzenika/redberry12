import "./Filters.css";
import { useEffect, useState } from "react";
import { getNextDays } from "../../utils/dateUtils";

const DATE_COUNT = 7;

function Filters({
    options,
    filters,
    onChange,
    loading,
    error,
}) {
    const [selectedDate, setSelectedDate] = useState(
        filters?.dates?.[0] ?? null
    );

    // Keep the selected date synchronized with the parent filters.
    useEffect(() => {
        setSelectedDate(filters?.dates?.[0] ?? null);
    }, [filters?.dates]);

    if (loading) {
        return (
            <aside className="session-aside">
                Loading filters...
            </aside>
        );
    }

    if (error) {
        return (
            <aside className="session-aside">
                Failed to load filters:
                <span className="text-label-s text-red">
                    {error}
                </span>
            </aside>
        );
    }

    if (!options) {
        return null;
    }

    const {
        venues = [],
        formats = [],
        languages = [],
        timeBands = [],
    } = options;

    const dates = getNextDays(DATE_COUNT);

    const safeFilters = {
        dates: filters?.dates ?? [],
        venues: filters?.venues ?? [],
        formats: filters?.formats ?? [],
        languages: filters?.languages ?? [],
        timeBands: filters?.timeBands ?? [],
    };

    // Count every active selection.
    const activeFilterCount = Object.values(safeFilters).reduce(
        (total, values) => total + values.length,
        0
    );

    const handleCheckboxChange = (type, value) => {
        const currentValues = safeFilters[type];

        const newValues = currentValues.includes(value)
            ? currentValues.filter((item) => item !== value)
            : [...currentValues, value];

        onChange(type, newValues);
    };

    // Clear all filters in a single parent state update.
    const handleClearFilters = () => {
        setSelectedDate(null);

        onChange("clear", {
            dates: [],
            venues: [],
            formats: [],
            languages: [],
            timeBands: [],
        });
    };

    const handleDateChange = (date) => {
        if (selectedDate === date) {
            setSelectedDate(null);
            onChange("dates", []);
        } else {
            setSelectedDate(date);
            onChange("dates", [date]);
        }
    };

    const filterGroups = [
        {
            key: "formats",
            label: "FORMAT",
            options: formats,
            getValue: (format) => format.slug,
            getLabel: (format) => format.name,
        },
        {
            key: "languages",
            label: "LANGUAGE",
            options: languages,
            getValue: (language) => language.slug,
            getLabel: (language) => language.name,
        },
        {
            key: "timeBands",
            label: "TIME OF THE DAY",
            options: timeBands,
            getValue: (timeBand) => timeBand.id,
            getLabel: (timeBand) => {
                const [name, time] = timeBand.label.split(" (");

                return (
                    <>
                        {name}
                        {time && (
                            <span className="text-body-s text-gray">
                                {" · "}
                                {time.replace(")", "")}
                            </span>
                        )}
                    </>
                );
            },
        },
    ];

    return (
        <aside className="session-aside">
            <header className="session-header">
                <h2 className="text-h1">Sessions</h2>

                <span className="text-body-m text-gray">
                    Browse showtimes across all venues
                </span>
            </header>

            <div className="filters">
                <div className="filter-header">
                    <h3 className="text-h3">Filters</h3>
                </div>

                {/* Venue */}
                <FilterSection
                    label="VENUE"
                    options={venues}
                    values={safeFilters.venues}
                    getValue={(venue) => venue.slug}
                    getLabel={(venue) => (
                        <>
                            {venue.name}
                            <span className="text-body-s text-gray">
                                {" · "}
                                {venue.city}
                            </span>
                        </>
                    )}
                    onChange={(value) =>
                        handleCheckboxChange("venues", value)
                    }
                />

                <hr className="page-line" />

                {/* Date */}
                <div className="filter-section filter-section-date">
                    <div className="text-overline text-gray">
                        DATE
                    </div>

                    <div className="filter-date-list horizontal-scroll">
                        {dates.map((date) => {
                            const isSelected =
                                selectedDate === date.value;

                            return (
                                <button
                                    key={date.value}
                                    type="button"
                                    className={`filter-date ${
                                        isSelected
                                            ? "filter-date-active"
                                            : ""
                                    }`}
                                    onClick={() =>
                                        handleDateChange(date.value)
                                    }
                                >
                                    <span className="text-label-s">
                                        {date.weekday}
                                    </span>

                                    <span className="text-label-s">
                                        {date.day}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                <hr className="page-line" />

                {/* Format, language, and time of day */}
                {filterGroups.map((group, index) => (
                    <div key={group.key}>
                        <FilterSection
                            label={group.label}
                            options={group.options}
                            values={safeFilters[group.key]}
                            getValue={group.getValue}
                            getLabel={group.getLabel}
                            onChange={(value) =>
                                handleCheckboxChange(
                                    group.key,
                                    value
                                )
                            }
                        />

                        {index < filterGroups.length - 1 && (
                            <hr className="page-line" />
                        )}
                    </div>
                ))}

                {/* Footer */}
                <div className="filter-footer">
                    {activeFilterCount > 0 && (
                        <button
                            type="button"
                            className="text-label-s btn-border clear-filter-btn"
                            onClick={handleClearFilters}
                        >
                            Clear filters
                        </button>
                    )}

                    <span className="text-body-s text-gray">
                        {activeFilterCount}{" "}
                        {activeFilterCount === 1
                            ? "filter"
                            : "filters"}{" "}
                        active
                    </span>
                </div>
            </div>
        </aside>
    );
}

const FilterSection = ({
    label,
    options,
    values,
    getValue,
    getLabel,
    onChange,
}) => {
    return (
        <div className="filter-section">
            <div className="text-overline text-gray">
                {label}
            </div>

            <div className="filter-options">
                {options.map((option) => {
                    const value = getValue(option);
                    const isChecked = values.includes(value);

                    return (
                        <label
                            key={value}
                            className="filter-checkbox"
                        >
                            <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => onChange(value)}
                            />

                            <span className="filter-checkbox-label text-label-m">
                                {getLabel(option)}
                            </span>
                        </label>
                    );
                })}
            </div>
        </div>
    );
};

export default Filters;