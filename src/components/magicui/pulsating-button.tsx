import React from "react"

import { cn } from "@/lib/utils"

interface PulsatingButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  pulseColor?: string
  duration?: string
}

export const PulsatingButton = React.forwardRef<
  HTMLButtonElement,
  PulsatingButtonProps
>(
  (
    {
      className,
      children,
      pulseColor = "99,102,241",
      duration = "1.75s",
      ...props
    },
    ref,
  ) => {
    const baseColor = pulseColor.startsWith("#")
      ? pulseColor
      : `rgb(${pulseColor})`

    return (
      <button
        ref={ref}
        className={cn(
          "relative inline-flex items-center justify-center rounded-full px-8 py-3 text-base font-semibold text-white shadow-lg shadow-indigo-500/40 transition-transform duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950",
          "bg-gradient-to-r from-indigo-500 via-indigo-600 to-indigo-700 hover:scale-[1.02]",
          className,
        )}
        {...props}
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 rounded-full opacity-30 blur-2xl"
          style={{
            background: baseColor,
            animation: `magicui-pulse-glow ${duration} ease-in-out infinite`,
          }}
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 rounded-full opacity-20 blur-3xl"
          style={{
            background: baseColor,
            animation: `magicui-pulse-glow ${duration} ease-in-out infinite`,
            animationDelay: `calc(${duration} / 2)`,
          }}
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-full border border-white/25"
        />
        <span className="relative z-10 flex items-center gap-2">
          {children}
        </span>
      </button>
    )
  },
)

PulsatingButton.displayName = "PulsatingButton"

