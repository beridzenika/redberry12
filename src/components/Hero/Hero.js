import { useCallback, useEffect, useState } from "react";

import { useFetch } from "../../hooks/useFetch";
import { fetchData } from "../../services/api";

import { ReactComponent as ArrowIcon } from "../../assets/icons/Arrow.svg";

import "./Hero.css";
import HeroSlide from "./HeroSlide";

function Hero() {
    const fetchFeaturedMovies = useCallback(
        () => fetchData("movies/featured"),
        []
    );

    const { data, loading, error } = useFetch(fetchFeaturedMovies);
    const movies = data?.data;

    const [currentIndex, setCurrentIndex] = useState(0);
    const [previousIndex, setPreviousIndex] = useState(null);

    const changeSlide = useCallback(
        (newIndex) => {
            setPreviousIndex(currentIndex);
            setCurrentIndex(newIndex);

            setTimeout(() => {
                setPreviousIndex(null);
            }, 500);
        },
        [currentIndex]
    );

    useEffect(() => {
        if (!movies || movies.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => {
                const nextIndex = (prevIndex + 1) % movies.length;

                setPreviousIndex(prevIndex);

                setTimeout(() => {
                    setPreviousIndex(null);
                }, 500);

                return nextIndex;
            });
        }, 3000);

        return () => clearInterval(interval);
    }, [movies, currentIndex]);

    const handlePrevious = () => {
        changeSlide(
            currentIndex === 0 ? movies.length - 1 : currentIndex - 1
        );
    };

    const handleNext = () => {
        changeSlide((currentIndex + 1) % movies.length);
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    if (!movies || movies.length === 0) {
        return <p>No featured movies available</p>;
    }

    return (
        <section className="site-hero" aria-label="Featured movies">
            {/* Previous complete slide */}
            {previousIndex !== null && (
                <HeroSlide
                    key={`previous-${movies[previousIndex].id}`}
                    movie={movies[previousIndex]}
                    className="hero-slide-previous"
                />
            )}

            {/* Current complete slide */}
            <HeroSlide
                key={`current-${movies[currentIndex].id}`}
                movie={movies[currentIndex]}
                className="hero-slide-current"
            />

            {/* Carousel controls */}
            <nav
                className="carousel-nav"
                aria-label="Featured movie navigation"
            >
                <div className="pagination">
                    {movies.map((movie, index) => (
                        <button
                            key={movie.id ?? index}
                            className={
                                index === currentIndex
                                    ? "pagination-item active"
                                    : "pagination-item"
                            }
                            type="button"
                            aria-label={`Show ${movie.title}`}
                            aria-current={
                                index === currentIndex ? "true" : undefined
                            }
                            onClick={() => changeSlide(index)}
                        />
                    ))}
                </div>

                <div className="arrow-box">
                    <button
                        className="arrow-frame"
                        type="button"
                        onClick={handlePrevious}
                        aria-label="Previous featured movie"
                    >
                        <ArrowIcon aria-hidden="true" />
                    </button>

                    <button
                        className="arrow-frame"
                        type="button"
                        onClick={handleNext}
                        aria-label="Next featured movie"
                    >
                        <ArrowIcon
                            className="arrow-next"
                            aria-hidden="true"
                        />
                    </button>
                </div>
            </nav>
        </section>
    );
}

export default Hero;
