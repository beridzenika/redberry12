import Hero from "../components/Hero/Hero";
import Section from "../components/Section/Section";
import CardBig from "../components/cards/CardBig";
import CardMedium from "../components/cards/CardMedium";

function Home() {
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