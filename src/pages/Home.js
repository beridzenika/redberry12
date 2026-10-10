import Hero from "../components/Hero/Hero";
import Section from "../components/Section/Section";
import CardBig from "../components/Cards/CardBig";
import CardMedium from "../components/Cards/CardMedium";

import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useModal } from "../hooks/useModal";

function Home() {
    const location = useLocation();
    const navigate = useNavigate();
    const { openModal } = useModal();

    useEffect(() => {
        if (!location.state?.openLogin) {
            return;
        }
        navigate(location.pathname, {
            replace: true,
            state: null,
        });

        openModal("login");
    }, [location.state, location.pathname, navigate, openModal]);

    return (
        <main>
            <Hero/>
            <Section title="NOW PLAYING" to="/sessions">
                <CardBig />
            </Section>
            <hr className="page-line" />
            <Section title="COMING SOON..." to="/sessions">
                <CardMedium />
            </Section>
        </main>
    );
};

export default Home;