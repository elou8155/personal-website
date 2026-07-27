import Image from "next/image";
import Terminal from "./components/Terminal";
import Hero from "./components/Hero";
import About from "./components/About";
import Experience from "./components/Experience";
import Projects from "./components/Projects";
import Contact from "./components/Contact";

export default function Home(){
  return (
    <main>
      <Hero />
      <Terminal />
      <About />
      <Experience />
      <Projects />
      <Contact />
    </main>
  )
}