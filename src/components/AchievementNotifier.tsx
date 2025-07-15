import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useUser } from '@/context/UserContext';

const AchievementNotifier = () => {
  const { user, newlyAchieved, setNewlyAchieved } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (newlyAchieved && user?.user_id) {
      toast.success("새로운 업적을 획득했습니다!", {
        description: "획득한 업적을 확인하고 보상을 수령하세요.",
        action: {
          label: "확인하기",
          onClick: () => {
            navigate("/profile");
            setNewlyAchieved(null); // 토스트 액션 클릭 시 상태 초기화
          },
        },
        duration: 5000,
        closeButton: true,
        onDismiss: () => {
          setNewlyAchieved(null); // 토스트가 사라질 때 상태 초기화
        }
      });
    }
  }, [newlyAchieved, user, navigate, setNewlyAchieved]);

  return null; // 이 컴포넌트는 UI를 렌더링하지 않습니다.
};

export default AchievementNotifier;
