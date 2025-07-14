import React from "react";
import { cn } from "@/lib/utils";

interface CyberButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "destructive";
  size?: "sm" | "md" | "lg";
  loading?: boolean; // Add loading prop
}

const CyberButton = React.forwardRef<
  HTMLButtonElement,
  CyberButtonProps
>(({ className, variant = "primary", size = "md", loading, ...props }, ref) => {
  const baseClasses = "cyber-button flex items-center justify-center gap-2";

  const variantClasses = {
    primary: "from-cyber-blue to-cyber-purple",
    secondary: "from-gray-600 to-gray-700",
    danger: "from-red-500 to-red-600",
    destructive: "from-red-600 to-red-700",
  };

  const sizeClasses = {
    sm: "py-2 px-4 text-sm",
    md: "py-3 px-6 text-base",
    lg: "py-4 px-8 text-lg",
  };

  return (
    <button
      ref={ref}
      {...(props.disabled || loading ? { disabled: true } : {})}
      className={cn(
        baseClasses,
        `bg-gradient-to-r ${variantClasses[variant]}`,
        sizeClasses[size],
        (props.disabled || loading) && "opacity-50 cursor-not-allowed",
        className
      )}
      {...props}
    />
  );
});

CyberButton.displayName = "CyberButton";

export default CyberButton;
