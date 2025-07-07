import { InputHTMLAttributes, ReactNode } from "react";

interface IconInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon: ReactNode;
}

const IconInput = ({
  label,
  icon,
  id,
  className = "",
  ...props
}: IconInputProps) => (
  <div>
    <label
      htmlFor={id}
      className="block text-sm font-medium text-gray-300 mb-2"
    >
      {label}
    </label>
    <div className="relative">
      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400">
        {icon}
      </span>
      <input
        id={id}
        className={`w-full pl-10 pr-4 py-3 bg-black/20 border border-gray-600 rounded-lg focus:border-cyber-blue focus:outline-none focus:ring-2 focus:ring-cyber-blue/20 text-white placeholder-gray-400 ${className}`}
        {...props}
      />
    </div>
  </div>
);

export default IconInput;