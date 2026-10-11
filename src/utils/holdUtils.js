export function getHoldExpiration(response, holdMinutes = 8) {
    const data = response?.data ?? response;

    const expiresAt =
        data?.expiresAt ??
        data?.expires_at ??
        data?.expirationTime ??
        data?.expiration_time ??
        data?.hold?.expiresAt;

    if (expiresAt != null) {
        if (
            typeof expiresAt === "number" ||
            /^\d+$/.test(String(expiresAt))
        ) {
            const value = Number(expiresAt);

            if (Number.isFinite(value)) {
                return value < 1e12 ? value * 1000 : value;
            }
        }

        const timestamp = Date.parse(expiresAt);

        if (Number.isFinite(timestamp)) {
            return timestamp;
        }
    }

    const expiresIn =
        data?.expiresInSeconds ??
        data?.expires_in_seconds ??
        data?.expiresIn ??
        data?.expires_in;

    if (
        expiresIn != null &&
        Number.isFinite(Number(expiresIn))
    ) {
        return Date.now() + Number(expiresIn) * 1000;
    }

    return Date.now() + holdMinutes * 60 * 1000;
}

export function getErrorStatus(error) {
    return (
        error?.status ??
        error?.statusCode ??
        error?.response?.status ??
        error?.response?.statusCode
    );
}

export function getErrorPayload(error) {
    const data =
        error?.response?.data ??
        error?.data ??
        error?.response?.body ??
        {};

    if (typeof data === "string") {
        try {
            return JSON.parse(data);
        } catch {
            return { message: data };
        }
    }

    return data;
}

export function getLostSeatCodes(error) {
    const data = getErrorPayload(error);

    const codes =
        data?.lostSeatCodes ??
        data?.lost_seat_codes ??
        data?.unavailableSeatCodes ??
        data?.unavailable_seat_codes ??
        data?.conflictedSeatCodes ??
        data?.conflicted_seat_codes ??
        data?.seatCodes ??
        data?.seat_codes ??
        data?.seats ??
        data?.details?.seats ??
        [];

    if (!Array.isArray(codes)) {
        return [];
    }

    return codes
        .map((seat) => {
            if (
                typeof seat === "string" ||
                typeof seat === "number"
            ) {
                return String(seat);
            }

            return (
                seat?.code ??
                seat?.seatCode ??
                seat?.seat_code ??
                seat?.seatId ??
                seat?.seat_id ??
                seat?.id ??
                null
            );
        })
        .filter((code) => code != null)
        .map(String);
}

export function formatCountdown(milliseconds) {
    const totalSeconds = Math.max(
        0,
        Math.ceil(milliseconds / 1000)
    );

    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(
        seconds
    ).padStart(2, "0")}`;
}