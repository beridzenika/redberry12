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

export function formatTicketDate(date, time) {
    const formattedDate = new Date(`${date}T${time}`).toLocaleDateString(
        "en-US",
        {
            weekday: "short",
            day: "2-digit",
            month: "short",
        }
    );
    return `${formattedDate} · ${time}`;
}