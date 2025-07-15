import CyberButton from '@/components/CyberButton';
import { Plus, Edit, Trash2 } from 'lucide-react';

interface Achievement {
  id: number;
  title: string;
  description: string;
  rarity: string;
  unlocked: number;
}

interface Props {
  achievements: Achievement[];
}

const getRarityColor = (rarity: string) => {
  switch (rarity) {
    case 'common': return 'text-gray-300';
    case 'rare': return 'text-blue-400';
    case 'epic': return 'text-purple-400';
    case 'legendary': return 'text-yellow-400';
    default: return 'text-gray-300';
  }
};

const AchievementList = ({ achievements }: Props) => (
  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <h2 className="text-xl font-bold text-white">업적 관리</h2>
      <CyberButton size="sm">
        <Plus className="h-4 w-4" />
        새 업적 추가
      </CyberButton>
    </div>
    <div className="space-y-3">
      {achievements.map(achievement => (
        <div key={achievement.id} className="p-4 bg-black/20 rounded-lg border border-gray-700/50">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-white font-medium">{achievement.title}</h3>
            <span className={`text-sm font-medium ${getRarityColor(achievement.rarity)}`}>
              {achievement.rarity}
            </span>
          </div>
          <p className="text-gray-300 text-sm mb-3">{achievement.description}</p>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">
              달성한 사용자: {achievement.unlocked.toLocaleString()}명
            </span>
            <div className="flex space-x-2">
              <CyberButton size="sm" variant="secondary">
                <Edit className="h-4 w-4" />
                수정
              </CyberButton>
              <CyberButton size="sm" className="bg-red-500/20 text-red-400 hover:bg-red-500/30">
                <Trash2 className="h-4 w-4" />
                삭제
              </CyberButton>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default AchievementList;