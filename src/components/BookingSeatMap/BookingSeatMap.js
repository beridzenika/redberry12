import SeatRow from "./SeatRow";

import "./BookingSeatMap.css";

function BookingSeatMap({
    seatMap,
    loading,
    error,
    selectedSeatIds,
    onSeatClick,
    onRetry,
}) {
    return (
        <section
            className="booking-view-holder"
            aria-label="Seat selection"
        >
            <div className="booking-view">
                <div
                    className="screen"
                    aria-label="Screen"
                >
                    SCREEN
                </div>

                {loading && (
                    <p role="status">
                        Loading seat map...
                    </p>
                )}

                {error && (
                    <div
                        role="alert"
                        className="text-label-s text-red"
                    >
                        <p>
                            Could not load the seat map.
                        </p>

                        <button
                            type="button"
                            onClick={onRetry}
                        >
                            Retry
                        </button>
                    </div>
                )}

                {!loading && !error && (
                    <>
                        {seatMap?.sections.map((section) => {
                            const firstRow = section.rows[0]?.label;
                            const lastRow =
                                section.rows[section.rows.length - 1]?.label;

                            return (
                                <section
                                    className="seat-section"
                                    key={section.name}
                                    aria-label={section.name}
                                >
                                    <h3 className="text-label-s text-gray">
                                        {section.name.toUpperCase()}
                                        {" · "}
                                        ROWS {firstRow}-{lastRow}
                                    </h3>

                                    <div className="seat-section-rows">
                                        {section.rows.map((row) => (
                                            <SeatRow
                                                key={`${section.name}-${row.label}`}
                                                row={row}
                                                selectedSeatIds={selectedSeatIds}
                                                onSeatClick={onSeatClick}
                                            />
                                        ))}
                                    </div>
                                </section>
                            );
                        })}

                        {seatMap?.sections.length === 0 && (
                            <p>
                                No seat layout is available
                                for this session.
                            </p>
                        )}
                    </>
                )}
            </div>

            <ul
                className="seats-types"
                aria-label="Seat availability legend"
            >
                <li className="text-body-s text-gray">
                    <span
                        className="seat-legend seat-available"
                        aria-hidden="true"
                    />
                    Available
                </li>

                <li className="text-body-s text-gray">
                    <span
                        className="seat-legend seat-selected"
                        aria-hidden="true"
                    />
                    Selected
                </li>

                <li className="text-body-s text-gray">
                    <span
                        className="seat-legend seat-sold"
                        aria-hidden="true"
                    />
                    Sold
                </li>

                <li className="text-body-s text-gray">
                    <span
                        className="seat-legend held"
                        aria-hidden="true"
                    />
                    Held by another user
                </li>
            </ul>
        </section>
    );
}

export default BookingSeatMap;