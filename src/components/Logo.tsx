import React from "react";

interface LogoProps {
  className?: string;
  alt?: string;
}

const Logo: React.FC<LogoProps> = ({ className = "h-16 w-auto", alt = "Codeground Logo" }) => (
  <img
    src="/lovable-uploads/af0ff57a-93d9-40b0-a0ff-1f22a23418ce.png"
    alt={alt}
    className={`${className} select-none pointer-events-none`}
    draggable="false"
  />
);

export default Logo;