export const getInitialProfileValues = (user) => ({
    fullName: user?.fullName || "",
    email: user?.email || "",
    mobileNumber: user?.mobileNumber || "",
});

export const sanitizeMobileNumber = (value = "") =>
    value.replace(/\D/g, "").replace(/^995(?=\d{9}$)/, "");

export const validateFullName = (value = "") => {
    const name = value.trim();

    if (!name) return "Name is required";
    if (name.length < 3) return "Name must be at least 3 characters";
    if (name.length > 50) return "Name must not exceed 50 characters";

    return "";
};

export const validateGeorgianMobileNumber = (value = "") => {
    const mobileNumber = sanitizeMobileNumber(value.trim());

    if (!mobileNumber) return "Mobile number is required";
    if (!/^\d+$/.test(mobileNumber)) {
        return "Please enter a valid Georgian mobile number";
    }
    if (!mobileNumber.startsWith("5")) {
        return "Georgian mobile numbers must start with 5";
    }
    if (mobileNumber.length !== 9) {
        return "Mobile number must be exactly 9 digits";
    }

    return "";
};