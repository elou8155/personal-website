import ProjectCard from "./ProjectCard";

const projects = [
{
    title: "RAG Chatbot for HPC User Support",
    description: "description",
    image: "",
    technologies: ["RAG", "Python", "PyTorch", "Flask", "REST API", "LangChain","vLLM", "FAISS", "Intel oneAPI"]
},
{
    title: "Finch",
    description: "Won best AggieX Startup @ TAMU Build4Good 2026",
    image: "/images/finch_image.jpg",
    technologies: ["React", "Next.js", "Typescript", "Tailwind CSS"]
},
{
    title: "ML Neural Signal Classifier",
    description: "LSTM-based deep learning model to classify cognitive states from neural signals",
    image: "/images/neural_signals.png",
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
        <section id="projects" className="px-10 py-10 mx-auto">
            <h1>Personal Project Portfolio</h1>
            <div className="grid grid-cols-2 gap-6">
                {projects.map((project) => (
                    <ProjectCard key={project.title} {...project} />
                ))}
            </div>
        </section>
    )
}