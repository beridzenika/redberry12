import { useMovies } from "../../hooks/useMovies";
import { formatReleaseDate } from "../../utils/dateUtils";

import { ReactComponent as NotifyIcon } from "../../assets/icons/Notify.svg";

import "./Card.css";

function CardMedium() {
    const { movies: cards, loading, error } = useMovies("coming-soon");

    if (loading) return <p>Loading...</p>;
    if (error) return <p className="text-body-s text-red">Error: {error}</p>;

    return (
        <div className="card-row card-mid-row horizontal-scroll">
            {cards.map((card) => (
                <article className="card-medium card" key={card.id}>
                    <div
                        className="card-poster medium-poster bg-img"
                        style={{
                            backgroundImage: `url(${card.posterUrl})`,
                        }}
                    />

                    <div className="text-content">
                        <span className="text-label-s text-red">
                            IN CINEMAS {formatReleaseDate(card.releaseDate)}
                        </span>

                        <h3 className="text-h2">
                            {card.title}
                        </h3>

                        <span className="text-body-m text-gray">
                            {card.genres?.[0]?.name ?? "Unknown"} ·{" "}
                            {card.runtimeMinutes} Min
                        </span>

                        <span className="badge-red badge-s text-label-s">
                            {card.ageRating?.code}
                        </span>

                        <div className="card-footer">
                            <button
                                className="btn-border text-button"
                                type="button"
                            >
                                <NotifyIcon/>
                                Notify Me
                            </button>
                        </div>
                    </div>
                </article>
            ))}
        </div>
    );
};

export default CardMedium;