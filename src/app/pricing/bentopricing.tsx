import { FaDiscord, FaClipboardCheck, FaRobot, FaChartBar } from "react-icons/fa6"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface BentoDemoProps {
  onShowSignupForm: () => void
}

export function BentoDemo({ onShowSignupForm }: BentoDemoProps) {
  return (
    <div className="container mx-auto p-4 flex justify-center">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {/* CheckTurnitin Main Card */}
        <section className="md:col-span-2 relative group rounded-3xl bg-gradient-to-br from-blue-600 to-purple-600 overflow-hidden hover:shadow-2xl transition-all duration-500 hover:scale-[1.01]">
          <div className="relative p-10 h-full flex flex-col justify-between min-h-[40vh]">
            <div className="flex flex-col md:flex-row items-center gap-10">
              <div className="flex-1 space-y-6">
                <div className="space-y-4">
                  <h2 className="text-5xl font-bold text-white leading-tight text-center md:text-left">
                    CheckTurnitin
                  </h2>
                  <p className="text-xl text-gray-100 max-w-md leading-relaxed text-center md:text-left">
                    The most advanced and accurate Turnitin checker. Get 100% accurate plagiarism and AI detection
                    reports.
                  </p>
                </div>
                <div className="flex justify-center md:justify-start">
                  <Button
                    onClick={onShowSignupForm}
                    className="px-8 py-6 text-lg font-semibold bg-white text-blue-600 hover:bg-blue-50 transition-colors duration-300 rounded-full shadow-lg hover:shadow-xl"
                  >
                    Try CheckTurnitin For Free
                  </Button>
                </div>
              </div>
              <div className="relative w-[40vh] h-[40vh] rounded-2xl overflow-hidden shadow-xl group-hover:shadow-2xl transition-all duration-500">
                <Image
                  src="/assets/images/report1.png"
                  alt="CheckTurnitin Demo"
                  fill
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                  style={{ objectPosition: "center" }}
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        {/* Feature Cards */}
        {[
          {
            bg: "bg-emerald-500",
            title: "Plagiarism Detection",
            description: "Highly accurate plagiarism checking against billions of sources.",
            icon: <FaClipboardCheck size={48} className="mb-6" />,
            buttonText: "Learn More",
            link: "/plagiarism-detection",
          },
          {
            bg: "bg-amber-500",
            title: "AI Content Detection",
            description: "Advanced AI detection to identify machine-generated text.",
            icon: <FaRobot size={48} className="mb-6" />,
            buttonText: "Explore AI Detection",
            link: "/ai-detection",
          },
          {
            bg: "bg-violet-500",
            title: "Detailed Reports",
            description: "Comprehensive reports with similarity scores and source highlighting.",
            icon: <FaChartBar size={48} className="mb-6" />,
            buttonText: "View Sample Report",
            link: "/sample-report",
          },
          {
            bg: "bg-[#5865F2]",
            title: "Join Our Community",
            description: "Connect with users and get support on our Discord server.",
            icon: <FaDiscord size={48} className="mb-6" />,
            buttonText: "Join Discord",
            link: "https://discord.gg/R2zK3A5ftj",
          },
        ].map((card, index) => (
          <section
            key={index}
            className={`relative group rounded-3xl ${card.bg} overflow-hidden hover:shadow-2xl transition-all duration-500 hover:scale-[1.01]`}
          >
            <div className="relative p-10 h-full flex flex-col items-center justify-center text-white min-h-[40vh] text-center">
              {card.icon}
              <h3 className="text-2xl font-bold mb-4">{card.title}</h3>
              <p className="text-white/90 text-center mb-8 text-lg max-w-[80%] leading-relaxed">{card.description}</p>
              {card.link.startsWith("http") ? (
                <a href={card.link} target="_blank" rel="noopener noreferrer">
                  <Button className="px-6 py-2 text-sm font-medium bg-white text-blue-600 hover:bg-blue-50 transition-colors duration-300 rounded-full shadow-md hover:shadow-lg">
                    {card.buttonText}
                  </Button>
                </a>
              ) : (
                <Link href={card.link}>
                  <Button className="px-6 py-2 text-sm font-medium bg-white text-blue-600 hover:bg-blue-50 transition-colors duration-300 rounded-full shadow-md hover:shadow-lg">
                    {card.buttonText}
                  </Button>
                </Link>
              )}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}

