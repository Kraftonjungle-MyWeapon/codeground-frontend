import { Loader } from "lucide-react";

const CyberLoadingSpinner = () => {
  return (
    <div className="min-h-screen cyber-grid flex items-center justify-center">
      <div className="text-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-cyber-blue/20 border-t-cyber-blue rounded-full animate-spin mx-auto mb-4"></div>
          <div
            className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-cyber-purple rounded-full animate-spin mx-auto"
            style={{ animationDirection: "reverse", animationDuration: "1.5s" }}
          ></div>
        </div>
        <div className="flex items-center justify-center space-x-2">
          <Loader className="h-5 w-5 text-cyber-blue animate-spin" />
          <span className="text-cyber-blue font-bold text-lg animate-pulse">
            로딩 중...
          </span>
        </div>
        <div className="mt-4">
          <div className="w-32 h-1 bg-gray-700 rounded-full mx-auto overflow-hidden">
            <div className="h-full bg-gradient-to-r from-cyber-blue to-cyber-purple rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CyberLoadingSpinner;
