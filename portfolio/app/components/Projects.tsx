import ProjectCard from "./ProjectCard";

const projects = [
{
    title: "Project One",
    description: "description",
    image: "",
    technologies: ["tech1", "tech2"]
},
{
    title: "Project Two",
    description: "description",
    image: "",
    technologies: ["tech1", "tech2"]
},
{
    title: "Project Three",
    description: "description",
    image: "",
    technologies: ["tech1", "tech2"]
},
{
    title: "Project Four",
    description: "description",
    image: "",
    technologies: ["tech1", "tech2"]
},
]
export default function Projects(){
    return(
        <section id="projects" className="px-10 py-10 relative min-h-screen mx-auto">
            <h2>Projects</h2>
            <div className="grid grid-cols-2 gap-6">
                {projects.map((project) => (
                    <ProjectCard key={project.title} {...project} />
                ))}
            </div>
            <div className="mx-auto absolute bottom-0 left-0 right-0 h-px bg-grey"/>
        </section>
    )
}