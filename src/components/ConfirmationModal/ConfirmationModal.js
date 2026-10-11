import { Link } from "react-router-dom";
import { useModal } from "../../hooks/useModal";

import ModalOverlay from "../Modal/ModalOverlay";

import { ReactComponent as CheckIcon } from "../../assets/icons/Check.svg";

import "./ConfirmationModal.css";

function ConfirmationModal() {
    const {
        modals,
        closeModal,
        confirmationData,
    } = useModal();

    const isOpen = Boolean(modals.confirmation);

    const order =
        confirmationData?.data ??
        confirmationData?.order?.data ??
        confirmationData?.order ??
        confirmationData;

    const session = order?.session;
    const movie = session?.movie;
    const tickets = order?.tickets ?? [];

    const orderReference = order?.reference ?? order?.id ?? "—";
    const formatDateTime = (date, time) => {
        if (!date) return time ?? "Time unavailable";

        const formattedDate = new Date(`${date}T00:00:00`)
            .toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                weekday: "short",
            });

        return `${formattedDate} · ${time ?? ""}`.trim();
    };

    const seatCodes = tickets
        .map((ticket) => ticket.seatCode)
        .filter(Boolean);

    const ticketCounts = tickets.reduce((counts, ticket) => {
        const name = ticket.ticketType?.name ?? "Ticket";
        counts[name] = (counts[name] ?? 0) + 1;
        return counts;
    }, {});

    const ticketSummary = Object.entries(ticketCounts)
        .map(([name, count]) => `${count} x ${name}`)
        .join(", ");

    const totalPaid = Number(order?.totalPrice);

    function handleClose() {
        closeModal("confirmation");
    }

    if (!isOpen) return null;

    return (
        <ModalOverlay
            open={isOpen}
            onClose={handleClose}
        >
            <article
                className="confirmation-modal"
                aria-label="Booking confirmation"
                role="dialog"
                aria-modal="true"
                aria-labelledby="confirmation-title"
            >
                <div className="confirmation-content">
                    <header className="confirmation-header">
                        <div
                            className="confirm-icon-holder"
                            aria-hidden="true"
                        >
                            <CheckIcon />
                        </div>

                        <h1
                            className="text-h1"
                            id="confirmation-title"
                        >
                            Booking confirmed!
                        </h1>

                        <p className="text-body-m text-gray">
                            Your tickets are ready. We've sent the confirmation to your email.
                        </p>

                        <p className="badge-gray confirm-badge">
                            ORDER {orderReference}
                        </p>
                    </header>

                    <section
                        className="confirmation-details-holder"
                        aria-label="Booking details"
                    >
                        <header className="confirm-details-header">
                            <div
                                className="confirm-poster bg-img"
                                role="img"
                                aria-label={`${movie?.title ?? "Movie"} poster`}
                                style={
                                    movie?.posterUrl
                                        ? {
                                            backgroundImage: `url("${movie.posterUrl}")`,
                                        }
                                        : undefined
                                }
                            />

                            <div className="confirm-detail-title">
                                <h2 className="text-button">
                                    {movie?.title ?? "Movie title unavailable"}
                                </h2>

                                <p className="text-body-s text-gray">
                                    {[
                                        session?.venue?.name,
                                        session?.hall?.name
                                            ? `Hall ${session.hall.name}`
                                            : null,
                                        formatDateTime(
                                            session?.date,
                                            session?.time
                                        ),
                                    ]
                                        .filter(Boolean)
                                        .join(" · ")}
                                </p>
                            </div>
                        </header>

                        <hr className="page-line" />

                        <dl className="confirmation-summary">
                            <div className="confirm-row">
                                <dt className="text-body-s text-gray">
                                    Seats
                                </dt>

                                <dd className="text-label-s">
                                    {seatCodes.length
                                        ? seatCodes.join(", ")
                                        : "—"}
                                </dd>
                            </div>

                            <div className="confirm-row">
                                <dt className="text-body-s text-gray">
                                    Tickets
                                </dt>

                                <dd className="text-label-s">
                                    {ticketSummary || "—"}
                                </dd>
                            </div>
                        </dl>

                        <hr className="page-line" />

                        <footer className="booking-total-holder">
                            <span className="text-body-s text-gray">
                                TOTAL PAID
                            </span>

                            <p className="text-h3">
                                {Number.isFinite(totalPaid)
                                    ? `₾ ${totalPaid}`
                                    : "—"}
                            </p>
                        </footer>
                    </section>
                </div>

                <nav
                    className="confirmation-actions"
                    aria-label="Confirmation actions"
                >
                    <Link
                        className="btn-red text-button link-button"
                        to="/tickets"
                        onClick={handleClose}
                    >
                        View my tickets
                    </Link>

                    <Link
                        className="btn-gray text-button link-button"
                        to="/"
                        onClick={handleClose}
                    >
                        Back to home
                    </Link>
                </nav>
            </article>
        </ModalOverlay>
    );
}

export default ConfirmationModal;