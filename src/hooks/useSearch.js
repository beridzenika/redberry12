import { useState, useCallback, useRef } from 'react';
import { searchFilms } from '../services/api';

function useSearch() {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [query, setQuery] = useState('');
    const debounceTimer = useRef(null);

    const handleSearch = useCallback((searchQuery) => {
        setQuery(searchQuery);

        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current);
        }

        if(!searchQuery.trim()) {
            setResults([]);
            setError(null);
            return;
        }

        debounceTimer.current = setTimeout(async () => {
            try {
                setLoading(true);
                setError(false);
                const data = await searchFilms(searchQuery);
                setResults(data.data || []);
            } catch (err) {
                setError(err.message);
                setResults([]);
            } finally {
                setLoading(false);
            }
        }, 300);
    }, []);

    return {results, loading, error, query, handleSearch, setQuery};
};

export default useSearch;