import { useState, useEffect } from "react";

export const useFetch = (fetchFunction) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true;
        
        const getData = async() => {
            try {
                setLoading(true);
                const result = await fetchFunction();
                if(isMounted) {
                    setData(result);
                    setError(null);
                }
            } catch (err) {
                if(isMounted) {
                    setError(err.message);
                    setData(null);
                }
            } finally {
                if(isMounted) {
                    setLoading(false);
                }
            }
        };
        getData();

        return () => {
            isMounted = false;
        };
    }, [fetchFunction]);

    return {data, loading, error};
}