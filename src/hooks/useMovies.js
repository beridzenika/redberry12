import { useCallback } from "react";
import { useFetch } from "./useFetch";
import { fetchData } from "../services/api";

export function useMovies(endpoint) {
    const fetchMovies = useCallback(
        () => fetchData(`movies/${endpoint}`),
        [endpoint]
    );

    const { data, loading, error } = useFetch(fetchMovies);

    return {
        movies: data?.data ?? [],
        loading,
        error,
    };
}
