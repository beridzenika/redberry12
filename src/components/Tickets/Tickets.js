import { useState } from "react";
import "./Tickets.css";
import TicketCard from "./TicketCard";
import { useTickets } from "../../hooks/useTickets";
import { useAuthContext } from "../../hooks/useAuthContext";

function Tickets() {
    const [filter, setFilter] = useState("upcoming");
    const [updatedOrders, setUpdatedOrders] = useState({});

    const { token } = useAuthContext();

    const {
        tickets: upcomingTickets,
        loading: upcomingLoading,
        error: upcomingError,
    } = useTickets("upcoming", token);

    const {
        tickets: pastTickets,
        loading: pastLoading,
        error: pastError,
    } = useTickets("past", token);

    const handleOrderUpdated = (updatedOrder) => {
        setUpdatedOrders((previous) => ({
            ...previous,
            [updatedOrder.reference]: updatedOrder,
        }));
    };

    const allTickets = [
        ...upcomingTickets,
        ...pastTickets,
    ];

    const uniqueTickets = [
        ...new Map(
            allTickets.map((ticket) => {
                const updatedTicket =
                    updatedOrders[ticket.reference] ?? ticket;

                return [
                    ticket.reference,
                    updatedTicket,
                ];
            })
        ).values(),
    ];

    const upcomingList = uniqueTickets.filter(
        (ticket) =>
            !ticket.refundedAt &&
            ticket.isUpcoming
    );

    const pastList = uniqueTickets.filter(
        (ticket) =>
            Boolean(ticket.refundedAt) ||
            !ticket.isUpcoming
    );

    const tickets = filter === "upcoming"
        ? upcomingList
        : pastList;

    const loading = filter === "upcoming"
        ? upcomingLoading
        : pastLoading;

    const error = filter === "upcoming"
        ? upcomingError
        : pastError;

    if (loading) {
        return (
            <section
                className="tickets"
                aria-labelledby="tickets-title"
            >
                <div className="tickets-state">
                    <p>Loading tickets...</p>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section
                className="tickets"
                aria-labelledby="tickets-title"
            >
                <div className="tickets-state">
                    <p role="alert">
                        Error: {error}
                    </p>
                </div>
            </section>
        );
    }

    return (
        <section
            className="tickets"
            aria-labelledby="tickets-title"
        >
            <header className="tickets-header">
                <div
                    className="tickets-filter"
                    role="group"
                    aria-label="Ticket history"
                >
                    <button
                        type="button"
                        className={`tickets-filter-button ${
                            filter === "upcoming" ? "active" : ""
                        }`}
                        onClick={() => setFilter("upcoming")}
                        aria-pressed={filter === "upcoming"}
                    >
                        <span className="text-label-m">
                            Upcoming
                        </span>

                        <span className="tickets-filter-count text-label-m">
                            {upcomingList.length}
                        </span>
                    </button>

                    <button
                        type="button"
                        className={`tickets-filter-button ${
                            filter === "past" ? "active" : ""
                        }`}
                        onClick={() => setFilter("past")}
                        aria-pressed={filter === "past"}
                    >
                        <span className="text-label-m">
                            Past
                        </span>

                        <span className="tickets-filter-count text-label-m">
                            {pastList.length}
                        </span>
                    </button>
                </div>
            </header>

            <div className="tickets-list">
                {tickets.length === 0 ? (
                    <div className="tickets-state">
                        <p className="text-label-s text-red">
                            No {filter} tickets found.
                        </p>
                    </div>
                ) : (
                    <div className="ticket-list">
                        {tickets.map((ticket) => (
                            <TicketCard
                                key={ticket.reference}
                                ticket={ticket}
                                onOrderUpdated={handleOrderUpdated}
                            />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}

export default Tickets;