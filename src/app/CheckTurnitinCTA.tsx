"use client";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { InteractiveGridPattern } from "@/components/ui/interactive-grid-pattern";

export default function CheckTurnitinCTA() {
  return (
    <div className="relative mx-0 pb-[18vh] pt-[15vh] md:mx-[4%] md:rounded-3xl xl:mx-[6%] dark:bg-black dark:text-white">
      {/* Interactive Grid Pattern as Full-Width Background */}
      <div className="absolute inset-0 z-0 w-full h-full">
        <InteractiveGridPattern
          className={cn(
            "w-full h-full",
            "[mask-image:radial-gradient(400px_circle_at_center,white,transparent)]"
          )}
          width={40} // Adjusted for better visual effect
          height={40}
          squares={[80, 80]}
          squaresClassName="hover:fill-blue-500 transition-colors duration-300"
        />
      </div>

      {/* Card Content */}
      <Card className="relative z-10 flex flex-col items-center justify-center p-6 md:p-10 bg-white/90 dark:bg-black/80 backdrop-blur sm:flex sm:justify-center sm:items-center sm:rounded-xl">
        <div className="text-center text-3xl font-bold md:text-4xl text-gray-900 dark:text-white">
          Get 100% Accurate Check with Turnitin
        </div>
        <CardContent className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-4 md:mt-4">
          <div className="flex items-center gap-2">
            <svg
              className="text-indigo-600"
              height="1.2em"
              width="1.2em"
              viewBox="0 0 512 512"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z" />
            </svg>
            <div className="text-gray-700 dark:text-gray-300 text-lg">AI & Plagiarism Report</div>
          </div>
          <div className="flex items-center gap-2">
            <svg
              className="text-indigo-600"
              height="1.2em"
              width="1.2em"
              viewBox="0 0 512 512"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z" />
            </svg>
            <div className="text-gray-700 dark:text-gray-300 text-lg">Instant Results</div>
          </div>
        </CardContent>
        <CardContent className="mt-10 md:mt-8 flex flex-wrap justify-center gap-6">
          {/* Get Free Turnitin AI & Plag Check Button */}
          <a href="/free-check">
            <button className="px-8 py-3 border-2 border-indigo-600 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 hover:border-indigo-700 transition-transform duration-300 transform hover:scale-105 active:scale-100">
              Get Free Turnitin AI & Plag Check
            </button>
          </a>

          {/* Join Discord Button */}
          <a href="https://discord.gg/R2zK3A5ftj/">
            <button className="px-8 py-3 border-2 border-indigo-600 rounded-lg bg-white dark:bg-gray-800 text-indigo-600 font-semibold hover:bg-indigo-50 dark:hover:bg-gray-700 transition-transform duration-300 transform hover:scale-105 active:scale-100 flex items-center gap-2">
              <svg
                className="text-indigo-600 dark:text-indigo-400"
                height="1.2em"
                width="1.2em"
                viewBox="0 0 127.14 96.36"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83A72.37,72.37,0,0,0,45.64,0A105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36A77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z" fill="currentColor" />
              </svg>
              Join Discord
            </button>
          </a>
        </CardContent>
      </Card>
    </div>
  );
}