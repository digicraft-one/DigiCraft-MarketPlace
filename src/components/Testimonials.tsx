'use client'
import { motion } from 'framer-motion'
import { StarIcon } from '@heroicons/react/24/solid'
import Image from 'next/image'
import Link from 'next/link'

const testimonials = [
  {
    id: 1,
    content: "Working with this team was an absolute game-changer for our digital presence. Their attention to detail and creative solutions exceeded our expectations.",
    author: "Mukul Sinha",
    role: "Owner of M-Fest",
    rating: 5,
    image: "/testimonials/avatar1.png"
  },
  {
    id: 2,
    content: "The level of creativity and technical expertise they brought to our project was outstanding. They truly understand modern web development.",
    author: "Ayush Kumar Singh",
    role: "Owner of Codophile.in",
    rating: 5,
    image: "/testimonials/avatar1.png"
  },
  {
    id: 3,
    content: "Their innovative approach and dedication to delivering exceptional results made them the perfect partner for our digital transformation.",
    author: "Vikash Kumar",
    role: "Owner of Affestionary",
    rating: 4,
    image: "/testimonials/avatar3.png"
  }
]

interface TestimonialCardProps {
  content: string;
  author: string;
  role: string;
  rating: number;
  image: string;
  index: number;
}

const TestimonialCard = ({ content, author, role, rating, image, index }: TestimonialCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: index * 0.2 }}
    className="bg-gradient-to-br from-slate-900/50 to-transparent p-6 rounded-2xl backdrop-blur-sm border border-teal-500/20"
  >
    <div className="flex gap-4 items-center mb-4">
      <div className="relative w-12 h-12 rounded-full overflow-hidden">
        <Image
          src={image}
          alt={author}
          fill
          className="object-cover"
        />
      </div>
      <div>
        <h4 className="font-semibold text-white">{author}</h4>
        <p className="text-sm text-gray-400">{role}</p>
      </div>
    </div>
    <div className="flex gap-1 mb-4">
      {[...Array(rating)].map((_, i) => (
        <StarIcon key={i} className="w-5 h-5 text-yellow-500" />
      ))}
    </div>
    <p className="text-gray-300 leading-relaxed">{content}</p>
  </motion.div>
)

const Testimonials = () => {
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
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-cyan-500">
            What Our Clients Say
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Don&apos;t just take our word for it. Here&apos;s what our clients have to say about their experience working with us.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={testimonial.id} {...testimonial} index={index} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center mt-12"
        >
          <Link href={'/clients'} className="px-8 py-4 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full text-white font-semibold hover:shadow-lg hover:shadow-teal-500/25 transition-all">
            Read More Reviews
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

export default Testimonials 