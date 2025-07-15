import { Button } from "@/components/ui/button";
import CyberCard from "@/components/CyberCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trophy, CheckCircle } from "lucide-react";
import { getBadgeRarityColor } from "../utils";

interface AchievementDisplay {
  achievement_id: number;
  user_achievement_id?: number; // Optional, only present if achieved by the user
  title: string;
  description: string;
  completed: boolean;
  is_reward_received?: boolean; // Optional, only present if achieved by the user
  icon: React.FC<{ className?: string }>;
  rarity: string;
}

interface Props {
  achievements: AchievementDisplay[];
  onClaimReward: (userAchievementId: number) => void;
}

const AchievementCollection = ({ achievements, onClaimReward }: Props) => (
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
            const rarityColorClass = getBadgeRarityColor(achievement.rarity, achievement.completed);
            const iconColorClass = achievement.completed ? rarityColorClass.split(" ")[0] : "text-gray-500";
            const textColorClass = achievement.completed ? "text-white" : "text-gray-500";
            const descriptionColorClass = achievement.completed ? "text-gray-300" : "text-gray-600";

            return (
              <div
                key={achievement.achievement_id}
                className={`flex flex-col items-center p-4 rounded-lg border transition-all duration-200 ${
                  rarityColorClass
                }`}
              >
                <Icon
                  className={`h-8 w-8 mb-2 ${iconColorClass}`}
                />
                <span
                  className={`text-sm font-medium text-center mb-1 ${textColorClass}`}
                >
                  {achievement.title}
                </span>
                <span
                  className={`text-xs text-center ${descriptionColorClass}`}
                >
                  {achievement.description}
                </span>
                {achievement.completed && !achievement.is_reward_received && achievement.user_achievement_id && (
                  <Button
                    variant="secondary"
                    size="sm"
                    className="mt-2"
                    onClick={() => onClaimReward(achievement.user_achievement_id!)}
                  >
                    보상 획득
                  </Button>
                )}
                {achievement.completed && achievement.is_reward_received && (
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
