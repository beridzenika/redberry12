import { useCallback, useEffect, useRef, useState } from "react";

import { createSessionHold } from "../services/api";

import {
    formatCountdown,
    getErrorPayload,
    getErrorStatus,
    getHoldExpiration,
    getLostSeatCodes,
} from "../utils/holdUtils";

import {
    findLostSeats,
    getSeatLabel,
    normalizeSeatKey,
    removeLostSelections,
} from "../utils/seatUtils";

function getHoldId(response) {
    const result = response?.data ?? response;

    return (
        result?.hold_id ??
        result?.holdId ??
        result?.hold?.id ??
        result?.data?.hold_id ??
        result?.data?.holdId ??
        result?.data?.hold?.id ??
        result?.id ??
        null
    );
}

export function useSeatHold({
    sessionId,
    token,
    holdMinutes,
    selectedSeats,
    allSeats,
    setSelectedSeatTypes,
    setLostSeatKeys,
    refreshSeats,
    onSuccess,
}) {
    const [holdLoading, setHoldLoading] = useState(false);
    const [holdError, setHoldError] = useState("");
    const [holdExpiresAt, setHoldExpiresAt] = useState(null);
    const [remainingMs, setRemainingMs] = useState(null);
    const [holdId, setHoldId] = useState(null);

    const requestRef = useRef(false);

    useEffect(() => {
        if (!holdExpiresAt) return undefined;

        const updateTimer = () => {
            setRemainingMs(
                Math.max(0, holdExpiresAt - Date.now())
            );
        };

        updateTimer();

        const interval = setInterval(updateTimer, 1000);

        return () => clearInterval(interval);
    }, [holdExpiresAt]);

    const createHold = useCallback(async () => {
        if (requestRef.current || holdLoading) {
            return false;
        }

        if (!token) {
            setHoldError("Please sign in again.");
            return false;
        }

        if (!selectedSeats.length) {
            setHoldError("Please select at least one seat.");
            return false;
        }

        requestRef.current = true;
        setHoldLoading(true);
        setHoldError("");

        try {
            const response = await createSessionHold(
                sessionId,
                selectedSeats.map((seat) => ({
                    seatId: seat.id,
                    ticketType: seat.ticketType,
                })),
                token
            );

            const id = getHoldId(response);

            if (id == null) {
                throw new Error(
                    "Seat reservation succeeded, but the response did not contain a hold ID."
                );
            }

            setHoldId(id);

            const expiresAt = getHoldExpiration(response, holdMinutes);

            setHoldExpiresAt(expiresAt);
            setRemainingMs(
                Math.max(0, expiresAt - Date.now())
            );

            onSuccess?.();

            return true;
        } catch (error) {
            if (Number(getErrorStatus(error)) === 409) {
                const codes = getLostSeatCodes(error);
                const lostSeats = findLostSeats(allSeats, codes);

                const lostKeys = new Set([
                    ...codes.map(normalizeSeatKey),
                    ...lostSeats.flatMap((seat) =>
                        [
                            seat.id,
                            seat.code,
                            seat.seatCode,
                            seat.seat_code,
                        ]
                            .filter(Boolean)
                            .map(normalizeSeatKey)
                    ),
                ]);

                setSelectedSeatTypes((current) =>
                    removeLostSelections(
                        current,
                        allSeats,
                        [...lostKeys]
                    )
                );

                setLostSeatKeys((current) => [
                    ...new Set([...current, ...lostKeys]),
                ]);

                const labels = lostSeats.map(getSeatLabel);

                setHoldError(
                    labels.length
                        ? `These seats were taken by another customer: ${labels.join(", ")}. They have been removed. Your remaining selections have been kept.`
                        : "One or more seats were taken by another customer. Your remaining selections have been kept."
                );

                refreshSeats();
            } else {
                const payload = getErrorPayload(error);

                setHoldError(
                    payload?.message ??
                    payload?.error ??
                    error?.message ??
                    "Unable to reserve seats. Please try again."
                );
            }

            return false;
        } finally {
            requestRef.current = false;
            setHoldLoading(false);
        }
    }, [
        holdLoading,
        token,
        selectedSeats,
        sessionId,
        holdMinutes,
        onSuccess,
        allSeats,
        setSelectedSeatTypes,
        setLostSeatKeys,
        refreshSeats,
    ]);

    const clearHold = useCallback(() => {
        setHoldId(null);
        setHoldExpiresAt(null);
        setRemainingMs(null);
        setHoldError("");
    }, []);

    const holdExpired =
        holdExpiresAt !== null &&
        (remainingMs ?? 0) <= 0;

    return {
        createHold,
        holdId,
        holdLoading,
        holdError,
        setHoldError,
        holdExpiresAt,
        remainingMs,
        countdown: formatCountdown(remainingMs ?? 0),
        holdExpired,
        clearHold,
    };
}