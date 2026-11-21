"use client";

import {useState} from "react";
import ProjectCard, {type Project} from "./ProjectCard";
import ProjectDialog from "./ProjectDialog";

const projects: Project[] = [
{
    title: "RAG Chatbot for HPC User Support",
    description: "Help Texas A&M researchers get system-specific answers to HPC questions",
    image: "",
    details: "A locally hosted Retrieval-Augmented Generation chatbot built for Texas A&M HPRC, giving 3,000+ researchers accurate, system-specific answers to HPC questions. It retrieves relevant HPRC documentation with BGE embeddings and FAISS, reranks it, and passes it to Llama models served with vLLM on Intel GPUs, so answers stay grounded instead of generic or hallucinated. Researchers can use it through Open OnDemand on the ACES cluster, which means fewer support tickets for common questions.",
    technologies: ["RAG", "Python", "PyTorch", "Flask", "REST API", "LangChain","vLLM", "FAISS", "Intel oneAPI"],
    links: [{label: "GitHub", href: "https://github.com/elou8155/Tamu-Hprc-Rag-Chatbot"}]
},
{
    title: "ML Neural Signal Classifier",
    description: "LSTM-based deep learning model to classify cognitive states from neural signals",
    image: "/images/neural_signals.png",
    details: "An LSTM neural network that classifies cognitive states from time-series fNIRS signals recorded by a wearable forehead sensor from Florida International University's Flexible Electronics Lab. I built the full pipeline for the AI-Driven Resilient Health and Biological Systems Research Program: smoothing, normalization and windowing of the raw signals, then three stacked LSTM layers evaluated with group 4-fold cross-validation. It reached 66% accuracy separating active from resting states, and the results showed both the promise of LSTMs on this data and where a small dataset holds them back.",
    technologies: ["tech1", "tech2"],
    links: [{label: "GitHub", href: "https://github.com/elou8155/Cognitive-State-Recognition-Using-Deep-Learning"}]
},
{
    title: "Stuffed Animal Detector",
    description: "YOLO11 object-detection project",
    image: "/images/ted.jpg",
    technologies: [""],
    links: [{label: "GitHub", href: "https://github.com/elou8155/bobby-ted-detector"}]
},
{
    title: "Tutoring Management Platform",
    description: "Manage student lessons, communication, and payments",
    image: "",
    technologies: ["tech1", "tech2"]
},
{
    title: "Finch Website",
    description: "Won best AggieX Startup @ TAMU Build4Good 2026",
    image: "/images/finch_image.jpg",
    details: "Finch is a Chrome extension that autofills job applications with AI-tailored resumes, helping CS and engineering students apply smarter, not harder. Our team built its multi-page marketing site from scratch, with an animated hero, a live autofill mockup, a step-by-step walkthrough, a waitlist form and a site-wide dark mode. With no mockups to follow, we designed the motion, hierarchy and branding ourselves. The project won Best AggieX Startup at TAMU Build4Good 2026.",
    technologies: ["React", "Next.js", "Typescript", "Tailwind CSS"],
    links: [{label: "GitHub", href: "https://github.com/smkilaru213/Build4Good"}]
}
]
export default function Projects(){
    const [selected, setSelected] = useState<Project | null>(null);

    return(
        <section className="px-10 py-10 mx-auto">
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl text-center text-rose">Personal Project Portfolio</h1>
            <div className="mx-auto mt-6 grid max-w-5xl grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
                {projects.map((project) => (
                    <ProjectCard key={project.title} project={project} onOpen={() => setSelected(project)} />
                ))}
            </div>
            <ProjectDialog project={selected} onClose={() => setSelected(null)} />
        </section>
    )
}
