'use client'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

// Background Components
const GradientOrbs = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl" />
    <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl" />
    <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl" />
  </div>
)

const GridBackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
    <div className="absolute inset-0"
      style={{
        backgroundImage: `linear-gradient(90deg, rgba(20,184,166,0.1) 1px, transparent 1px),
                         linear-gradient(rgba(20,184,166,0.1) 1px, transparent 1px)`,
        backgroundSize: '4rem 4rem',
      }}
    />
  </div>
)

// FAQ Data
const faqData = [
  {
    category: "General",
    questions: [
      {
        question: "What is DigiCraft Marketplace?",
        answer: "DigiCraft Marketplace is a platform where you can purchase ready-made software solutions with customization options. We offer various software products including e-commerce stores, portfolio websites, landing pages, and custom web applications that can be modified to suit your specific needs."
      },
      {
        question: "How does the marketplace work?",
        answer: "Browse our collection of software products, choose the one that fits your requirements, select a pricing plan (Base, Plus, Pro, or Ultimate), and make your purchase. You'll receive the complete source code and documentation to deploy and customize the software for your business."
      },
      {
        question: "What's the difference between resell and ultimate plans?",
        answer: "Resell plans (Base, Plus, Pro) provide you with the software source code and limited customization options. The Ultimate plan is a complete freelance service where we develop a custom solution specifically for your business needs, with full source code ownership and dedicated support."
      }
    ]
  },
  {
    category: "Pricing & Plans",
    questions: [
      {
        question: "What do I get with each pricing plan?",
        answer: "Base plan includes logo updates, 1 week support, brand modifications, and analytics. Plus plan adds UI/UX redesign and email marketing. Pro plan includes social media integration, SEO optimization, and additional features. Ultimate plan offers complete custom development with full source code and dedicated support."
      },
      {
        question: "Are there any recurring fees?",
        answer: "No, all our marketplace products are one-time purchases. You own the source code and can use it indefinitely. The Ultimate plan is a custom development service with a single project fee."
      },
      {
        question: "Do you offer refunds?",
        answer: "We offer a 7-day money-back guarantee for all resell plans. If you're not satisfied with your purchase, contact our support team within 7 days for a full refund. Ultimate plan terms are discussed during the consultation phase."
      }
    ]
  },
  {
    category: "Technical Support",
    questions: [
      {
        question: "What kind of support do you provide?",
        answer: "For resell plans, we provide email support for 1 week (Base), 2 weeks (Plus), and 1 month (Pro). Ultimate plan includes dedicated support throughout the development process and 3 months post-launch support."
      },
      {
        question: "Do you help with deployment?",
        answer: "Yes, we provide detailed deployment guides with each purchase. For Plus and Pro plans, we also offer basic deployment assistance. Ultimate plan includes full deployment support and hosting setup."
      },
      {
        question: "Can I modify the code myself?",
        answer: "Absolutely! You receive the complete source code and have full rights to modify it. We provide documentation and comments in the code to help you understand the structure and make customizations."
      }
    ]
  },
  {
    category: "Customization & Features",
    questions: [
      {
        question: "How much can I customize the software?",
        answer: "Base plan allows logo and brand modifications. Plus plan includes UI/UX redesign. Pro plan allows feature additions and integrations. Ultimate plan offers complete custom development from scratch based on your requirements."
      },
      {
        question: "Do you add new features to existing products?",
        answer: "Yes, we regularly update our products with new features and improvements. Pro plan customers get priority access to new features, and Ultimate plan customers can request specific features during development."
      },
      {
        question: "Can I integrate third-party services?",
        answer: "Yes, all plans support third-party integrations. Pro plan includes pre-configured integrations for popular services. Ultimate plan allows custom integrations based on your specific needs."
      }
    ]
  },
  {
    category: "Legal & Licensing",
    questions: [
      {
        question: "What are the licensing terms?",
        answer: "You receive a commercial license to use the software for your business. You can modify, deploy, and use it for multiple projects. Ultimate plan includes full ownership and commercial rights to the custom solution."
      },
      {
        question: "Can I resell the software to my clients?",
        answer: "Resell plans are for your own business use. If you want to resell to clients, you'll need to contact us for a reseller license or consider the Ultimate plan for custom development services."
      },
      {
        question: "Is the code secure and well-documented?",
        answer: "Yes, all our code follows security best practices and includes comprehensive documentation. We use modern frameworks and libraries, and provide detailed setup and customization guides."
      }
    ]
  }
]

interface FAQItemProps {
  question: string
  answer: string
  isOpen: boolean
  onToggle: () => void
}

const FAQItem = ({ question, answer, isOpen, onToggle }: FAQItemProps) => {
  return (
    <div className="border border-teal-500/20 rounded-xl overflow-hidden bg-slate-900/50">
      <button
        onClick={onToggle}
        className="w-full p-6 flex items-center justify-between text-left hover:bg-slate-800/30 transition-colors"
      >
        <h3 className="text-lg font-semibold text-white pr-4">{question}</h3>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <ChevronDownIcon className="w-5 h-5 text-teal-400 flex-shrink-0" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ 
              duration: 0.3, 
              ease: "easeInOut",
              height: { duration: 0.3, ease: "easeInOut" },
              opacity: { duration: 0.2, ease: "easeInOut" }
            }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 pt-2">
              <p className="text-gray-300 leading-relaxed">{answer}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function FAQPage() {
  const { scrollYProgress } = useScroll()
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])
  const [openItems, setOpenItems] = useState<{ [key: string]: boolean }>({})

  const toggleItem = (categoryIndex: number, questionIndex: number) => {
    const key = `${categoryIndex}-${questionIndex}`
    setOpenItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  return (
    <main className="relative">
      {/* Background Elements */}
      <motion.div
        className="fixed inset-0 bg-[radial-gradient(circle_at_center,rgba(20,184,166,0.05)_0%,transparent_100%)]"
        style={{ y }}
      />
      <GradientOrbs />
      <GridBackground />

      {/* Content */}
      <div className="relative">
        <Navbar />

        {/* Header */}
        <section className="pt-32 pb-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl font-bold text-white mb-6">
                Frequently Asked Questions
              </h1>
              <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
                Everything you need to know about DigiCraft Marketplace, our software products, and how we can help bring your digital ideas to life.
              </p>
            </motion.div>
          </div>
        </section>

        {/* FAQ Content */}
        <section className="px-4 pb-16">
          <div className="max-w-4xl mx-auto">
            <div className="space-y-12">
              {faqData.map((category, categoryIndex) => (
                <motion.div
                  key={category.category}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
                >
                  <h2 className="text-2xl font-bold text-white mb-6 text-center">
                    {category.category}
                  </h2>
                  <div className="space-y-4">
                    {category.questions.map((item, questionIndex) => (
                      <FAQItem
                        key={questionIndex}
                        question={item.question}
                        answer={item.answer}
                        isOpen={openItems[`${categoryIndex}-${questionIndex}`] || false}
                        onToggle={() => toggleItem(categoryIndex, questionIndex)}
                      />
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Contact Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-16 text-center"
            >
              <div className="bg-gradient-to-r from-teal-500/10 to-blue-500/10 border border-teal-500/20 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-white mb-4">
                  Still Have Questions?
                </h3>
                <p className="text-gray-400 mb-6">
                  Can't find the answer you're looking for? Our team is here to help.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                    href="mailto:support@digicraft.one"
                    className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-teal-500 to-blue-500 text-white font-semibold rounded-full hover:shadow-lg transition-all"
                  >
                    Contact Support
                  </a>
                  <a
                    href="https://digicraft.one"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-6 py-3 bg-slate-800/50 text-white border border-teal-500/30 font-semibold rounded-full hover:border-teal-500/60 transition-all"
                  >
                    Visit DigiCraft
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <Footer />
      </div>
    </main>
  )
}