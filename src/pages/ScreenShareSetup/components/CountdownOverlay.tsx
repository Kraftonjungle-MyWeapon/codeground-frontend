import React from "react";

interface CountdownOverlayProps {
  countdown: number;
}

const CountdownOverlay: React.FC<CountdownOverlayProps> = ({ countdown }) => {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center animate-fade-in">
      <div className="text-center">
        <div className="text-8xl font-bold neon-text mb-4 animate-bounce">
          <span
            key={countdown}
            className="inline-block animate-pulse"
            style={{
              animation: "pulse 0.5s ease-in-out, bounce 0.6s ease-in-out",
              textShadow:
                "0 0 30px rgba(0, 200, 255, 0.8), 0 0 60px rgba(0, 200, 255, 0.6)",
            }}
          >
            {countdown}
          </span>
        </div>
        <div className="text-2xl text-cyber-blue animate-pulse">
          게임이 곧 시작됩니다!
        </div>
        <div className="mt-6 w-48 h-2 bg-gray-700 rounded-full mx-auto overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-cyber-blue to-cyber-purple rounded-full transition-all duration-1000 ease-linear"
            style={{
              width: `${((4 - countdown) / 3) * 100}%`,
              boxShadow: "0 0 10px rgba(0, 200, 255, 0.5)",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default CountdownOverlay;
