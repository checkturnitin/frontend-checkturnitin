"use client";

import React from "react";
import { motion } from "framer-motion";
import { FaDiscord } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MagicCard } from "@/components/ui/magic-card";
import { useTheme } from "next-themes";

const DiscordPromo: React.FC = () => {
  const { theme } = useTheme();

  const handleDiscordButtonClick = () => {
    window.open("https://discord.gg/QqqRdN9He3", "_blank");
  };

  return (
    <Card>
      <MagicCard gradientColor={theme === "dark" ? "#262626" : "#D9D9D955"} className="flex flex-col items-center">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Join Our Community!</CardTitle>
          <CardDescription>
            Join our Discord server and get{" "}
            <span className="font-bold text-lg">more free credits</span> to use
            on CheckTurnitin.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <motion.div
            className="flex justify-center mt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <Button
              onClick={handleDiscordButtonClick}
              className="relative inline-flex items-center px-6 py-3 text-white bg-indigo-600 hover:bg-indigo-700 rounded-full shadow-md transition-transform duration-300 ease-in-out transform hover:scale-105"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-400 to-purple-600 opacity-50 rounded-full blur-md pointer-events-none"></span>
              <FaDiscord className="mr-2 z-10" size={20} />
              <span className="relative z-10 text-lg font-semibold">Join Discord</span>
            </Button>
          </motion.div>
        </CardContent>
        <CardFooter>
          <p className="text-center text-sm text-gray-500">
            Become part of our vibrant community today!
          </p>
        </CardFooter>
      </MagicCard>
    </Card>
  );
};

export default DiscordPromo;