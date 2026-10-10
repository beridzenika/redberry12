function getSeatClassName(seat, selected) {
    const classes = ["seat"];

    if (seat.state === "sold") {
        classes.push("seat-sold");
    }

    if (seat.state === "held") {
        classes.push("seat-held");
    }

    if (selected) {
        classes.push("seat-selected");
    }

    return classes.join(" ");
}

function SeatRow({
    row,
    selectedSeatIds,
    onSeatClick,
}) {
    return (
        <div
            className="seat-row"
            aria-label={`Row ${row.label}`}
        >
            <span
                className="row-label"
                aria-hidden="true"
            >
                {row.label}
            </span>

            <div className="seat-row-map">
                {row.seats.map((seat) => {
                    const selected = selectedSeatIds.includes(seat.id);
                    const unavailable = seat.state === "unavailable";
                    const disabled =
                        !selected && seat.state !== "available";

                    return (
                        <span
                            className="seat-position"
                            key={seat.id}
                        >
                            {unavailable ? (
                                <span
                                    className="seat-gap"
                                    aria-hidden="true"
                                />
                            ) : (
                                <button
                                    type="button"
                                    className={`text-button ${getSeatClassName(seat, selected)}`}
                                    disabled={disabled}
                                    aria-label={
                                        `Seat ${seat.code}, ` +
                                        (selected ? "selected" : seat.state)
                                    }
                                    aria-pressed={selected}
                                    title={`${seat.code} · ${seat.state}`}
                                    onClick={() => onSeatClick(seat)}
                                >
                                    {seat.label}
                                </button>
                            )}

                            {seat.aisleAfter && (
                                <span
                                    className="aisle"
                                    aria-hidden="true"
                                />
                            )}
                        </span>
                    );
                })}
            </div>
        </div>
    );
}

export default SeatRow;