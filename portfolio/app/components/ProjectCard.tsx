type ProjectCardProps = {
    title: string;
    description: string;
    image: string;
    technologies: string[];
};

export default function ProjectCard({
    title,
    description,
    image,
    technologies,
}: ProjectCardProps ) {
    return(
        <div className="group overflow-hidden rounded-2xl border border-gray-200 bg-white text-neutral-900 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
            {/* Image */}
            <div className="overflow-hidden">
                <img
                    src={image}
                    alt={title}
                    className="h-56 w-full object-cover"
                />
            </div>

            {/* Content */}
            <div className="space-y-4 p-6">
                <h3 className="text-2xl font-semibold">{title}</h3>

                <p className="text-gray-600">
                    {description}
                </p>

            {/* Tech Stack */}
            <div className="flex flex-wrap gap-2">
                {technologies.map((tech)=> (
                    <span key={tech}
                    className="rounded-full bg-pink-100 px-3 py-1 text-sm font-medium text-pink-700"
                    >
                        {tech}
                    </span>
                ))}
            </div>




            </div>

        </div>
    )
}