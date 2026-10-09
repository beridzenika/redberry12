import { ReactComponent as TimerIcon } from "../../assets/icons/Timer.svg";

import "./MovieDetailPage.css"

function MovieDisplay({movie}) {
    return (
        <div 
            className="movie-container bg-img"
            style={{
                backgroundImage: `url(${movie.backdropUrl})`,
            }}
        >   
            <div className="movie-container-overlay"/>
            <div className="movie-display">
                <div 
                    className="movie-poster bg-img"
                    style={{
                        backgroundImage: `url(${movie.posterUrl})`,
                    }}
                />
                <div className="movie-display-content">
                    <span className="badge-red text-label-s hero-premiere">
                        NOW PLAYING
                    </span>
    
                    <h1 className="text-display hero-title">
                        {movie.title.toUpperCase()}
                    </h1>

                    <p className="description text-body-l">
                        {movie.synopsis || "No description available"}
                    </p>
    
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
                </div>
            </div>
        </div>
    )
};

export default MovieDisplay;