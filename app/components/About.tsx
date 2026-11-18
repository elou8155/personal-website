import Image from "next/image";
import headshot from "@/public/images/headshot.jpg";
import TetrisName from "./TetrisName";

type LinkItem = {
    label: string;
    href: string;
    icon: string; // SVG path, 24 x 24
    newTab: boolean; // web links open in a new tab; the email link opens the mail app
    title?: string; // hover text (defaults to the label)
};

// Icons: the official GitHub / LinkedIn marks (from Simple Icons) and the
// Material Design "email" envelope
const LINKS: LinkItem[] = [
    {
        label: "LinkedIn",
        newTab: true,
        href: "https://www.linkedin.com/in/emily-lou-tech",
        icon: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 4.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
    },
    {
        label: "GitHub",
        newTab: true,
        href: "https://github.com/elou8155",
        icon: "M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12",
    },
    {
        label: "Email",
        newTab: false,
        href: "mailto:emilylou8155@gmail.com",
        title: "emilylou8155@gmail.com",
        icon: "M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z",
    },
];

export default function About(){
    return (
        // No id on the sections: with tabs there is nothing to scroll to, and an id
        // matching the address (/#about) makes the browser jump down to the section
        <section className="px-15 mx-auto pb-20">
            <TetrisName />

            <div className="mx-auto mt-6 grid max-w-4xl items-center gap-10 md:grid-cols-[minmax(0,1fr)_auto] md:gap-14">
                {/* Left: about me */}
                <div>
                    <h2 className="text-4xl text-rose font-semibold tracking-tight sm:text-5xl">Emily Lou</h2>
                    <p className="mt-3 text-lg text-rose font-medium">Texas A&amp;M University – College Station</p>
                    <p className="text-ink/70">B.S. in Computer Science · Graduating December 2027</p>

                    <div className="mt-6 space-y-4 leading-relaxed text-ink/85">
                        <p>
                            Hi, welcome to my corner of the internet! I&apos;ve always enjoyed solving
                            challenging puzzles, whether it&apos;s a tricky bug, a new algorithm, or a round
                            of the Tetris game above. That same curiosity is what I bring to computer science.
                        </p>
                        <p>
                            I love building thoughtful technology that connects people, ideas, and
                            experiences, from AI tools like a RAG chatbot for HPC user support to Finch, a
                            web app that won Best AggieX Startup at TAMU Build4Good 2026.
                        </p>
                        <p>
                            Thanks for stopping by! Feel free to explore my projects, or say hello by
                            email, on LinkedIn, or on GitHub. I&apos;d love to connect.
                        </p>
                    </div>

                    <ul className="mt-6 flex gap-3">
                        {LINKS.map((link) => (
                            <li key={link.label}>
                                <a
                                    href={link.href}
                                    target={link.newTab ? "_blank" : undefined}
                                    rel={link.newTab ? "noopener noreferrer" : undefined}
                                    aria-label={link.newTab ? `${link.label} (opens in a new tab)` : `${link.label} me`}
                                    title={link.title ?? link.label}
                                    className="flex h-11 w-11 items-center justify-center rounded-full border border-ink/15 text-ink transition hover:-translate-y-0.5 hover:border-rose hover:text-rose focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose"
                                >
                                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
                                        <path d={link.icon} />
                                    </svg>
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Right: headshot (shown first, above the text, on small screens) */}
                <div className="order-first mx-auto w-48 sm:w-56 md:order-last md:w-72">
                    <Image
                        src={headshot}
                        alt="Headshot of Emily Lou"
                        placeholder="blur"
                        sizes="(min-width: 768px) 288px, (min-width: 640px) 224px, 192px"
                        className="h-auto w-full rounded-2xl shadow-lg ring-1 ring-ink/10"
                    />
                </div>
            </div>
        </section>
    )
}
