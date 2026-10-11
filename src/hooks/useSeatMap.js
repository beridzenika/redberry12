import { useCallback, useEffect, useRef, useState } from "react";

import { fetchData } from "../services/api";
import {
    flattenSeats,
    markLostSeatsAsSold,
} from "../utils/seatUtils";

export function useSeatMap({
    sessionId,
    isOpen,
    defaultTicketTypeSlug,
    lostSeatKeys,
}) {
    const [seatMap, setSeatMap] = useState(null);
    const [selectedSeatTypes, setSelectedSeatTypes] = useState({});
    const [seatsLoading, setSeatsLoading] = useState(false);
    const [seatsError, setSeatsError] = useState(null);
    const [refreshKey, setRefreshKey] = useState(0);

    const initializedSessionRef = useRef(null);

    const refreshSeats = useCallback(() => {
        setRefreshKey((key) => key + 1);
    }, []);

    useEffect(() => {
        if (!isOpen || !sessionId) {
            initializedSessionRef.current = null;
            return;
        }

        let cancelled = false;

        const isNewSession =
            initializedSessionRef.current !== sessionId;

        if (isNewSession) {
            initializedSessionRef.current = sessionId;
            setSeatMap(null);
            setSelectedSeatTypes({});
        }

        async function loadSeats() {
            setSeatsLoading(true);
            setSeatsError(null);

            try {
                const response = await fetchData(
                    `sessions/${sessionId}/seats`
                );

                const data = response?.data ?? response;

                if (!Array.isArray(data?.sections)) {
                    throw new Error("Invalid seat map response.");
                }

                if (cancelled) return;

                const updatedMap = markLostSeatsAsSold(
                    data,
                    lostSeatKeys
                );

                setSeatMap(updatedMap);

                if (isNewSession) {
                    const mine = flattenSeats(updatedMap)
                        .filter((seat) => seat.isMine)
                        .map((seat) => seat.id);

                    setSelectedSeatTypes(
                        defaultTicketTypeSlug
                            ? Object.fromEntries(
                                  mine.map((id) => [
                                      id,
                                      defaultTicketTypeSlug,
                                  ])
                              )
                            : {}
                    );
                } else {
                    // Keep valid selections during a refetch.
                    const availableIds = new Set(
                        flattenSeats(updatedMap)
                            .filter(
                                (seat) =>
                                    seat.state === "available" ||
                                    seat.isMine === true
                            )
                            .map((seat) => String(seat.id))
                    );

                    setSelectedSeatTypes((current) =>
                        Object.fromEntries(
                            Object.entries(current).filter(
                                ([id]) =>
                                    availableIds.has(String(id))
                            )
                        )
                    );
                }
            } catch (error) {
                if (!cancelled) {
                    setSeatsError(error);
                }
            } finally {
                if (!cancelled) {
                    setSeatsLoading(false);
                }
            }
        }

        loadSeats();

        return () => {
            cancelled = true;
        };
    }, [
        isOpen,
        sessionId,
        refreshKey,
        defaultTicketTypeSlug,
        lostSeatKeys,
    ]);

    return {
        seatMap,
        setSeatMap,
        selectedSeatTypes,
        setSelectedSeatTypes,
        seatsLoading,
        seatsError,
        refreshSeats,
    };
}