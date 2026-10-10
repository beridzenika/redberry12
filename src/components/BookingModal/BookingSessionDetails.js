import { formatSessionDate } from "../../utils/dateUtils";

function BookingSessionDetails({
    session,
    loading,
    error,
}) {
    if (loading && !session) {
        return (
            <header className="booking-header">
                <p role="status">
                    Loading session details...
                </p>
            </header>
        );
    }

    if (error && !session) {
        return (
            <header className="booking-header">
                <p role="alert" className="text-label-s text-red">
                    Could not load session details.
                </p>
            </header>
        );
    }

    return (
        <header className="booking-header">
            <div className="booking-header-content">
                <h2 className="text-h2">
                    {session?.movie?.title ?? "Movie session"}
                </h2>

                <p className="text-body-s text-gray">
                    {[
                        session?.venue?.name ??
                            session?.hall?.venue?.name,

                        session?.hall?.name
                            ? `Hall ${session.hall.name}`
                            : null,

                        formatSessionDate(session?.date),
                        session?.time,
                        session?.format?.name,
                        session?.language?.name,
                    ]
                        .filter(Boolean)
                        .join(" · ")}
                </p>
            </div>

            <div className="booking-timer">
                <span className="text-label-s text-gray">
                    SEATS HELD
                </span>

                <span className="text-button">
                    —
                </span>
            </div>
        </header>
    );
}

export default BookingSessionDetails;