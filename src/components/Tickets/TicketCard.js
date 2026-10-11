
import { useState } from "react";
import { refundOrder } from "../../services/api";
import { useAuthContext } from "../../hooks/useAuthContext";
import { formatTicketDate } from "../../utils/dateUtils";

function TicketCard({ ticket, onOrderUpdated }) {
    const [refunding, setRefunding] = useState(false);
    const [refundError, setRefundError] = useState("");

    const { token } = useAuthContext();

    const {
        reference,
        totalPrice,
        isRefundable,
        session,
        tickets,
    } = ticket;

    const {
        date,
        time,
        hall,
        venue,
        format,
        language,
        movie,
    } = session;

    const handleRefund = async () => {
        if (!isRefundable || refunding) return;

        const confirmed = window.confirm(
            `Are you sure you want to refund order ${reference}? ` +
            "This action cannot be undone."
        );

        if (!confirmed) return;

        setRefundError("");
        setRefunding(true);

        try {
            const response = await refundOrder(reference, token);

            const updatedOrder = response.data ?? response;

            onOrderUpdated(updatedOrder);
        } catch (error) {
            if (error.status === 422) {
                setRefundError(
                    error.message ||
                    "This order cannot be refunded. It may already be refunded or within the 2-hour cutoff."
                );
            } else {
                setRefundError(
                    error.message || "Failed to refund this order. Please try again."
                );
            }
        } finally {
            setRefunding(false);
        }
    };

    return (
        <article className="ticket-card">
            <div
                className="ticket-poster card-poster bg-img"
                style={{
                    backgroundImage: `url(${movie.posterUrl})`,
                }}
            />

            <div className="ticket-content">
                <header className="ticket-header">
                    <h3 className="text-h2">{movie.title}</h3>

                    <span className="badge-red text-label-s badge-s">
                        {movie.ageRating.code}
                    </span>

                    <span className="text-body-m text-gray">
                        {movie.runtimeMinutes} min
                    </span>
                </header>

                <div className="ticket-details">
                    <div className="ticket-detail">
                        <div className="text-overline text-gray">
                            DATE
                        </div>

                        <time
                            className="text-body-m"
                            dateTime={`${date}T${time}`}
                        >
                            {formatTicketDate(date, time)}
                        </time>
                    </div>

                    <div className="ticket-detail">
                        <div className="text-overline text-gray">
                            VENUE
                        </div>

                        <div className="text-body-m">
                            {venue.name} · Hall {hall.name}
                        </div>
                    </div>

                    <div className="ticket-detail">
                        <div className="text-overline text-gray">
                            FORMAT
                        </div>

                        <div className="text-body-m">
                            {format.name} · {language.name}
                        </div>
                    </div>
                </div>

                <div className="ticket-seats">
                    <div className="text-overline text-gray">
                        SEATS
                    </div>

                    {tickets.map((item) => (
                        <span
                            key={item.id}
                            className="badge-seat text-label-s"
                        >
                            {item.seatCode} · {item.ticketType.name}
                        </span>
                    ))}
                </div>
            </div>

            <footer className="ticket-footer">
                <div className="ticket-order">
                    <div className="text-overline text-gray">
                        ORDER
                    </div>

                    <div className="text-label-m">
                        #{reference}
                    </div>
                </div>

                <div className="ticket-footer-content">
                    <div className="ticket-price">
                        <div className="text-label-m text-gray">
                            Total paid
                        </div>

                        <div className="text-h1">
                            ₾{totalPrice}
                        </div>
                    </div>

                    <button
                        type="button"
                        className="btn-gray text-button"
                        disabled={!isRefundable || refunding}
                        onClick={handleRefund}
                        title={
                            !isRefundable
                                ? "Refunds are only allowed until 2 hours before the session."
                                : undefined
                        }
                    >
                        {refunding ? "Refunding..." : "Refund"}
                    </button>
                </div>

                {refundError && (
                    <p className="refund-error" role="alert">
                        {refundError}
                    </p>
                )}
            </footer>
        </article>
    );
}

export default TicketCard;