import CyberCard from "@/components/CyberCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trophy, CheckCircle } from "lucide-react";
import { getBadgeRarityColor } from "../utils";

interface Achievement {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  icon: React.FC<{ className?: string }>;
  rarity: string;
}

interface Props {
  achievements: Achievement[];
}

const AchievementCollection = ({ achievements }: Props) => (
  <CyberCard className="flex-1 flex flex-col">
    <div className="flex items-center space-x-2 mb-6">
      <Trophy className="h-5 w-5 text-yellow-400" />
      <h2 className="text-lg font-bold text-white">명예 컬렉션</h2>
      <span className="text-sm text-gray-400">
        ({achievements.filter((a) => a.completed).length}/{achievements.length})
      </span>
    </div>
    <div className="h-64 overflow-hidden">
      <ScrollArea className="h-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pr-4">
          {achievements.map((achievement) => {
            const Icon = achievement.icon;
            return (
              <div
                key={achievement.id}
                className={`flex flex-col items-center p-4 rounded-lg border transition-all duration-200 ${
                  achievement.completed
                    ? `${getBadgeRarityColor(achievement.rarity, true)} hover:scale-105 border-current/30`
                    : "bg-gray-800/30 border-gray-700/50 opacity-60"
                }`}
              >
                <Icon
                  className={`h-8 w-8 mb-2 ${
                    achievement.completed
                      ? getBadgeRarityColor(achievement.rarity, true).split(" ")[0]
                      : "text-gray-500"
                  }`}
                />
                <span
                  className={`text-sm font-medium text-center mb-1 ${
                    achievement.completed ? "text-white" : "text-gray-500"
                  }`}
                >
                  {achievement.title}
                </span>
                <span
                  className={`text-xs text-center ${
                    achievement.completed ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  {achievement.description}
                </span>
                {achievement.completed && (
                  <CheckCircle className="h-4 w-4 text-green-400 mt-2" />
                )}
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  </CyberCard>
);

export default AchievementCollection;