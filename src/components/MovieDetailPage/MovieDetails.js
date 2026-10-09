import { formatFullDate } from "../../utils/dateUtils";

import "./MovieDetailPage.css"

function MovieDetails({movie}) {
    return (
        <div className="movie-details">
            <h3>Details</h3>

            <div className="detail-section">
                <div className="text-label-s text-gray">
                    DIRECTOR
                </div>
                <div className="text-label-m">
                    {movie.director}
                </div>
            </div>

            <div className="detail-section">
                <div className="text-label-s text-gray">
                    MAIN CAST
                </div>
                <div className="text-label-m">
                    {movie.cast}
                </div>
            </div>
            <div className="detail-section">
                <div className="text-label-s text-gray">
                    DURATION
                </div>
                <div className="text-label-m">
                    {movie.runtimeMinutes}{" "}
                    minutes
                </div>
            </div>
            <div className="detail-section">
                <div className="text-label-s text-gray">
                    RELEASE DATE
                </div>
                <div className="text-label-m">
                    {formatFullDate(movie.releaseDate)}
                </div>
            </div>
            <div className="detail-section">
                <div className="text-label-s text-gray">
                    FORMATS
                </div>
                <div className="text-label-m">
                    {movie.formats.map((format) => (
                        <>
                            {format.name}
                            {", "}
                        </>
                    ))}
                </div>
            </div>
            <div className="detail-section">
                <div className="text-label-s text-gray">
                    FROM
                </div>
                <div className="text-label-m">
                    {"₾ "}
                    {movie.fromPrice}
                </div>
            </div>

            <div className="rating-note detail-section">
                <div className="text-label-s">
                    RATING NOTE
                </div>
                <div className="rating-note-content">
                    <div className="text-label-s">
                        {movie.ageRating.code}
                    </div>
                    <div className="text-body-s">
                        {movie.ageRating.description}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MovieDetails;