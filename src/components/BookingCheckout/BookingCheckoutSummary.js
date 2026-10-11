function BookingCheckoutSummary({
    session,
    selectedSeats,
    subtotal,
    onCompleteOrder,
}) {
    const movieTitle =
        session?.movie?.title ?? session?.movieTitle ?? "Movie";

    const hall = session?.hall?.name ?? session?.hallName ?? "Hall";

    const dateTime = session?.startsAt ?? session?.startTime;

    const formattedDateTime = dateTime
        ? new Date(dateTime).toLocaleString("en-GB", {
              weekday: "short",
              day: "2-digit",
              month: "short",
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
          })
        : "";

    const seatCodes = selectedSeats.map((seat) => seat.code).join(", ");

    const ticketCounts = selectedSeats.reduce((counts, seat) => {
        const type = seat.ticketType;
        counts[type] = (counts[type] ?? 0) + 1;
        return counts;
    }, {});

    const ticketLabels = {
        adult: "Adult",
        child: "Child",
        student: "Student",
    };

    const tickets = Object.entries(ticketCounts)
        .map(([type, count]) => `${count}x ${ticketLabels[type] ?? type}`)
        .join(", ");

    return (
        <footer className="booking-meta">
            <div className="booking-meta-content">
                <h3 className="text-button">Summary</h3>

                <div className="checkout-summary-movie">
                    <div className="checkout-summary-content">
                        <h4 className="text-button">{movieTitle}</h4>

                        <p className="text-body-s text-gray">
                            {[hall, formattedDateTime]
                                .filter(Boolean)
                                .join(" · ")}
                        </p>
                    </div>

                    <hr className="page-line" />

                    <div className="checkout-summary-row">
                        <span className="text-body-s text-gray">
                            Seats
                        </span>

                        <span className="text-label-s">
                            {seatCodes || "—"}
                        </span>
                    </div>

                    <div className="checkout-summary-row">
                        <span className="text-body-s text-gray">
                            Tickets
                        </span>

                        <span className="text-label-s">
                            {tickets || "—"}
                        </span>
                    </div>
                </div>

                
            </div>

            <div className="booking-meta-footer">
                <div className="booking-total-holder">
                    <span className="text-label-s">SUBTOTAL</span>

                    <p className="text-h1">
                        ₾ {Number(subtotal).toFixed(2)}
                    </p>
                </div>

                <button
                    type="button"
                    className="auth-btn"
                    disabled={selectedSeats.length === 0}
                    onClick={onCompleteOrder}
                >
                    Pay: Complete order
                </button>
            </div>
        </footer>
    );
}

export default BookingCheckoutSummary;