const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const fetchData = async (url) => {
    const response = await fetch(`${API_BASE_URL}/${url}`);
    return response.json();
}

export const searchFilms = async (query) => {
  if (!query.trim()) return { data: [] };
  
  const response = await fetch(
    `${API_BASE_URL}/search?q=${encodeURIComponent(query)}`
  );
  if (!response.ok) throw new Error('Failed to search');
  return response.json();
};