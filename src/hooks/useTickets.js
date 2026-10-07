import { useCallback } from "react";
import { useFetch } from "./useFetch";
import { fetchAuthenticatedData } from "../services/api";

export function useTickets(filter, token) {
    const fetchTickets = useCallback(
        () => fetchAuthenticatedData(
            `tickets?filter=${filter}`,
            token
        ),
        [filter, token]
    );

    const { data, loading, error } = useFetch(fetchTickets);

    return {
        tickets: data?.data ?? [],
        loading,
        error,
    };
}