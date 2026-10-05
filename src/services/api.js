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
    if (!response.ok) 
        throw new Error('Failed to search');
    return response.json();
};

export const loginUser = async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email,
            password,
        }),
    });

    const data = await response.json();

    if (!response.ok) {
        const error = new Error(
            data.message || "Login failed"
        );
        error.status = response.status;
        error.errors = data.errors || {};

        throw error;
    }
    return data;
};



export const registerUser = async (
    avatar,
    username,
    email,
    password,
    confirmPassword
) => {
    const formData = new FormData();

    if (avatar) {
        formData.append("avatar", avatar);
    }

    formData.append("username", username);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("password_confirmation", confirmPassword);

    const response = await fetch(`${API_BASE_URL}/register`, {
        method: "POST",
        body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
        const error = new Error(
            data.message || "Registration failed"
        );

        error.status = response.status;
        error.errors = data.errors || {};

        throw error;
    }

    return data;
};
