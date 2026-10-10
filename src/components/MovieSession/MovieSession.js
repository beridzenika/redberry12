
import { useState, useCallback, useMemo } from "react";
import { fetchData } from "../../services/api";
import { useFetch } from "../../hooks/useFetch";
import { useBookingAccess } from "../../hooks/useBookingAccess";

import { getToday, getNextDays } from "../../utils/dateUtils";

import { ReactComponent as TicketIcon } from "../../assets/icons/Ticket.svg";

import "./MovieSession.css";

const DATE_COUNT = 7;

function groupSessionsByHall(sessions) {
    const halls = new Map();

    for (const session of sessions) {
        const hallId = session.hall.id;

        if (!halls.has(hallId)) {
            halls.set(hallId, {
                id: hallId,
                name: session.hall.name,
                sessions: [],
            });
        }

        halls.get(hallId).sessions.push(session);
    }

    return Array.from(halls.values()).map((hall) => ({
        ...hall,
        sessions: [...hall.sessions].sort((a, b) =>
            a.time.localeCompare(b.time)
        ),
    }));
}

function SessionTicket({ session, requestBooking }) {
    return (
        <article
            className={`screening-ticket ${
                session.isSoldOut ? "screening-ticket-sold-out" : ""
            }`}
            onClick={() => requestBooking(session.id)}
            aria-label={`${session.time} screening, ${session.format.name}, ${session.language.name}`}
        >   
            <div className="screening-ticket-main">
                <time
                    className="text-h2"
                    dateTime={session.startsAt}
                >
                    {session.time}
                </time>

                <div className="screening-ticket-details">
                    <span className="text-body-s text-gray">
                        {session.language.code}
                    </span>
                    <span className="screening-badge badge-gray text-label-s">
                        {session.format.name}
                    </span>
                </div>
            </div>

            <div className="screening-ticket-aside">
                <span className="text-h3 text-red">
                    ₾ {session.price}
                </span>

                <div className="ticket-left">
                    <TicketIcon aria-hidden="true" />

                    <span className="text-body-s text-gray">
                        {session.isSoldOut
                            ? "Sold out"
                            : `${session.seatsLeft} left`}
                    </span>
                </div>
            </div>
        </article>
    );
}

function MovieSession({ movieId, isAgeRestricted, minAge }) {
    const [date, setDate] = useState(getToday);

    const { requestBooking } = useBookingAccess();

    const getSessions = useCallback(() => {
        return fetchData(
            `movies/${movieId}/sessions?date=${date}`
        );
    }, [movieId, date]);

    const {
        data: sessionsData,
        loading,
        error,
    } = useFetch(getSessions);

    const dates = getNextDays(DATE_COUNT);

    const venues = useMemo(
        () =>
            (sessionsData?.data ?? []).map((venueSession) => ({
                ...venueSession,
                halls: groupSessionsByHall(
                    venueSession.sessions ?? []
                ),
            })),
        [sessionsData?.data]
    );

    if (isAgeRestricted) {
        return (
            <section className="movie-session movie-session-disabled">
                <p className="movie-session-restriction">
                    This film is rated {minAge}+. You cannot buy tickets
                    for it with this account.
                </p>
            </section>
        );
    }

    return (
        <section
            className="movie-screenings"
            aria-labelledby="movie-screenings-heading"
        >
            <header className="movie-screenings-header">
                <h2
                    id="movie-screenings-heading"
                    className="text-h2"
                >
                    Sessions
                </h2>

                <nav
                    className="screening-date-nav"
                    aria-label="Choose screening date"
                >
                    <div className="screening-date-list horizontal-scroll">
                        {dates.map((item) => {
                            const isSelected = date === item.value;
                            return (
                                <button
                                    key={item.value}
                                    type="button"
                                    className={`screening-date ${
                                        isSelected
                                            ? "screening-date-active"
                                            : ""
                                    }`}
                                    aria-pressed={isSelected}
                                    aria-label={`${item.weekday}, ${item.day}`}
                                    onClick={() => setDate(item.value)}
                                >
                                    <span className="text-label-s">
                                        {item.weekday}
                                    </span>

                                    <span className="text-h3">
                                        {item.day}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </nav>
            </header>

            {loading ? (
                <p role="status" aria-live="polite">
                    Loading sessions...
                </p>
            ) : error ? (
                <p 
                    role="alert" 
                    className="text-label-s text-red"
                >
                    Failed to load sessions. Please try again.
                </p>
            ) : venues.length === 0 ? (
                <p className="text-label-s text-red">
                    No sessions available for this date.
                </p>
            ) : (
                <div className="venue-list">
                    {venues.map((venue) => (
                        <section
                            className="venue-section"
                            key={venue.venue.id}
                            aria-labelledby={`venue-heading-${venue.venue.id}`}
                        >
                            <h3
                                id={`venue-heading-${venue.venue.id}`}
                                className="text-button venue-section__title"
                            >
                                {venue.venue.name}
                            </h3>

                            {venue.halls.length === 0 ? (
                                <p>
                                    No sessions available at this venue.
                                </p>
                            ) : (
                                <div className="hall-row horizontal-scroll">
                                    {venue.halls.map((hall) => (
                                        <section
                                            className="hall-section"
                                            key={hall.id}
                                            aria-labelledby={`hall-heading-${venue.venue.id}-${hall.id}`}
                                        >
                                            <h4
                                                id={`hall-heading-${venue.venue.id}-${hall.id}`}
                                                className="text-label-s hall-section__title"
                                            >
                                                Hall {hall.name}
                                            </h4>
                                            <div
                                                className="screening-ticket-list"
                                                aria-label={`Screenings in Hall ${hall.name}`}
                                            >
                                                {hall.sessions.map((session) => (
                                                    <SessionTicket
                                                        key={session.id}
                                                        session={session}
                                                        requestBooking={requestBooking}
                                                    />
                                                ))}
                                            </div>
                                        </section>
                                    ))}
                                </div>
                            )}
                        </section>
                    ))}
                </div>
            )}
        </section>
    );
}

export default MovieSession;