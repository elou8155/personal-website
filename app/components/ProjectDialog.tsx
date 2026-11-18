"use client";

import Image from "next/image";
import {useEffect, useRef} from "react";
import type {Project} from "./ProjectCard";

type ProjectDialogProps = {
    project: Project | null; // the project to show, or null when closed
    onClose: () => void;
};

// The popup that opens when a project tile is clicked. It uses the browser's own
// <dialog>, which gives Esc-to-close, keeps keyboard focus inside the popup, dims
// the page behind it, and returns focus to the tile when it closes.
export default function ProjectDialog({project, onClose}: ProjectDialogProps) {
    const dialogRef = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;
        if (project && !dialog.open) dialog.showModal();
        if (!project && dialog.open) dialog.close();
    }, [project]);

    return (
        <dialog
            ref={dialogRef}
            className="project-dialog"
            aria-labelledby="project-dialog-title"
            onClose={onClose}
            // A click on the dimmed area outside the popup lands on the <dialog> itself
            onClick={(event) => {
                if (event.target === dialogRef.current) dialogRef.current?.close();
            }}
        >
            {project && (
                <div className="relative">
                    {project.image && (
                        <div className="relative aspect-[16/9] w-full bg-black/30">
                            <Image
                                src={project.image}
                                alt={`${project.title} screenshot`}
                                fill
                                sizes="(min-width: 704px) 672px, 100vw"
                                className="object-cover"
                            />
                        </div>
                    )}

                    <button
                        type="button"
                        aria-label="Close"
                        onClick={() => dialogRef.current?.close()}
                        className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-black/55 text-white transition-colors hover:bg-rose focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose"
                    >
                        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                            <path d="M6 6l12 12M18 6L6 18" />
                        </svg>
                    </button>

                    <div className="p-6 sm:p-8">
                        <h2 id="project-dialog-title" className="pr-10 text-2xl font-semibold leading-snug">
                            {project.title}
                        </h2>
                        <p className="mt-3 leading-relaxed text-ink/85">{project.details ?? project.description}</p>

                        {project.technologies.length > 0 && (
                            <ul className="mt-5 flex flex-wrap gap-2">
                                {project.technologies.map((tech) => (
                                    <li key={tech} className="rounded-full bg-rose/25 px-3 py-1 text-sm font-medium text-ink">
                                        {tech}
                                    </li>
                                ))}
                            </ul>
                        )}

                        {project.links && project.links.length > 0 && (
                            <div className="mt-6 flex flex-wrap gap-3">
                                {project.links.map((link) => (
                                    <a
                                        key={link.href}
                                        href={link.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="rounded-full border border-ink/25 px-4 py-2 text-sm font-medium transition-colors hover:border-rose hover:text-rose focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose"
                                    >
                                        {link.label} ↗
                                    </a>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </dialog>
    );
}
