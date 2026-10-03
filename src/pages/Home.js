import Hero from "../components/Hero/Hero";
import Section from "../components/Section/Section";
import CardBig from "../components/cards/CardBig";


function Home() {
  return (
        <main>
            <Hero/>
            <Section title="NOW PLAYING" to="/sessions">
                <CardBig />
            </Section>
        </main>
    );
};

export default Home;