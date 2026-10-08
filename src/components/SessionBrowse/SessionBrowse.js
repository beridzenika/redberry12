import { ReactComponent as TicketIcon } from "../../assets/icons/Ticket.svg";

import "./SessionBrowse.css";

function SessionBrowse({ data, loading, error }) {
    if (loading) {
        return <div>Loading sessions...</div>;
    }

    if (error) {
        return <div>Failed to load sessions: {error}</div>;
    }

    if (!data) {
        return null;
    }

    const movies = data.data ?? [];

    if (movies.length === 0) {
        return <div>No sessions found.</div>;
    }

    return (
        <div className="session-browse">
            {movies.map((group, index) => (
                <>
                <section
                        className="session-section"
                        key={group.movie.id}
                    >
                        <div className="session-movie">
                            <div
                                className="session-movie-poster"
                                style={{
                                    backgroundImage: `url(${group.movie.posterUrl})`,
                                }}
                                aria-hidden="true"
                            />

                            <div className="session-movie-content">
                                <div className="session-movie-header">
                                    <h3 className="text-h2">
                                        {group.movie.title}
                                    </h3>

                                    <span className="badge-red text-label-s badge-s">
                                        {group.movie.ageRating.code}
                                    </span>
                                </div>

                                <span className="text-body-m text-gray">
                                    {group.movie.runtimeMinutes} min
                                </span>
                            </div>
                        </div>

                        <div className="session-showtimes horizontal-scroll">
                            {group.sessions.map((session) => {
                                const isSoldOut =
                                    session.isSoldOut || session.seatsLeft === 0;

                                const seatsAreLow =
                                    !isSoldOut && session.seatsLeft < 10;

                                return (
                                    <div
                                        key={session.id}
                                        className={`session-showtime${
                                            isSoldOut
                                                ? " session-showtime-sold"
                                                : ""
                                        }`}
                                        aria-disabled={isSoldOut}
                                    >
                                        <div className="showtime-content">
                                            <span className="text-h3">
                                                {session.time}
                                            </span>

                                            <span className="text-label-s badge-gray badge-m">
                                                {session.format.name}
                                            </span>
                                        </div>

                                        <div className="showtime-content">
                                            <span className="text-body-s text-gray">
                                                {session.language.name}
                                            </span>

                                            <span
                                                className={`text-body-s ticket-left${
                                                    seatsAreLow
                                                        ? " ticket-left-low"
                                                        : ""
                                                }`}
                                            >
                                                {isSoldOut ? (
                                                    <span>Sold out</span>
                                                ) : (
                                                    <>
                                                        <TicketIcon
                                                            aria-hidden="true"
                                                        />
                                                        <span>
                                                            {session.seatsLeft} left
                                                        </span>
                                                    </>
                                                )}
                                            </span>
                                        </div>

                                        <div className="showtime-content">
                                            <span className="text-label-s">
                                                {session.venue.name}
                                                {" · Hall "}
                                                {session.hall.name}
                                            </span>

                                            <span className="text-button">
                                                ₾ {session.price}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </section>

                    {index < movies.length - 1 && <hr className="page-line" />}
                </>
            ))}
        </div>
    );
}

export default SessionBrowse;