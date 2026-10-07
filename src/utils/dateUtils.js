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

export function getNextDays(count = 7, startDate = new Date()) {
    return Array.from({ length: count }, (_, index) => {
        const date = new Date(startDate);
        date.setDate(date.getDate() + index);

        return {
            value: formatDateValue(date),
            weekday: new Intl.DateTimeFormat("en-US", {
                weekday: "short",
            }).format(date),
            day: new Intl.DateTimeFormat("en-US", {
                day: "numeric",
            }).format(date),
        };
    });
}

function formatDateValue(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}
