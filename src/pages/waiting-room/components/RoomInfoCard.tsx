import CyberCard from "@/components/CyberCard";
import CyberButton from "@/components/CyberButton";
import { Settings } from "lucide-react";
import { FC } from "react";
import { CustomRoom } from "@/types/room";

const availableCategories = [
  { value: 'implementation', label: '구현' },
  { value: 'simulation', label: '시뮬레이션' },
  { value: 'dp', label: 'DP (동적계획법)' },
  { value: 'greedy', label: '그리디' },
  { value: 'stack', label: '스택' },
  { value: 'queue', label: '큐' },
  { value: 'string', label: '문자열' },
  { value: 'math', label: '수학' },
  { value: 'geometry', label: '기하학' },
  { value: 'sorting', label: '정렬' },
  { value: 'binary-search', label: '이분탐색' },
  { value: 'parametric-search', label: '매개변수 탐색' },
  { value: 'graph', label: '그래프' },
  { value: 'dfs', label: 'DFS' },
  { value: 'bfs', label: 'BFS' },
  { value: 'shortest-path', label: '최단거리 탐색' }
];

const availableLanguages = [
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'c', label: 'C' },
  { value: 'cpp', label: 'C++' }
];

const availableDifficulties = [
  { value: 'bronze', label: '브론즈' },
  { value: 'silver', label: '실버' },
  { value: 'gold', label: '골드' },
  { value: 'platinum', label: '플래티넘' },
  { value: 'diamond', label: '다이아몬드' },
  { value: 'challenger', label: '챌린저' }
];

const getCategoryNamesFromBitmask = (bitmask: number) => {
  const selectedCategories: string[] = [];
  availableCategories.forEach((category, index) => {
    if ((bitmask >> index) & 1) {
      selectedCategories.push(category.label);
    }
  });
  return selectedCategories.length > 0 ? selectedCategories.join(", ") : "선택 안함";
};

interface Props {
  roomInfo: CustomRoom;
  isHost: boolean;
  onOpenSettings: () => void;
}

const RoomInfoCard: FC<Props> = ({ roomInfo, isHost, onOpenSettings }) => (
  <CyberCard className="mb-6">
    <div className="flex items-center justify-between mb-4">
      <h1 className="text-3xl font-bold text-cyber-blue">[{roomInfo.room_id}] {roomInfo.title}</h1>
      {isHost && (
        <CyberButton size="sm" variant="secondary" onClick={onOpenSettings}>
          <Settings className="mr-2 h-4 w-4" />
          설정 변경
        </CyberButton>
      )}
    </div>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
      <div>
        <div className="text-sm text-gray-400">사용 언어</div>
        <div className="text-lg font-semibold text-white">
          {availableLanguages.find(lang => lang.value === roomInfo.use_language)?.label || roomInfo.use_language}
        </div>
      </div>
      <div>
        <div className="text-sm text-gray-400">문제 분야</div>
        <div className="text-lg font-semibold text-white">
          {getCategoryNamesFromBitmask(roomInfo.category)}
        </div>
      </div>
      <div>
        <div className="text-sm text-gray-400">난이도</div>
        <div className="text-lg font-semibold text-white">
          {availableDifficulties.find(diff => diff.value === roomInfo.difficulty)?.label || roomInfo.difficulty}
        </div>
      </div>
      <div>
        <div className="text-sm text-gray-400">참가자</div>
        <div className="text-lg font-semibold text-white">{roomInfo.maker && roomInfo.user ? 2 : 1}/2</div>
      </div>
    </div>
  </CyberCard>
);

export default RoomInfoCard;