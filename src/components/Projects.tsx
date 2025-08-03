'use client'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRightIcon } from '@heroicons/react/24/outline'

const projects = [
  {
    id: 1,
    title: "M-Fest",
    category: "App Development",
    image: "/projects/project1.jpg",
    tech: ["Flutter", "Express", "Firebase"],
  },
  {
    id: 2,
    title: "Codophile.in",
    category: "Web Development",
    image: "/projects/project2.png",
    tech: ["Django", "Python", "MySQL"],
  },
  {
    id: 3,
    title: "Affestionary",
    category: "Full Stack Application",
    image: "/projects/project3.png",
    tech: ["React", "Node.js", "MongoDB"],
  }
]

interface ProjectCardProps {
  title: string;
  category: string;
  image: string;
  tech: string[];
  index: number;
}

const ProjectCard = ({ title, category, image, tech, index }: ProjectCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: index * 0.2 }}
    className="group relative overflow-hidden rounded-xl"
  >
    <div className="relative h-[300px] w-full overflow-hidden">
      <Image
        src={image}
        alt={title}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
    </div>
    
    <div className="absolute bottom-0 left-0 right-0 p-6">
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-gray-300 mb-3">{category}</p>
      <div className="flex gap-2 flex-wrap">
        {tech.map((item: string) => (
          <span 
            key={item}
            className="text-sm px-3 py-1 bg-white/10 rounded-full text-gray-300"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
    
    <div className="absolute inset-0 bg-teal-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
  </motion.div>
)

const Projects = () => {
  return (
    <section className="py-20 px-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 to-black pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(20,184,166,0.05)_0%,transparent_100%)]" />
      
      <div className="max-w-7xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-cyan-500">
            Recent Projects
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Explore our latest work and see how we&apos;ve helped our clients achieve their digital goals.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {projects.map((project, index) => (
            <ProjectCard key={project.id} {...project} index={index} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center"
        >
          <Link href="/projects">
            <motion.button
              className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full text-white font-semibold hover:shadow-lg hover:shadow-teal-500/25 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              View All Projects
              <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

export default Projects 