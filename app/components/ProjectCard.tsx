import Image from "next/image";

export type Project = {
    title: string;
    description: string; // short; shown on the tile
    image: string; // leave "" for a project that has no picture yet
    technologies: string[];
    details?: string; // longer text for the popup (falls back to the description)
    links?: {label: string; href: string}[]; // e.g. GitHub or a live demo
};

type ProjectCardProps = {
    project: Project;
    onOpen: () => void;
};

// One tile of the project grid. The picture is the background, with the title and
// a short description over it. Hovering shrinks the tile inward a little and tints
// it rose; clicking opens the project's popup.
export default function ProjectCard({project, onOpen}: ProjectCardProps) {
    const {title, description, image} = project;

    return (
        <button
            type="button"
            onClick={onOpen}
            aria-haspopup="dialog"
            className="group relative block aspect-[4/3] w-full overflow-hidden bg-white text-center transition-transform duration-200 ease-out hover:scale-90 focus-visible:scale-95 focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-rose motion-reduce:transition-none motion-reduce:hover:scale-100 motion-reduce:focus-visible:scale-100"
        >
            {image && (
                <>
                    {/* The tile's own name is the text below, so the picture is decoration */}
                    <Image
                        src={image}
                        alt=""
                        fill
                        sizes="(min-width: 640px) 384px, 100vw"
                        className="object-cover"
                    />
                    {/* A flat, even dark tint (not a gradient) so white text reads on light pictures */}
                    <span aria-hidden="true" className="absolute inset-0 bg-black/10" />
                </>
            )}

            {/* Rose tint, shown on hover and keyboard focus */}
            <span
                aria-hidden="true"
                className="absolute inset-0 bg-rose/80 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100"
            />

            <span className="absolute inset-0 flex flex-col items-center justify-center p-5 text-blue">
                <span className="block text-3xl font-extrabold leading-snug ">
                    {title}
                </span>
                <span className="mt-1 line-clamp-2 text-xl font-semibold leading-snug text-black">
                    {description}
                </span>
            </span>
        </button>
    );
}
