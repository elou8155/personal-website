import {Fragment} from "react";
import RevealItem from "./Reveal";

type Role = {
    title: string;
    organization: string;
    start: string; // "YYYY-MM"
    end?: string; // "YYYY-MM"; leave out for a role that is still going
    bullets: string[]; // **double asterisks** mark the numbers worth noticing
};

// Newest first. To add a role, add an entry here and nothing else.
const EXPERIENCE: Role[] = [
    {
        title: "Machine Learning Intern",
        organization: "Los Alamos National Laboratory (LANL)",
        start: "2026-05",
        end: "2026-07",
        bullets: [
            "Explored how deepfake detectors can be fooled, building adversarial attack methods that automatically uncover weak spots in multimodal machine learning models.",
            "Created a scalable PyTorch pipeline that tests models across large datasets on its own, making it easy to repeat benchmarks and see exactly where models fail.",
        ],
    },
    {
        title: "AI/ML & Web Applications Developer",
        organization: "Texas A&M High Performance Research Computing",
        start: "2026-01",
        bullets: [
            "Built an AI assistant that answers questions about the university's supercomputing resources for more than **3,000** researchers, using retrieval-augmented generation with LangChain, FAISS, and BGE embeddings.",
            "Created a web app where researchers can try out large language models on NVIDIA and Intel GPUs, tied into Linux and high-performance computing workflows.",
            "Made model responses **75%** faster using PyTorch, vLLM, and CUDA across multiple GPUs.",
        ],
    },
    {
        title: "Summer Research Intern",
        organization: "NSF REU Program (AI-Driven Resilient Health and Biological Systems)",
        start: "2025-05",
        end: "2025-07",
        bullets: [
            "Trained an LSTM neural network that sorts neural signals into **3** categories with **70%** cross-validated accuracy across more than **2,000** samples.",
            "Built a reusable data pipeline with NumPy and Pandas that cleans data and pulls out features automatically.",
        ],
    },
    {
        title: "Research Assistant",
        organization: "Texas A&M University",
        start: "2024-09",
        end: "2025-12",
        bullets: [
            "Built a YOLO object detection model that spots invasive weeds in agricultural images with **85%** accuracy.",
            "Cleaned, augmented, and normalized the image data with Python, which made the model more accurate and cut down on false positives.",
        ],
    },
];

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function formatMonth(value: string) {
    const [year, month] = value.split("-");
    return `${MONTHS[Number(month) - 1]} ${year}`;
}

// Turns **bold** markers in a bullet into <strong>
function Bullet({text}: {text: string}) {
    return (
        <>
            {text.split("**").map((part, i) =>
                i % 2 === 1 ? (
                    <strong key={i} className="font-semibold text-ink">
                        {part}
                    </strong>
                ) : (
                    part
                )
            )}
        </>
    );
}

// Small beveled square, like a Tetris block
const BLOCK_BEVEL = "inset 2px 2px 0 rgb(255 255 255 / 0.35), inset -2px -2px 0 rgb(0 0 0 / 0.3)";

export default function Experience(){
    return(
        <section className="mx-auto px-6 pb-20 md:px-15">
            <div className="mx-auto max-w-4xl pt-12">
                <h2 className="text-4xl text-rose font-semibold tracking-tight sm:text-5xl">Experience</h2>

                <ol className="mt-10 ml-2 border-l border-ink/15">
                    {EXPERIENCE.map((role, index) => {
                        const year = role.start.slice(0, 4);
                        const showYear = index === 0 || year !== EXPERIENCE[index - 1].start.slice(0, 4);
                        const current = !role.end;

                        return (
                            <Fragment key={`${role.title}-${role.start}`}>
                                {showYear && (
                                    // Visual only: the dates in each entry already say the year
                                    <li
                                        role="presentation"
                                        aria-hidden="true"
                                        className="relative pb-5 pl-8 text-sm font-bold tracking-[0.18em] text-ink/50"
                                    >
                                        <span className="absolute -left-[3.5px] top-[7px] h-1.5 w-1.5 rounded-full bg-ink/25" />
                                        {year}
                                    </li>
                                )}
                                <RevealItem className="relative pb-12 pl-8 last:pb-0">
                                    {current && (
                                        <span
                                            aria-hidden="true"
                                            className="absolute -left-[11.5px] top-[-2px] h-[22px] w-[22px] bg-rose/25 motion-safe:animate-pulse"
                                        />
                                    )}
                                    <span
                                        aria-hidden="true"
                                        className="absolute -left-[7.5px] top-[2px] h-3.5 w-3.5 bg-rose"
                                        style={{boxShadow: BLOCK_BEVEL}}
                                    />

                                    <h3 className="text-xl font-semibold leading-snug">{role.title}</h3>
                                    <p className="mt-0.5 font-medium text-ink/80">{role.organization}</p>
                                    <p className="mt-1 text-sm text-ink/70">
                                        <time dateTime={role.start}>{formatMonth(role.start)}</time>
                                        {" – "}
                                        {role.end ? <time dateTime={role.end}>{formatMonth(role.end)}</time> : "Present"}
                                    </p>

                                    <ul className="mt-4 max-w-2xl list-disc space-y-2 pl-5 leading-relaxed text-ink/85 marker:text-rose">
                                        {role.bullets.map((bullet) => (
                                            <li key={bullet}>
                                                <Bullet text={bullet} />
                                            </li>
                                        ))}
                                    </ul>
                                </RevealItem>
                            </Fragment>
                        );
                    })}
                </ol>
            </div>
        </section>
    )
}
