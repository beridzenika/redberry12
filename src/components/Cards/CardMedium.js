import { useState } from "react";

import { useMovies } from "../../hooks/useMovies";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useModal } from "../../hooks/useModal";
import { formatReleaseDate } from "../../utils/dateUtils";

import { notifyMovie } from "../../services/api";

import { ReactComponent as NotifyIcon } from "../../assets/icons/Notify.svg";

import "./Card.css";

function CardMedium() {
    const { movies: cards, loading, error } =
        useMovies("coming-soon");

    const { isAuthenticated, token } = useAuthContext();
    const { openModal } = useModal();

    const [notificationMessage, setNotificationMessage] =
        useState({});
    const [notifyingMovie, setNotifyingMovie] =
        useState({});

    const handleNotify = async (movieSlug) => {
        if (!isAuthenticated || !token) {
            openModal("login");
            return;
        }

        setNotifyingMovie((prev) => ({
            ...prev,
            [movieSlug]: true,
        }));

        setNotificationMessage((prev) => ({
            ...prev,
            [movieSlug]: "",
        }));

        try {
            await notifyMovie(movieSlug, token);
        } catch (err) {
            setNotificationMessage((prev) => ({
                ...prev,
                [movieSlug]:
                    err.message ||
                    "Failed to subscribe. Please try again.",
            }));
        } finally {
            setNotifyingMovie((prev) => ({
                ...prev,
                [movieSlug]: false,
            }));
        }
    };

    if (loading) return <p>Loading...</p>;

    if (error) {
        return (
            <p className="text-body-s text-red">
                Error: {error}
            </p>
        );
    }

    return (
        <div className="card-row card-mid-row horizontal-scroll">
            {cards.map((card) => (
                <article
                    className="card-medium card"
                    key={card.id}
                >
                    <div
                        className="card-poster medium-poster bg-img"
                        style={{
                            backgroundImage: `url(${card.posterUrl})`,
                        }}
                    />

                    <div className="text-content">
                        <span className="text-label-s text-red">
                            IN CINEMAS{" "}
                            {formatReleaseDate(card.releaseDate)}
                        </span>

                        <h3 className="text-h2">
                            {card.title}
                        </h3>

                        <span className="text-body-m text-gray">
                            {card.genres?.[0]?.name ?? "Unknown"} ·{" "}
                            {card.runtimeMinutes} Min
                        </span>

                        {card.ageRating?.code && (
                            <span className="badge-red badge-s text-label-s">
                                {card.ageRating.code}
                            </span>
                        )}

                        <div className="card-footer">
                            <button
                                className="btn-border text-button"
                                type="button"
                                onClick={() => handleNotify(card.slug)}
                                disabled={
                                    notifyingMovie[card.slug] ||
                                    !card.isComingSoon
                                }
                                style={{
                                    backgroundColor:
                                        card.isComingSoon &&
                                        !card.isNotified
                                            ? "var(--color-tint-white)"
                                            : undefined,
                                }}
                            >
                                <NotifyIcon />
                                {notifyingMovie[card.slug]
                                    ? "Subscribing..."
                                    : "Notify Me"}
                            </button>

                            {notificationMessage[card.slug] && (
                                <p
                                    className="text-body-s text-red"
                                    role="alert"
                                >
                                    {notificationMessage[card.slug]}
                                </p>
                            )}
                        </div>
                    </div>
                </article>
            ))}
        </div>
    );
}

export default CardMedium;