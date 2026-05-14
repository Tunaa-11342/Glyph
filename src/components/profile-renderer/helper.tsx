"use client";
import React, { memo } from "react";

interface AuroraTextProps {
    children: React.ReactNode;
    className?: string;
    colors?: string[];
    speed?: number;
}

export const AuroraText = memo(
    ({
        children,
        className = "",

        colors = ["#FF0080", "#7928CA", "#0070F3", "#38bdf8"],

        speed = 1,
    }: AuroraTextProps) => {
        const gradientStyle = {
            backgroundImage: `linear-gradient(135deg, ${colors.join(", ")}, ${colors[0]
                })`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",

            animationDuration: `${10 / speed}s`,
        };

        return (
            <span className={`relative inline-block ${className}`}>
                <span className="sr-only">{children}</span>

                <span
                    className="relative animate-aurora bg-[length:200%_auto] bg-clip-text text-transparent"
                    style={gradientStyle}
                    aria-hidden="true"
                >
                    {children}
                </span>
            </span>
        );
    }
);

AuroraText.displayName = "AuroraText";

export default function AuroraView() {
    return (
        <>
            <style>{`
        @keyframes aurora {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        /* The animation duration is now set via inline styles, so we don't need the --duration variable here. */
        .animate-aurora {
          animation-name: aurora;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-aurora { animation: none; }
        }
      `}</style>
        </>
    );
}

export const RainbowChar = memo(({
    children,
    index,
    totalLength,
    speed = 3
}: {
    children: string;
    index: number;
    totalLength: number;
    speed?: number;
}) => {
    return (
        <span
            style={{
                display: 'inline-block',
                color: `hsl(${(index / totalLength) * 360}, 100%, 65%)`,
                animation: `rainbowMove ${speed}s linear infinite`,
                animationDelay: `${-index * 0.2}s`,
            }}
        >
            {children === ' ' ? '\u00A0' : children}
        </span>
    );
});

// Thêm keyframes
const rainbowStyles = `
  @keyframes rainbowMove {
    0% { color: hsl(0, 100%, 65%); }
    100% { color: hsl(360, 100%, 65%); }
  }
`;

if (typeof document !== 'undefined') {
    const styleSheet = document.createElement("style");
    styleSheet.textContent = rainbowStyles;
    document.head.appendChild(styleSheet);
}