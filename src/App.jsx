import { useEffect } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import FeaturesStrip from "./components/FeaturesStrip";
import About from "./components/About";
import Values from "./components/Values";
import Services from "./components/Services";
import Methodology from "./components/Methodology";
import Industries from "./components/Industries";
import CTA from "./components/CTA";
import Clients from "./components/Clients";
import Footer from "./components/Footer";
import "./App.css";

function App() {
  useEffect(() => {
    const nodes = document.querySelectorAll(".reveal");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !("IntersectionObserver" in window)) {
      nodes.forEach((node) => node.classList.add("is-visible"));
      return undefined;
    }

    document.documentElement.classList.add("js-reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.16 },
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <Header />
      <main>
        <Hero />
        <FeaturesStrip />
        <About />
        <Values />
        <Services />
        <Methodology />
        <Industries />
        <CTA />
        <Clients />
      </main>
      <Footer />
    </>
  );
}

export default App;
