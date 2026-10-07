import { useMovies } from "../../hooks/useMovies";

import "./Card.css";

function CardBig() {
    const { movies: cards, loading, error } = useMovies("now-playing");

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="card-row card-big-row">
            {cards.map((card) => (
                <article className="card-big card" key={card.id}>
                    <div
                        className="card-poster big-poster"
                        style={{
                            backgroundImage: `url(${card.posterUrl})`,
                        }}
                    />

                    <div className="text-content">
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

                        <p className="text-body-m text-gray description">
                            {card.synopsis}
                        </p>

                        <div className="card-footer">
                            <span className="text-button">
                                From ₾ {card.fromPrice}
                            </span>

                            <button
                                className="btn-red text-button"
                                type="button"
                            >
                                Buy Ticket
                            </button>
                        </div>
                    </div>
                </article>
            ))}
        </div>
    );
}

export default CardBig;
