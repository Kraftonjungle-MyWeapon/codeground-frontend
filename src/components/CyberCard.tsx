import React from "react";
import { cn } from "@/lib/utils";

interface CyberCardProps {
  children: React.ReactNode;
  className?: string;
  glowing?: boolean;
  animated?: boolean;
}

const CyberCard = ({
  children,
  className,
  glowing = false,
  animated = false,
}: CyberCardProps) => {
  return (
    <div
      className={cn(
        "cyber-card p-6 transition-all duration-300 hover:shadow-lg hover:border-cyber-blue/40",
        glowing && "glow-border",
        animated && "hover:scale-105 transform",
        className,
      )}
    >
      {children}
    </div>
  );
};

export default CyberCard;
