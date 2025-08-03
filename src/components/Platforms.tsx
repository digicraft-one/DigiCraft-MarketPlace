'use client'
import { motion } from 'framer-motion'
import { 
  DevicePhoneMobileIcon, 
  ComputerDesktopIcon, 
  GlobeAltIcon, 
  DeviceTabletIcon 
} from '@heroicons/react/24/outline'

const platforms = [
  {
    id: 1,
    name: "Web Applications",
    icon: GlobeAltIcon,
    description: "Responsive web applications that work seamlessly across all browsers and devices.",
    features: [
      "Cross-browser compatibility",
      "Mobile-first design",
      "SEO optimization",
      "Fast loading times",
      "Progressive Web Apps"
    ],
    color: "from-teal-500 to-cyan-500"
  },
  {
    id: 2,
    name: "Android Apps",
    icon: DevicePhoneMobileIcon,
    description: "Native Android applications built with modern development practices.",
    features: [
      "Material Design UI",
      "Offline functionality",
      "Push notifications",
      "Google Play Store ready",
      "Performance optimized"
    ],
    color: "from-cyan-500 to-blue-500"
  },
  {
    id: 3,
    name: "iOS Applications",
    icon: DeviceTabletIcon,
    description: "Premium iOS applications designed for iPhone and iPad users.",
    features: [
      "Apple Human Interface Guidelines",
      "iCloud integration",
      "App Store optimization",
      "Touch-friendly interface",
      "iOS ecosystem integration"
    ],
    color: "from-blue-500 to-sky-500"
  },
  {
    id: 4,
    name: "Desktop Applications",
    icon: ComputerDesktopIcon,
    description: "Cross-platform desktop applications for Windows, macOS, and Linux.",
    features: [
      "Cross-platform compatibility",
      "Native performance",
      "System integration",
      "Offline capabilities",
      "Auto-updates"
    ],
    color: "from-sky-500 to-teal-500"
  }
]

interface PlatformCardProps {
  name: string
  icon: any
  description: string
  features: string[]
  color: string
  index: number
}

const PlatformCard = ({ name, icon: Icon, description, features, color, index }: PlatformCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: index * 0.2 }}
    className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900/50 to-transparent backdrop-blur-sm border border-teal-500/20 p-6"
  >
    <div className="flex items-start gap-4 mb-6">
      <div className={`p-3 rounded-xl bg-gradient-to-r ${color} shadow-lg`}>
        <Icon className="w-8 h-8 text-white" />
      </div>
      <div>
        <h3 className="text-xl font-bold text-white mb-2">{name}</h3>
        <p className="text-gray-400 text-sm">{description}</p>
      </div>
    </div>
    
    <div className="space-y-3">
      {features.map((feature, i) => (
        <div key={i} className="flex items-center gap-3">
          <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${color}`} />
          <span className="text-sm text-gray-300">{feature}</span>
        </div>
      ))}
    </div>

    {/* <div className="mt-6 pt-4 border-t border-teal-500/20">
      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r ${color} hover:shadow-lg transition-all`}>
        Learn More
        <motion.div
          className="w-4 h-4"
          animate={{ x: [0, 5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          →
        </motion.div>
      </div>
    </div> */}
  </motion.div>
)

const Platforms = () => {
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
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-blue-500">
            Platforms We Support
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            From web applications to mobile apps, we create solutions for every platform. 
            Your business deserves to be everywhere your customers are.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {platforms.map((platform, index) => (
            <PlatformCard key={platform.id} {...platform} index={index} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-slate-900/50 to-transparent backdrop-blur-sm border border-teal-500/20 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-4">
              Need a Custom Solution?
            </h3>
            <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
              We also specialize in custom development for specific platforms and requirements. 
              Let's discuss your unique needs and create a tailored solution.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full text-white font-semibold hover:shadow-lg hover:shadow-teal-500/25 transition-all">
                Get Custom Quote
              </button>
              <button className="px-8 py-4 border border-teal-400 rounded-full text-teal-400 font-semibold hover:bg-teal-500/10 transition-all">
                Schedule Consultation
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Platforms 