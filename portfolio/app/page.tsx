import Image from "next/image";
import Terminal from "./components/Terminal";

export default function Home(){
  return (
    <main>
      <section>
        <h1 className="mt-70 mx-100 text-5xl sm:text-6xl">
          Emily Lou
        </h1>
        <p className="mt45 px-48 px-10 leading-20 sm:text-xl">
          I build thoughtful technology that connects people, ideas, and experiences.
        </p>
      </section>

      <Terminal />
    </main>
  )
}