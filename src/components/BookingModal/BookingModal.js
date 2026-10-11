import { useCallback, useMemo, useState, useEffect, useRef } from "react";

import { fetchData } from "../../services/api";
import { useFetch } from "../../hooks/useFetch";
import { useModal } from "../../hooks/useModal";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useFilterOptions } from "../../hooks/useFilterOptions";

import { useSeatMap } from "../../hooks/useSeatMap";
import { useSeatHold } from "../../hooks/useSeatHold";
import { flattenSeats } from "../../utils/seatUtils";
import { useCheckout } from "../../hooks/useCheckout";

import ModalOverlay from "../Modal/ModalOverlay";
import BookingSessionDetails from "./BookingSessionDetails";
import BookingSeatMap from "../BookingSeatMap/BookingSeatMap";
import BookingSelectionSummary from "./BookingSelectionSummary";
import BookingCheckoutSummary from "../BookingCheckout/BookingCheckoutSummary";
import BookingCheckoutForm from "../BookingCheckout/BookingCheckoutForm";

import "./BookingModal.css";

function BookingModal() {
    const { modals, closeModal, bookingSessionId } = useModal();
    const { user, token } = useAuthContext();

    const {
        data: filterOptions,
        loading: optionsLoading,
        error: optionsError,
    } = useFilterOptions();

    const [currentStep, setCurrentStep] = useState("seats");
    const [lostSeatKeys, setLostSeatKeys] = useState([]);

    const sessionId = bookingSessionId;
    const isOpen = Boolean(modals.booking && sessionId);

    const expirationHandledRef = useRef(false);

    const maxSeatsPerOrder = Number(
        filterOptions?.maxSeatsPerOrder ?? 3
    );

    const holdMinutes = Number(
        filterOptions?.holdMinutes ?? 8
    );

    const ticketTypes = useMemo(
        () =>
            Array.isArray(filterOptions?.ticketTypes)
                ? filterOptions.ticketTypes
                : [],
        [filterOptions?.ticketTypes]
    );

    const ticketTypeBySlug = useMemo(
        () =>
            Object.fromEntries(
                ticketTypes.map((type) => [type.slug, type])
            ),
        [ticketTypes]
    );

    const defaultTicketTypeSlug =
        ticketTypes.find((type) => type.slug === "adult")?.slug ??
        ticketTypes[0]?.slug ??
        null;

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

    const {
        seatMap,
        selectedSeatTypes,
        setSelectedSeatTypes,
        seatsLoading,
        seatsError,
        refreshSeats,
    } = useSeatMap({
        sessionId,
        isOpen,
        defaultTicketTypeSlug,
        lostSeatKeys,
    });

    const allSeats = useMemo(
        () => flattenSeats(seatMap),
        [seatMap]
    );

    const seatPrice = Number(session?.price ?? 0);

    const selectedSeatIds = useMemo(
        () =>
            allSeats
                .filter((seat) => selectedSeatTypes[seat.id])
                .map((seat) => seat.id),
        [allSeats, selectedSeatTypes]
    );

    const selectedSeats = useMemo(
        () =>
            allSeats
                .filter((seat) => selectedSeatTypes[seat.id])
                .map((seat) => {
                    const ticketType = selectedSeatTypes[seat.id];
                    const config = ticketTypeBySlug[ticketType];

                    const basePrice = Number(
                        seat.price ?? seatPrice
                    );

                    const multiplier = Number(
                        config?.priceRatio ?? 1
                    );

                    return {
                        ...seat,
                        ticketType,
                        ticketTypeName: config?.name ?? ticketType,
                        price:
                            Math.round(
                                basePrice * multiplier * 100
                            ) / 100,
                    };
                }),
        [
            allSeats,
            selectedSeatTypes,
            ticketTypeBySlug,
            seatPrice,
        ]
    );

    const subtotal = useMemo(
        () =>
            selectedSeats.reduce(
                (total, seat) => total + seat.price,
                0
            ),
        [selectedSeats]
    );

    const ageRating =
        session?.ageRating ??
        session?.age_rating ??
        session?.movie?.ageRating ??
        session?.movie?.age_rating ??
        "";

    const minimumAgeMatch = String(ageRating).match(
        /(\d+)\s*\+/
    );

    const minimumAge = minimumAgeMatch
        ? Number(minimumAgeMatch[1])
        : String(ageRating).trim() !== "" &&
            Number.isFinite(Number(ageRating))
          ? Number(ageRating)
          : null;

    const isTicketTypeAllowed = useCallback(
        (slug) => {
            const type = ticketTypeBySlug[slug];

            if (!type) return false;

            if (
                type.blockedFromRatingAge == null ||
                minimumAge == null
            ) {
                return true;
            }

            return (
                minimumAge < Number(type.blockedFromRatingAge)
            );
        },
        [ticketTypeBySlug, minimumAge]
    );

    const isAuthenticated = Boolean(user?.id);
    const isProfileComplete = user?.profileComplete === true;

    const meetsAgeRestriction =
        minimumAge === null ||
        (
            user?.age != null &&
            Number.isFinite(Number(user.age)) &&
            Number(user.age) >= minimumAge
        );

    const seatsAreValid =
        selectedSeats.length >= 1 &&
        selectedSeats.length <= maxSeatsPerOrder &&
        selectedSeats.every(
            (seat) =>
                (
                    seat.state === "available" ||
                    seat.isMine === true
                ) &&
                isTicketTypeAllowed(seat.ticketType)
        );

    const canCheckout =
        isAuthenticated &&
        isProfileComplete &&
        meetsAgeRestriction &&
        seatsAreValid;

    const {
        createHold,
        holdId,
        holdLoading,
        holdError,
        setHoldError,
        holdExpiresAt,
        countdown,
        holdExpired,
        clearHold,
    } = useSeatHold({
        sessionId,
        token,
        holdMinutes,
        selectedSeats,
        allSeats,
        selectedSeatTypes,
        setSelectedSeatTypes,
        setLostSeatKeys,
        refreshSeats,
        onSuccess: () => setCurrentStep("checkout"),
    });

    const {
        submitOrder,
        orderLoading,
        fieldErrors: orderFieldErrors,
        submitError: orderError,
        clearErrors: clearOrderErrors,
    } = useCheckout({
        token,

        onSuccess: (result) => {
            closeModal("booking");

            console.log("Order created successfully:", result);
        },

        onConflict: (message) => {
            setCurrentStep("seats");
            setSelectedSeatTypes({});
            clearHold();
            setHoldError(message);
            refreshSeats();
        },
    });

    useEffect(() => {
        if (!holdExpired || expirationHandledRef.current) {
            return;
        }

        expirationHandledRef.current = true;

        setCurrentStep("seats");
        setSelectedSeatTypes({});
        clearHold();

        setHoldError(
            "Your hold time expired. Please re-select your seats."
        );

        refreshSeats();
    }, [
        holdExpired,
        clearHold,
        refreshSeats,
        setSelectedSeatTypes,
        setHoldError,
    ]);

    useEffect(() => {
        if (isOpen) return;

        expirationHandledRef.current = false;
        setCurrentStep("seats");
        setLostSeatKeys([]);
        clearHold();
    }, [isOpen, clearHold]);

    function handleClose() {
        setSelectedSeatTypes({});
        setCurrentStep("seats");
        setLostSeatKeys([]);
        clearHold();
        closeModal("booking");
    }

    function handleSeatClick(seat) {
        setHoldError("");

        setSelectedSeatTypes((current) => {
            if (current[seat.id]) {
                const next = { ...current };
                delete next[seat.id];
                return next;
            }

            if (
                !defaultTicketTypeSlug ||
                !isTicketTypeAllowed(defaultTicketTypeSlug) ||
                seat.state !== "available" ||
                Object.keys(current).length >= maxSeatsPerOrder
            ) {
                return current;
            }

            return {
                ...current,
                [seat.id]: defaultTicketTypeSlug,
            };
        });
    }

    function handleTicketTypeChange(seatId, ticketType) {
        if (!isTicketTypeAllowed(ticketType)) return;

        setSelectedSeatTypes((current) => {
            if (!current[seatId]) return current;

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

    async function handleNext() {
        if (!canCheckout || holdLoading) return;

        setHoldError("");
        await createHold();
    }

    function handleBackToSeats() {
        setCurrentStep("seats");
    }

    async function handleCheckoutSubmit(details) {
        if (!holdExpiresAt || holdExpired || !holdId) {
            setCurrentStep("seats");
            setSelectedSeatTypes({});
            clearHold();

            setHoldError(
                "Your hold time expired. Please re-select your seats."
            );

            refreshSeats();
            return;
        }

        if (!canCheckout || orderLoading) {
            return;
        }

        const orderData = {
            holdId,
            fullName: details.customer.fullName,
            email: details.customer.email,
            mobileNumber: details.customer.mobileNumber,
            cardNumber: details.payment.cardNumber,
            expiry: details.payment.expiry,
            cvv: details.payment.cvv,
        };

        await submitOrder(orderData);
    }

    if (!isOpen) return null;

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
                    countdown={countdown}
                    holdExpiresAt={holdExpiresAt}
                    holdExpired={holdExpired}
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
                                    currentStep === "seats" ? "step" : undefined
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
                                    currentStep === "checkout" ? "step" : undefined
                                }
                                disabled={
                                    !holdExpiresAt ||
                                    holdExpired ||
                                    holdLoading
                                }
                                onClick={() => {
                                    if (holdExpiresAt && !holdExpired) {
                                        setCurrentStep("checkout");
                                    }
                                }}
                            >
                                CHECKOUT
                            </button>
                        </div>

                        {holdError && (
                            <div
                                className="booking-hold-error"
                                role="alert"
                            >
                                {holdError}
                            </div>
                        )}

                        {holdLoading && (
                            <p role="status">
                                Reserving your seats...
                            </p>
                        )}

                        <div className="booking-step-content">
                            {currentStep === "seats" ? (
                                <BookingSeatMap
                                    seatMap={seatMap}
                                    loading={
                                        seatsLoading || optionsLoading
                                    }
                                    error={seatsError || optionsError}
                                    selectedSeatIds={selectedSeatIds}
                                    onSeatClick={handleSeatClick}
                                    onRetry={refreshSeats}
                                />
                            ) : (
                                <BookingCheckoutForm
                                    session={session}
                                    selectedSeats={selectedSeats}
                                    subtotal={subtotal}
                                    onSubmit={handleCheckoutSubmit}
                                    onBack={handleBackToSeats}
                                    submitting={orderLoading}
                                    fieldErrors={orderFieldErrors}
                                    submitError={orderError}
                                    onClearErrors={clearOrderErrors}
                                />
                            )}
                        </div>
                    </div>

                    <div
                        className="booking-vertical-divider"
                        aria-hidden="true"
                    />

                    {currentStep === "seats" ? (
                        <BookingSelectionSummary
                            MAX_SEATS={maxSeatsPerOrder}
                            selectedSeats={selectedSeats}
                            subtotal={subtotal}
                            ticketTypes={ticketTypes}
                            isTicketTypeAllowed={isTicketTypeAllowed}
                            canCheckout={canCheckout && !holdLoading}
                            onTicketTypeChange={handleTicketTypeChange}
                            onRemoveSeat={handleRemoveSeat}
                            onNext={handleNext}
                        />
                    ) : (
                        <BookingCheckoutSummary
                            session={session}
                            selectedSeats={selectedSeats}
                            subtotal={subtotal}
                            submitting={orderLoading}
                        />
                    )}
                </div>
            </article>
        </ModalOverlay>
    );
}

export default BookingModal;