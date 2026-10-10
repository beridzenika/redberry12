import { useCallback, useEffect, useMemo, useState } from "react";

import { fetchData } from "../../services/api";
import { useFetch } from "../../hooks/useFetch";
import { useModal } from "../../hooks/useModal";

import ModalOverlay from "../Modal/ModalOverlay";
import BookingSessionDetails from "./BookingSessionDetails";
import BookingSeatMap from "../BookingSeatMap/BookingSeatMap";
import BookingSelectionSummary from "./BookingSelectionSummary";
import BookingCheckoutForm from "../BookingCheckout/BookingCheckoutForm";

import "./BookingModal.css";

const MAX_SEATS = 3;

const TICKET_TYPES = {
    ADULT: "adult",
    CHILD: "child",
    STUDENT: "student",
};

const TICKET_MULTIPLIERS = {
    adult: 1,
    child: 0.6,
    student: 0.75,
};

function BookingModal() {
    const {
        modals,
        closeModal,
        bookingSessionId,
    } = useModal();

    const [seatMap, setSeatMap] = useState(null);
    const [seatsLoading, setSeatsLoading] = useState(false);
    const [seatsError, setSeatsError] = useState(null);

    const [selectedSeatTypes, setSelectedSeatTypes] = useState({});
    const [refreshKey, setRefreshKey] = useState(0);
    const [currentStep, setCurrentStep] = useState("seats");

    const sessionId = bookingSessionId;
    const isOpen = Boolean(modals.booking && sessionId);

    const getSession = useCallback(() => {
        if (!sessionId || !isOpen) {
            return Promise.resolve(null);
        }

        return fetchData(`sessions/${sessionId}`);
    }, [sessionId, isOpen]);

    const {
        data: sessionResponse,
        loading: sessionLoading,
        error: sessionError,
    } = useFetch(getSession);

    const session = sessionResponse?.data ?? sessionResponse;

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        let cancelled = false;

        async function loadSeats() {
            setSeatMap(null);
            setSelectedSeatTypes({});
            setCurrentStep("seats");
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
                if (cancelled) {
                    return;
                }
                setSeatMap(data);

                const mine = data.sections.flatMap((section) =>
                    section.rows.flatMap((row) =>
                        row.seats
                            .filter((seat) => seat.isMine)
                            .map((seat) => seat.id)
                    )
                );

                setSelectedSeatTypes(
                    Object.fromEntries(
                        mine.map((id) => [id, TICKET_TYPES.ADULT])
                    )
                );
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
    }, [isOpen, refreshKey, sessionId]);

    const allSeats = useMemo(() => {
        if (!seatMap?.sections) {
            return [];
        }

        return seatMap.sections.flatMap((section) =>
            section.rows.flatMap((row) => row.seats)
        );
    }, [seatMap]);

    const seatPrice = Number(session?.price ?? 0);

    const selectedSeatIds = useMemo(
        () =>
            allSeats
                .filter((seat) => selectedSeatTypes[seat.id])
                .map((seat) => seat.id),
        [allSeats, selectedSeatTypes]
    );

    const selectedSeats = useMemo(() => {
        return allSeats
            .filter((seat) => selectedSeatTypes[seat.id])
            .map((seat) => {
                const ticketType = selectedSeatTypes[seat.id];
                const basePrice = Number(seat.price ?? seatPrice);
                const multiplier = TICKET_MULTIPLIERS[ticketType] ?? 1;

                return {
                    ...seat,
                    ticketType,
                    price:
                        Math.round(basePrice * multiplier * 100) / 100,
                };
            });
    }, [allSeats, selectedSeatTypes, seatPrice]);

    const subtotal = selectedSeats.reduce(
        (total, seat) => total + seat.price,
        0
    );

    const ageRating =
        session?.ageRating ??
        session?.age_rating ??
        session?.movie?.ageRating ??
        session?.movie?.age_rating ??
        "";

    const childAllowed = !/(16|18)\s*\+/i.test(String(ageRating));

    function handleClose() {
        setSelectedSeatTypes({});
        setCurrentStep("seats");
        closeModal("booking");
    }

    function handleSeatClick(seat) {
        setSelectedSeatTypes((current) => {
            if (current[seat.id]) {
                const next = { ...current };
                delete next[seat.id];
                return next;
            }

            if (
                seat.state !== "available" ||
                Object.keys(current).length >= MAX_SEATS
            ) {
                return current;
            }

            return {
                ...current,
                [seat.id]: TICKET_TYPES.ADULT,
            };
        });
    }

    function handleTicketTypeChange(seatId, ticketType) {
        if (!Object.hasOwn(TICKET_MULTIPLIERS, ticketType)) {
            return;
        }

        if (ticketType === TICKET_TYPES.CHILD && !childAllowed) {
            return;
        }

        setSelectedSeatTypes((current) => {
            if (!current[seatId]) {
                return current;
            }

            return {
                ...current,
                [seatId]: ticketType,
            };
        });
    }

    function handleRemoveSeat(seatId) {
        setSelectedSeatTypes((current) => {
            const next = { ...current };
            delete next[seatId];
            return next;
        });
    }

    function handleNext() {
        if (selectedSeats.length === 0) {
            return;
        }

        setCurrentStep("checkout");
    }

    function handleBackToSeats() {
        setCurrentStep("seats");
    }

    function handleCheckoutSubmit(details) {
        if (selectedSeats.length === 0) {
            setCurrentStep("seats");
            return;
        }

        const bookingData = {
            sessionId,
            customer: details,
            seats: selectedSeats.map((seat) => ({
                seatId: seat.id,
                ticketType: seat.ticketType,
                price: seat.price,
            })),
            subtotal,
        };
        console.log("Booking details:", bookingData);
    }

    if (!isOpen) {
        return null;
    }

    return (
        <ModalOverlay open={isOpen} onClose={handleClose}>
            <article
                className="booking-modal"
                aria-label="Movie ticket booking"
            >
                <BookingSessionDetails
                    session={session}
                    loading={sessionLoading}
                    error={sessionError}
                />

                <div className="booking-content">
                    <div className="booking-main">
                        <div
                            className="booking-steps"
                            aria-label="Booking steps"
                        >
                            <button
                                type="button"
                                className={`booking-step text-label-s ${
                                    currentStep === "seats" ? "active" : ""
                                }`}
                                aria-current={
                                    currentStep === "seats"
                                        ? "step"
                                        : undefined
                                }
                                onClick={handleBackToSeats}
                            >
                                SEATS
                            </button>
                            <button
                                type="button"
                                className={`booking-step text-label-s ${
                                    currentStep === "checkout" ? "active" : ""
                                }`}
                                aria-current={
                                    currentStep === "checkout"
                                        ? "step"
                                        : undefined
                                }
                                disabled={selectedSeats.length === 0}
                                onClick={handleNext}
                            >
                                CHECKOUT
                            </button>
                        </div>

                        <div className="booking-step-content">
                            {currentStep === "seats" ? (
                                <BookingSeatMap
                                    seatMap={seatMap}
                                    loading={seatsLoading}
                                    error={seatsError}
                                    selectedSeatIds={selectedSeatIds}
                                    onSeatClick={handleSeatClick}
                                    onRetry={() =>
                                        setRefreshKey((key) => key + 1)
                                    }
                                />
                            ) : (
                                <BookingCheckoutForm
                                    session={session}
                                    selectedSeats={selectedSeats}
                                    subtotal={subtotal}
                                    onSubmit={handleCheckoutSubmit}
                                    onBack={handleBackToSeats}
                                />
                            )}
                        </div>
                    </div>

                    <div
                        className="booking-vertical-divider"
                        aria-hidden="true"
                    />

                    <BookingSelectionSummary
                        MAX_SEATS={MAX_SEATS}
                        selectedSeats={selectedSeats}
                        subtotal={subtotal}
                        childAllowed={childAllowed}
                        onTicketTypeChange={handleTicketTypeChange}
                        onRemoveSeat={handleRemoveSeat}
                        onNext={
                            currentStep === "seats"
                                ? handleNext
                                : handleBackToSeats
                        }
                        actionLabel={
                            currentStep === "seats"
                                ? "Next: Checkout"
                                : "Back to Seats"
                        }
                    />
                </div>
            </article>
        </ModalOverlay>
    );
}

export default BookingModal;