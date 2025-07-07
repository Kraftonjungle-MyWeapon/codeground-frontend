import CyberCard from "@/components/CyberCard";
import { Play } from "lucide-react";

const HeroVideo = () => (
  <div className="relative">
    <CyberCard className="relative overflow-hidden h-96 lg:h-[500px]">
      <div className="absolute inset-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover opacity-60"
        >
          <source
            src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
            type="video/mp4"
          />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />
      </div>

      <div className="relative z-10 h-full flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-cyber-blue/20 rounded-full mx-auto flex items-center justify-center backdrop-blur-sm">
            <Play className="h-10 w-10 text-cyber-blue" />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-white">
              실시간 대결 시스템
            </h3>
            <p className="text-gray-300">최고의 코딩 경험을 제공합니다</p>
          </div>
        </div>
      </div>

      <div className="absolute top-4 left-4 bg-black/60 rounded p-2 text-xs text-green-400 font-mono backdrop-blur-sm">
        <div className="animate-pulse">
          {"> function solve(arr) {"}
          <br />
          {"    return arr.sort();"}
          <br />
          {"}"}
        </div>
      </div>

      <div className="absolute bottom-4 right-4 bg-black/60 rounded p-2 text-xs text-cyber-blue font-mono backdrop-blur-sm">
        <div className="animate-pulse">
          {"Status: Connected"}
          <br />
          {"Players: 1,247 online"}
        </div>
      </div>
    </CyberCard>
  </div>
);

export default HeroVideo;