
import { ReactComponent as CloseIcon } from "../../assets/icons/Close.svg";

const TICKET_OPTIONS = [
    { type: "child", label: "Child", discount: "60%" },
    { type: "student", label: "Student", discount: "75%" },
    { type: "adult", label: "Adult", discount: "100%" },
];

function BookingSelectionSummary({
    MAX_SEATS,
    selectedSeats,
    subtotal,
    childAllowed = true,
    onTicketTypeChange,
    onRemoveSeat,
    onNext,
}) {
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
                                            ₾ {seat.price.toFixed(2)}
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
                                    {TICKET_OPTIONS.map((option) => {
                                        const disabled =
                                            option.type === "child" &&
                                            !childAllowed;

                                        const active =
                                            seat.ticketType === option.type;

                                        return (
                                            <button
                                                key={option.type}
                                                type="button"
                                                className={`discount-btn text-body-s ${
                                                    active ? "active" : ""
                                                }`}
                                                disabled={disabled}
                                                aria-pressed={active}
                                                onClick={() =>
                                                    onTicketTypeChange(
                                                        seat.id,
                                                        option.type
                                                    )
                                                }
                                                title={
                                                    disabled
                                                        ? "Child tickets are not allowed for this film"
                                                        : `${option.label} ${option.discount}`
                                                }
                                            >
                                                {option.label}{" "}
                                                {option.discount}
                                            </button>
                                        );
                                    })}
                                </div>
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
                        ₾ {subtotal}
                    </p>
                </div>

                <button
                    type="button"
                    className="auth-btn"
                    disabled={selectedSeats.length === 0}
                    onClick={onNext}
                >
                    Next: Checkout
                </button>
            </div>
        </footer>
    );
}

export default BookingSelectionSummary;