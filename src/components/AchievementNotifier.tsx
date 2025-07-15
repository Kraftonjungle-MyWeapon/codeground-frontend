import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useUser } from '@/context/UserContext';
import { claimAchievementReward } from '@/utils/api';

const AchievementNotifier = () => {
  const { user, newlyAchieved, setNewlyAchieved } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (newlyAchieved && user?.user_id) {
      toast.success(`새로운 업적 달성! ${newlyAchieved.achievement.title}`, {
        description: newlyAchieved.achievement.description,
        action: {
          label: "업적 보기",
          onClick: () => {
            navigate("/profile");
            claimAchievementReward(user.user_id, newlyAchieved.user_achievement_id)
              .then(() => {
                console.log("Reward claimed via toast action");
                setNewlyAchieved(null); // 보상 수령 성공 시에만 상태 초기화
              })
              .catch(error => console.error("Failed to claim reward via toast action:", error));
          },
        },
        duration: 5000,
        onDismiss: () => {
          claimAchievementReward(user.user_id, newlyAchieved.user_achievement_id)
            .then(() => {
                console.log("Reward claimed via toast dismiss");
                setNewlyAchieved(null); // 보상 수령 성공 시에만 상태 초기화
            })
            .catch(error => console.error("Failed to claim reward via toast dismiss:", error));
        }
      });
    }
  }, [newlyAchieved, user, navigate, setNewlyAchieved]);

  return null; // 이 컴포넌트는 UI를 렌더링하지 않습니다.
};

export default AchievementNotifier;
