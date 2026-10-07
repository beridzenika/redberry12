const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const fetchData = async (url) => {
    const response = await fetch(`${API_BASE_URL}/${url}`);

    if (!response.ok) {
        throw new Error("Failed to fetch data");
    }

    return response.json();
};

export const searchFilms = async (query) => {
    if (!query.trim()) return { data: [] };
    
    const response = await fetch(
        `${API_BASE_URL}/search?q=${encodeURIComponent(query)}`
    );
    if (!response.ok) 
        throw new Error('Failed to search');
    return response.json();
};

// authentication

const apiRequest = async (endpoint, options = {}) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);

    const data = await response.json();

    if (!response.ok) {
        const error = new Error(
            data.message || "Something went wrong"
        );

        error.status = response.status;
        error.errors = data.errors || {};

        throw error;
    }

    return data;
};

export const loginUser = (email, password) =>
    apiRequest("/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email,
            password,
        }),
    });

export const registerUser = ({
    avatar,
    username,
    email,
    password,
    confirmPassword
}) => {
    const formData = new FormData();

    if (avatar) {
        formData.append("avatar", avatar);
    }

    formData.append("username", username);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("password_confirmation", confirmPassword);

    return apiRequest("/register", {
        method: "POST",
        body: formData,
    });
};

// authorised

export const updateProfile = ({
    fullName,
    mobileNumber,
    dateOfBirth,
    preferredVenueId,
    token
}) => {
    const formData = new FormData();

    formData.append("fullName", fullName);
    formData.append("mobileNumber", mobileNumber);
    formData.append("dateOfBirth", dateOfBirth);

    formData.append(
        "preferredVenueId",
        preferredVenueId ?? ""
    );

    return apiRequest("/profile", {
        method: "PUT",
        headers: {
            Accept: "*/*",
            Authorization: `Bearer ${token}`,
        },
        body: formData,
    });
};

export const fetchAuthenticatedData = (url, token) => {
    return apiRequest(`/${url}`, {
        method: "GET",
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
        },
    });
};
