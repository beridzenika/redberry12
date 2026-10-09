import { useParams } from "react-router-dom";
import { useCallback } from "react";
import { fetchData } from "../services/api";
import { useFetch } from "../hooks/useFetch";

import MovieDisplay from "../components/MovieDetailPage/MovieDisplay";
import MovieSession from "../components/MovieSession/MovieSession";
import MovieDetails from "../components/MovieDetailPage/MovieDetails";

function MoviePage() {
    const  {id} = useParams();

    const getMovie = useCallback(() => {
        return fetchData(`movies/${id}`);
    }, [id]);

    const { data: movieData, loading, error } = useFetch(getMovie);

    if (loading) return <p>Loading...</p>;
    if (error) return <p className="text-body-s text-red">Error: {error}</p>;

    if (!movieData) {
        return <p>Movie not found.</p>;
    }

    return (
        <main>
            <MovieDisplay
                movie={movieData?.data}
            />
            <div className="movie-detail-layout">
                <MovieSession
                    movieId={id}
                />
                <MovieDetails
                    movie={movieData?.data}
                />
            </div>
        </main>
    );
};

export default MoviePage;