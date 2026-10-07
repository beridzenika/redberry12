import "./Filters.css";
import { getNextDays } from "../../utils/dateUtils";

const DATE_COUNT = 7;

const Filters = ({ options, filters, onChange }) => {
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

    const filterGroups = [
        {
            key: "venues",
            label: "VENUE",
            options: venues,
            getValue: (venue) => venue.slug,
            getLabel: (venue) => (
                <>
                    {venue.name}
                    <span className="text-body-s text-gray">
                        {" · "}
                        {venue.city}
                    </span>
                </>
            ),
        },
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

    const activeFilterCount =
        filters.dates.length +
        filters.venues.length +
        filters.formats.length +
        filters.languages.length +
        filters.timeBands.length;

    const handleCheckboxChange = (type, value) => {
        const currentValues = filters[type];

        const newValues = currentValues.includes(value)
            ? currentValues.filter((item) => item !== value)
            : [...currentValues, value];

        onChange(type, newValues);
    };

    const handleDateChange = (date) => {
        onChange("dates", [date]);
    };

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
                    values={filters.venues}
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

                    <div className="filter-date-list">
                        {dates.map((date) => {
                            const isSelected =
                                filters.dates.includes(date.value);

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

                {filterGroups.slice(1).map((group, index) => (
                    <div key={group.key}>
                        <FilterSection
                            label={group.label}
                            options={group.options}
                            values={filters[group.key]}
                            getValue={group.getValue}
                            getLabel={group.getLabel}
                            onChange={(value) =>
                                handleCheckboxChange(group.key, value)
                            }
                        />

                        {index < filterGroups.slice(1).length - 1 && (
                            <hr className="page-line" />
                        )}
                    </div>
                ))}

                <div className="filter-footer">
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
};

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