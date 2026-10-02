const API_BASE_URL = 'https://api.kinoxii.redberryinternship.ge/api';

export const fetchData = async (url) => {
    const response = await fetch(`${API_BASE_URL}/${url}`);
    return response.json();
}