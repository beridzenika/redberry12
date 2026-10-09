import { useParams } from "react-router-dom";
import { useCallback } from "react";
import { fetchData } from "../services/api";
import { useFetch } from "../hooks/useFetch";
import { useAuthContext } from "../hooks/useAuthContext";

import MovieDisplay from "../components/MovieDetailPage/MovieDisplay";
import MovieSession from "../components/MovieSession/MovieSession";
import MovieDetails from "../components/MovieDetailPage/MovieDetails";


function calculateAge(dateOfBirth) {
    if (!dateOfBirth) {
        return null;
    }

    const birthDate = new Date(dateOfBirth);

    if (Number.isNaN(birthDate.getTime())) {
        return null;
    }

    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();

    const hasHadBirthdayThisYear =
        today.getMonth() > birthDate.getMonth() ||
        (
            today.getMonth() === birthDate.getMonth() &&
            today.getDate() >= birthDate.getDate()
        );

    if (!hasHadBirthdayThisYear) {
        age--;
    }

    return age;
}


function MoviePage() {
    const { id } = useParams();
    const { user } = useAuthContext();

    const getMovie = useCallback(() => {
        return fetchData(`movies/${id}`);
    }, [id]);

    const {
        data: movieData,
        loading,
        error
    } = useFetch(getMovie);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return (
            <p className="text-body-s text-red">
                Error: {error}
            </p>
        );
    }

    if (!movieData?.data) {
        return <p>Movie not found.</p>;
    }

    const movie = movieData.data;

    const userAge = calculateAge(user?.dateOfBirth);
    const minAge = Number(movie.ageRating?.minAge);

    const isAgeRestricted =
        Boolean(user) &&
        userAge !== null &&
        Number.isFinite(minAge) &&
        userAge < minAge;

    return (
        <main>
            <MovieDisplay
                movie={movie}
            />

            <div className="movie-detail-layout">
                <MovieSession
                    movieId={id}
                    isAgeRestricted={isAgeRestricted}
                    minAge={minAge}
                />

                <MovieDetails
                    movie={movie}
                />
            </div>
        </main>
    );
}

export default MoviePage;