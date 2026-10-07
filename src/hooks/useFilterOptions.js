import { useCallback } from "react";

import { fetchData } from "../services/api";
import { useFetch } from "./useFetch";

export const useFilterOptions = () => {
    const fetchOptions = useCallback(
        () => fetchData("filter-options"),
        []
    );

    const result = useFetch(fetchOptions);

    return {
        ...result,
        data: result.data?.data ?? null,
    };
};