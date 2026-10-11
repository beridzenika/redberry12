import { ReactComponent as CloseIcon } from "../../assets/icons/Close.svg";

function BookingSelectionSummary({
    MAX_SEATS,
    selectedSeats,
    subtotal,
    ticketTypes = [],
    isTicketTypeAllowed,
    canCheckout,
    onTicketTypeChange,
    onRemoveSeat,
    onNext,
}) {
    const hasInvalidTicketType = selectedSeats.some((seat) => {
        const selectedTicket = ticketTypes.find(
            (option) => option.slug === seat.ticketType
        );

        if (!selectedTicket) return true;

        return (
            typeof isTicketTypeAllowed === "function" &&
            !isTicketTypeAllowed(selectedTicket.slug)
        );
    });

    const isCheckoutDisabled =
        !canCheckout ||
        selectedSeats.length === 0 ||
        hasInvalidTicketType;


    return (
        <footer className="booking-meta">
            <div className="booking-meta-content">
                <h3 className="text-button">
                    Your seats · Max {MAX_SEATS}
                </h3>

                {selectedSeats.length === 0 ? (
                    <p className="text-body-s text-gray">
                        Pick up to {MAX_SEATS} seats.
                        Each seat can carry its own ticket type.
                    </p>
                ) : (
                    <div className="selected-seats-scroll">
                        {selectedSeats.map((seat) => (
                            <div
                                key={seat.id}
                                className="selected-seat-holder"
                            >
                                <div className="selected-seat-content">
                                    <div className="selected-seat-component">
                                        <span className="text-body-s text-gray">
                                            Seat
                                        </span>

                                        <span className="text-label-s">
                                            {seat.code}
                                        </span>
                                    </div>

                                    <div className="selected-seat-component">
                                        <span className="text-label-s">
                                            ₾ {Number(seat.price).toFixed(2)}
                                        </span>

                                        <button
                                            type="button"
                                            className="seat-remove-btn"
                                            aria-label={`Remove seat ${seat.code}`}
                                            onClick={() =>
                                                onRemoveSeat(seat.id)
                                            }
                                        >
                                            <CloseIcon
                                                className="seat-close-icon"
                                                aria-hidden="true"
                                            />
                                        </button>
                                    </div>
                                </div>

                                <hr className="page-line" />

                                <div className="selected-seat-discounts">
                                    {ticketTypes.map((option) => {
                                        const allowed =
                                            typeof isTicketTypeAllowed ===
                                            "function"
                                                ? isTicketTypeAllowed(
                                                      option.slug
                                                  )
                                                : true;

                                        const active =
                                            seat.ticketType === option.slug;

                                        const multiplier = Number(
                                            option.priceRatio ?? 1
                                        );

                                        const percentage = Math.round(
                                            multiplier * 100
                                        );

                                        return (
                                            <button
                                                key={option.id ?? option.slug}
                                                type="button"
                                                className={`discount-btn text-body-s ${
                                                    active ? "active" : ""
                                                }`}
                                                disabled={!allowed && !active}
                                                aria-pressed={active}
                                                onClick={() =>
                                                    onTicketTypeChange(
                                                        seat.id,
                                                        option.slug
                                                    )
                                                }
                                                title={
                                                    !allowed
                                                        ? option.note ||
                                                          `${option.name} tickets are not available for this film`
                                                        : option.note ||
                                                          `${option.name}: ${percentage}% of the base price`
                                                }
                                            >
                                                {option.name} {percentage}%
                                            </button>
                                        );
                                    })}
                                </div>

                                {ticketTypes.find(
                                    (option) =>
                                        option.slug === seat.ticketType
                                )?.note && (
                                    <p className="text-body-s text-gray">
                                        {
                                            ticketTypes.find(
                                                (option) =>
                                                    option.slug ===
                                                    seat.ticketType
                                            ).note
                                        }
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="booking-meta-footer">
                <div className="booking-total-holder">
                    <span className="text-label-s">
                        SUBTOTAL
                    </span>

                    <p className="text-h1">
                        ₾ {Number(subtotal).toFixed(2)}
                    </p>
                </div>

                <button
                    type="button"
                    className="auth-btn"
                    disabled={isCheckoutDisabled}
                    onClick={onNext}
                    title={
                        isCheckoutDisabled
                            ? "Choose valid ticket types and seats before checkout."
                            : "Continue to checkout"
                    }
                >
                    Next: Checkout
                </button>
            </div>
        </footer>
    );
}

export default BookingSelectionSummary;