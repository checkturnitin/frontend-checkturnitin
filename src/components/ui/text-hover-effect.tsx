"use client";
import React from "react";

export const TextHoverEffect = ({
  text,
  duration = 0.3,
}: {
  text: string;
  duration?: number;
}) => {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 1000 200"
      xmlns="http://www.w3.org/2000/svg"
      className="select-none"
    >
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        <linearGradient
          id="textGradient"
          gradientUnits="userSpaceOnUse"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="0%"
        >
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="25%" stopColor="#f87171" />
          <stop offset="50%" stopColor="#60a5fa" />
          <stop offset="75%" stopColor="#22d3ee" />
          <stop offset="100%" stopColor="#a78bfa" />
        </linearGradient>
      </defs>
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        stroke="url(#textGradient)"
        strokeWidth="0.7"
        className="fill-transparent font-[helvetica] text-8xl sm:text-6xl md:text-7xl lg:text-8xl font-bold"
        filter="url(#glow)"
      >
        {text}
      </text>
    </svg>
  );
};
