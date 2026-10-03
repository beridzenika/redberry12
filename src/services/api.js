const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const fetchData = async (url) => {
    const response = await fetch(`${API_BASE_URL}/${url}`);
    return response.json();
}