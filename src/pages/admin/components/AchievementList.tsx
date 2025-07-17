import CyberButton from '@/components/CyberButton';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Achievement } from '../hooks/useAchievements'; // Updated import
import { useState } from 'react';
import AchievementModal from './AchievementModal'; // Import the new modal
import { deleteAchievement, createAchievement, updateAchievement } from '../api/adminApi'; // Import API functions

interface Props {
  achievements: Achievement[];
  refreshAchievements: () => void; // Add refresh function
}

const AchievementList = ({ achievements, refreshAchievements }: Props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAchievement, setEditingAchievement] = useState<Achievement | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddClick = () => {
    setEditingAchievement(undefined);
    setIsModalOpen(true);
  };

  const handleEditClick = (achievement: Achievement) => {
    setEditingAchievement(achievement);
    setIsModalOpen(true);
  };

  const handleDeleteClick = async (achievementId: number) => {
    if (window.confirm('정말로 이 업적을 삭제하시겠습니까?')) {
      try {
        await deleteAchievement(achievementId);
        alert('업적이 성공적으로 삭제되었습니다.');
        refreshAchievements(); // Refresh the list after deletion
      } catch (error: any) {
        alert(`업적 삭제 실패: ${error.message}`);
      }
    }
  };

  const handleSubmit = async (data: Omit<Achievement, 'achievement_id' | 'created_at' | 'updated_at'>) => {
    setIsSubmitting(true);
    try {
      if (editingAchievement) {
        await updateAchievement(editingAchievement.achievement_id, data);
        alert('업적이 성공적으로 수정되었습니다.');
      } else {
        await createAchievement(data);
        alert('업적이 성공적으로 생성되었습니다.');
      }
      setIsModalOpen(false);
      refreshAchievements(); // Refresh the list after creation/update
    } catch (error: any) {
      alert(`작업 실패: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">업적 관리</h2>
        <CyberButton size="sm" onClick={handleAddClick}>
          <Plus className="h-4 w-4" />
          새 업적 추가
        </CyberButton>
      </div>
      <div className="space-y-3">
        {achievements.map(achievement => (
          <div key={achievement.achievement_id} className="p-4 bg-black/20 rounded-lg border border-gray-700/50">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-white font-medium">{achievement.title}</h3>
              <span className="text-sm text-gray-400">
                {achievement.trigger_type} ({achievement.parameter})
              </span>
            </div>
            <p className="text-gray-300 text-sm mb-3">{achievement.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">
                보상: {achievement.reward_type} ({achievement.reward_amount})
              </span>
              <div className="flex space-x-2">
                <CyberButton size="sm" variant="secondary" onClick={() => handleEditClick(achievement)}>
                  <Edit className="h-4 w-4" />
                  수정
                </CyberButton>
                <CyberButton size="sm" className="bg-red-500/20 text-red-400 hover:bg-red-500/30" onClick={() => handleDeleteClick(achievement.achievement_id)}>
                  <Trash2 className="h-4 w-4" />
                  삭제
                </CyberButton>
              </div>
            </div>
          </div>
        ))}
      </div>
      <AchievementModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={editingAchievement}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        allAchievements={achievements} // Pass all achievements to the modal
      />
    </div>
  );
};

export default AchievementList;