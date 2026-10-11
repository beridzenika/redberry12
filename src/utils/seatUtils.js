export function normalizeSeatKey(value) {
    return value == null
        ? ""
        : String(value).trim().toLowerCase();
}

export function getSeatKeys(seat) {
    return [
        seat?.id,
        seat?.seatId,
        seat?.seat_id,
        seat?.code,
        seat?.seatCode,
        seat?.seat_code,
    ]
        .filter((value) => value != null)
        .map(normalizeSeatKey);
}

export function getSeatLabel(seat) {
    return (
        seat?.code ??
        seat?.seatCode ??
        seat?.seat_code ??
        seat?.name ??
        seat?.id ??
        "Unknown seat"
    );
}

export function flattenSeats(seatMap) {
    if (!Array.isArray(seatMap?.sections)) {
        return [];
    }

    return seatMap.sections.flatMap((section) =>
        (section.rows ?? []).flatMap((row) => row.seats ?? [])
    );
}

export function markLostSeatsAsSold(seatMap, lostSeatKeys) {
    if (!Array.isArray(seatMap?.sections)) {
        return seatMap;
    }

    const lostSet = new Set(lostSeatKeys.map(normalizeSeatKey));

    return {
        ...seatMap,
        sections: seatMap.sections.map((section) => ({
            ...section,
            rows: section.rows.map((row) => ({
                ...row,
                seats: row.seats.map((seat) => {
                    const isLost = getSeatKeys(seat).some((key) =>
                        lostSet.has(key)
                    );

                    return isLost
                        ? {
                              ...seat,
                              state: "sold",
                              isMine: false,
                          }
                        : seat;
                }),
            })),
        })),
    };
}

export function findLostSeats(allSeats, lostCodes) {
    const lostSet = new Set(lostCodes.map(normalizeSeatKey));

    return allSeats.filter((seat) =>
        getSeatKeys(seat).some((key) => lostSet.has(key))
    );
}

export function removeLostSelections(
    currentSelections,
    allSeats,
    lostCodes
) {
    const lostSet = new Set(lostCodes.map(normalizeSeatKey));

    const lostIds = new Set(
        findLostSeats(allSeats, lostCodes).map((seat) =>
            String(seat.id)
        )
    );

    return Object.fromEntries(
        Object.entries(currentSelections).filter(([seatId]) => {
            if (lostIds.has(String(seatId))) {
                return false;
            }

            return !lostSet.has(normalizeSeatKey(seatId));
        })
    );
}