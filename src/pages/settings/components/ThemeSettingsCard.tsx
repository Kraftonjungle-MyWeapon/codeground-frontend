import CyberCard from "@/components/CyberCard";
import { Palette } from "lucide-react";

interface Props {
  selectedTheme: string;
  onThemeChange: (theme: string) => void;
}

const ThemeSettingsCard = ({ selectedTheme, onThemeChange }: Props) => (
  <CyberCard>
    <h2 className="text-xl font-bold text-cyber-blue mb-4 flex items-center">
      <Palette className="mr-2 h-5 w-5" />
      테마 설정
    </h2>
    <div className="space-y-4">
      <div className="p-3 bg-black/20 rounded-lg">
        <h3 className="font-semibold text-white mb-3">테마 선택</h3>
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => onThemeChange("cyber")}
            className={`aspect-square bg-gradient-to-br from-cyber-blue to-cyber-purple rounded-lg border-2 ${
              selectedTheme === "cyber" ? "border-cyber-blue" : "border-transparent"
            } flex items-center justify-center transition-all`}
          >
            <span className="text-xs text-white font-medium">사이버</span>
          </button>
          <button
            onClick={() => onThemeChange("dark")}
            className={`aspect-square bg-gradient-to-br from-gray-700 to-gray-900 rounded-lg border-2 ${
              selectedTheme === "dark" ? "border-gray-400" : "border-transparent"
            } flex items-center justify-center transition-all`}
          >
            <span className="text-xs text-white font-medium">어둠</span>
          </button>
          <button
            onClick={() => onThemeChange("classic")}
            className={`aspect-square bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg border-2 ${
              selectedTheme === "classic" ? "border-blue-400" : "border-transparent"
            } flex items-center justify-center transition-all`}
          >
            <span className="text-xs text-white font-medium">클래식</span>
          </button>
        </div>
      </div>
    </div>
  </CyberCard>
);

export default ThemeSettingsCard;