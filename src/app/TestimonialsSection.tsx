"use client";

import type React from "react";
import { motion } from "framer-motion";
import { CardStack } from "@/components/ui/card-stack";
import { cn } from "@/lib/utils";

const TestimonialsSection: React.FC = () => {
  return (
    <section className="mt-20 py-16 bg-gradient-to-b from-gray-50 to-white dark:from-black dark:to-black">
      <div className="max-w-6xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <motion.h2
          className="text-3xl sm:text-4xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          What Our Users Say
        </motion.h2>
        <motion.p
          className="text-lg sm:text-xl mb-12 max-w-2xl mx-auto text-gray-700 dark:text-gray-300"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Hear from our satisfied users about their experience with our Turnitin report service.
        </motion.p>
        <CardStackDemo />
      </div>
    </section>
  );
};

// CardStackDemo Component
function CardStackDemo() {
  return (
    <div className="h-80 flex items-center justify-center w-full">
      <CardStack items={CARDS} />
    </div>
  );
}

// Highlight Utility
const Highlight = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return (
    <span
      className={cn(
        "font-semibold bg-indigo-200 dark:bg-indigo-700/[0.2] text-indigo-700 dark:text-indigo-500 px-1 py-0.5 rounded-md",
        className
      )}
    >
      {children}
    </span>
  );
};

// Testimonial Cards Data
const CARDS = [
  {
    id: 0,
    name: "Sarah Johnson",
    designation: "University Student",
    content: (
      <p>
        The Turnitin report I received was incredibly detailed and accurate. It
        helped me ensure my paper was{" "}
        <Highlight>100% original and plagiarism-free</Highlight>. Highly
        recommend this service!
      </p>
    ),
  },
  {
    id: 1,
    name: "Michael Brown",
    designation: "Research Scholar",
    content: (
      <p>
        I was amazed by how quickly I got my report. The analysis was thorough,
        and it gave me peace of mind knowing my work was{" "}
        <Highlight>authentic and properly cited</Highlight>.
      </p>
    ),
  },
  {
    id: 2,
    name: "Emily Davis",
    designation: "High School Teacher",
    content: (
      <p>
        As a teacher, I rely on Turnitin to check my students' work. The reports
        are always reliable and help me ensure{" "}
        <Highlight>academic integrity</Highlight> in my classroom.
      </p>
    ),
  },
  {
    id: 3,
    name: "David Wilson",
    designation: "Content Writer",
    content: (
      <p>
        I use Turnitin to verify the originality of my articles before
        submission. The service is fast, accurate, and{" "}
        <Highlight>extremely easy to use</Highlight>.
      </p>
    ),
  },
  {
    id: 4,
    name: "Laura Martinez",
    designation: "PhD Candidate",
    content: (
      <p>
        Turnitin has been a lifesaver for my thesis. The detailed similarity
        report helped me identify and fix any unintentional{" "}
        <Highlight>plagiarism issues</Highlight> before submission.
      </p>
    ),
  },
];

export default TestimonialsSection;