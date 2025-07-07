import { ReactNode } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SelectFieldProps {
  label: string;
  icon: ReactNode;
  options: string[];
  placeholder: string;
  onValueChange: (value: string) => void;
}

const SelectField = ({
  label,
  icon,
  options,
  placeholder,
  onValueChange,
}: SelectFieldProps) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-gray-300">{label}</label>
    <Select onValueChange={onValueChange}>
      <SelectTrigger className="w-full bg-black/20 border-gray-600 text-white">
        <div className="flex items-center space-x-2">
          {icon}
          <SelectValue placeholder={placeholder} />
        </div>
      </SelectTrigger>
      <SelectContent className="bg-cyber-darker border-gray-600">
        {options.map((opt) => (
          <SelectItem
            key={opt}
            value={opt}
            className="text-white hover:bg-cyber-blue/20"
          >
            {opt}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
);

export default SelectField;