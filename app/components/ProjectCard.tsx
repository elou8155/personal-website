import Image from "next/image";

export type Project = {
    title: string;
    description: string; // short; shown under the picture
    image: string; // leave "" for a project that has no picture yet
    technologies: string[];
    details?: string; // longer text for the popup (falls back to the description)
    links?: {label: string; href: string}[]; // e.g. GitHub or a live demo
};

type ProjectCardProps = {
    project: Project;
    onOpen: () => void;
};

// One project in the grid: a clean picture with the title and a short description
// underneath (nothing is drawn over the picture). Hovering zooms the picture and
// tints it rose; clicking opens the project's popup.
export default function ProjectCard({project, onOpen}: ProjectCardProps) {
    const {title, description, image} = project;

    return (
        <button
            type="button"
            onClick={onOpen}
            aria-haspopup="dialog"
            className="group flex w-full flex-col justify-start text-left focus-visible:outline-none"
        >
            {/* The picture frame; a flat grey box stands in until a project has a picture */}
            <span className="relative block aspect-[4/3] w-full overflow-hidden bg-grey group-focus-visible:outline-2 group-focus-visible:outline-offset-4 group-focus-visible:outline-rose">
                {image && (
                    // The title below names the project, so the picture is decoration
                    <Image
                        src={image}
                        alt=""
                        fill
                        sizes="(min-width: 1024px) 320px, (min-width: 640px) 384px, 100vw"
                        className="object-cover transition-transform duration-300 ease-out group-hover:scale-105 group-focus-visible:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100 motion-reduce:group-focus-visible:scale-100"
                    />
                )}

                {/* Rose tint, shown on hover and keyboard focus */}
                <span
                    aria-hidden="true"
                    className="absolute inset-0 bg-rose/30 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
                />
            </span>

            <span className="mt-3 block text-xl font-semibold leading-snug text-ink transition-colors duration-200 group-hover:text-rose group-focus-visible:text-rose">
                {title}
            </span>
            <span className="mt-1 line-clamp-2 block text-sm leading-snug text-ink/70">
                {description}
            </span>
        </button>
    );
}
