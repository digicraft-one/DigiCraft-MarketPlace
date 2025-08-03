'use client'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'

const technologies = [
  {
    category: "Frontend",
    techs: [
      { name: "React", icon: "/tech/react.png", level: 95 },
      { name: "Next.js", icon: "/tech/nextjs.png", level: 90 },
      { name: "TypeScript", icon: "/tech/typescript.png", level: 85 },
      { name: "Tailwind", icon: "/tech/tailwind.svg", level: 95 },
    ]
  },
  {
    category: "Backend",
    techs: [
      { name: "Node.js", icon: "/tech/nodejs.png", level: 90 },
      { name: "Python", icon: "/tech/python.png", level: 85 },
      { name: "MongoDB", icon: "/tech/mongodb.png", level: 88 },
      { name: "PostgreSQL", icon: "/tech/postgresql.png", level: 85 },
    ]
  },
  {
    category: "Tools & Platforms",
    techs: [
      { name: "AWS", icon: "/tech/aws.png", level: 82 },
      { name: "Docker", icon: "/tech/docker.png", level: 80 },
      { name: "Git", icon: "/tech/git.png", level: 92 },
      { name: "Figma", icon: "/tech/figma.png", level: 88 },
    ]
  }
]

const TechCard = ({ name, icon, level }: { name: string; icon: string; level: number }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="bg-gradient-to-br from-slate-900/50 to-transparent p-4 rounded-xl backdrop-blur-sm border border-teal-500/20"
  >
    <div className="flex items-center gap-4 mb-3">
      <div className="relative w-10 h-10">
        <Image
          src={icon}
          alt={name}
          fill
          className="object-contain"
        />
      </div>
      <h4 className="font-semibold text-white">{name}</h4>
    </div>
    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        whileInView={{ width: `${level}%` }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="h-full bg-gradient-to-r from-teal-500 to-cyan-500"
      />
    </div>
    <span className="text-sm text-gray-400 mt-1 block">{level}% Proficiency</span>
  </motion.div>
)

const TechStack = () => {
  return (
    <section className="py-20 px-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-black to-slate-900/50 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(20,184,166,0.05)_0%,transparent_100%)]" />
      
      <div className="max-w-7xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-cyan-500">
            Our Tech Stack
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            We use cutting-edge technologies to build scalable and performant solutions.
            Our expertise spans across various domains of modern software development.
          </p>
        </motion.div>

        <div className="space-y-16">
          {technologies.map((category, categoryIndex) => (
            <motion.div
              key={category.category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: categoryIndex * 0.2 }}
            >
              <h3 className="text-2xl font-semibold mb-6 text-center md:text-left">
                <span className="text-teal-400">/</span> {category.category}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {category.techs.map((tech, index) => (
                  <TechCard key={index} {...tech} />
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center mt-16"
        >
          <p className="text-gray-400 mb-8">
            Need a custom technology stack for your project?
          </p>
          <Link href="/contact" className="px-8 py-4 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full text-white font-semibold hover:shadow-lg hover:shadow-teal-500/25 transition-all">
            Let&apos;s Discuss Your Requirements
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

export default TechStack 