import { Link } from "react-router-dom";

import { formatPremiereDate } from "../../utils/dateUtils";

import { ReactComponent as TimerIcon } from "../../assets/icons/Timer.svg";
import { ReactComponent as TicketIcon } from "../../assets/icons/Ticket.svg";

function HeroSlide({ movie, className }) {
    
    return (
        <div className={`hero-slide ${className}`}>
            <div
                className="hero-background bg-img"
                style={{
                    backgroundImage: `url(${movie.backdropUrl})`,
                }}
                aria-hidden="true"
            />

            <div className="hero-overlay" aria-hidden="true" />

            <div className="hero-content">
                <span className="badge-red text-label-s hero-premiere">
                    {movie.isComingSoon
                        ? "COMING SOON"
                        : `PREMIERE · ${formatPremiereDate(movie.releaseDate)}`}
                </span>

                <h1 className="text-display hero-title">
                    {movie.title.toUpperCase()}
                </h1>

                <div className="badge-holder" aria-label="Movie information">
                    <span className="badge-red text-label-s">
                        {movie.ageRating.code}
                    </span>

                    <span className="badge-gray text-label-s">
                        <TimerIcon aria-hidden="true" />
                        {movie.runtimeMinutes} Min
                    </span>

                    {movie.formats.map((format) => (
                        <span
                            key={format.id}
                            className="badge-gray text-label-s"
                        >
                            {format.name}
                        </span>
                    ))}
                </div>

                <p className="description text-body-l">
                    {movie.synopsis || "No description available"}
                </p>

                <div className="button-holder">
                    <Link
                        className="btn-red text-button link-button"
                        to={`/movie/${movie.slug}`}
                    >
                        <TicketIcon aria-hidden="true" />
                        Buy tickets
                    </Link>

                    <Link
                        className="btn-gray text-button link-button"
                        to="/sessions"
                    >
                        All sessions
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default HeroSlide;