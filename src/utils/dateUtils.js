export function formatReleaseDate(date) {
    return new Date(date).toLocaleDateString("en-US", {
        day: "numeric",
        month: "long",
    }).toUpperCase();
}

export function formatPremiereDate(date) {
    return new Date(date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}
