import CyberCard from "@/components/CyberCard";
import CyberButton from "@/components/CyberButton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Crown } from "lucide-react";
import { ResponseRoom } from "@/types/room";

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
  waitingRooms: ResponseRoom[];
  onCreateRoom: () => void;
  onJoinRoom: (id: number) => void;
}

const WaitingRoomListCard = ({ waitingRooms, onCreateRoom, onJoinRoom }: Props) => (
  <CyberCard className="flex-1 flex flex-col">
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-xl font-bold text-cyber-blue">대기실 리스트</h2>
      <CyberButton size="sm" onClick={onCreateRoom}>
        + 대기실 생성
      </CyberButton>
    </div>
    <div className="h-[500px] overflow-hidden">
      <ScrollArea className="h-full">
        <div className="space-y-3 pr-4">
          {waitingRooms.map((room) => (
            <div
              key={room.room_id}
              className="flex items-center justify-between p-4 bg-black/20 rounded-lg hover:bg-black/30 transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <Crown className="h-4 w-4 text-yellow-400" />
                  <span className="text-white font-medium">{room.title}</span>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      room.difficulty === "bronze"
                        ? "bg-amber-800/20 text-amber-400"
                        : room.difficulty === "silver"
                        ? "bg-gray-500/20 text-gray-400"
                        : room.difficulty === "gold"
                        ? "bg-yellow-500/20 text-yellow-400"
                        : room.difficulty === "platinum"
                        ? "bg-blue-500/20 text-blue-400"
                        : room.difficulty === "diamond"
                        ? "bg-purple-500/20 text-purple-400"
                        : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    {availableDifficulties.find(d => d.value === room.difficulty)?.label || room.difficulty}
                  </span>
                </div>
                <p className="text-sm text-gray-400 mb-1">
                  언어: {availableLanguages.find(l => l.value === room.use_language)?.label || room.use_language}
                </p>
                <p className="text-xs text-gray-500">
                  분야: {getCategoryNamesFromBitmask(room.category)}
                </p>
                <p className="text-xs text-gray-500">
                  호스트: {room.maker}
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-400">{room.user_cnt}/2</span>
                <CyberButton
                  size="sm"
                  disabled={room.user_cnt === 2 || room.is_gaming}
                  onClick={() => onJoinRoom(room.room_id)}
                >
                  {room.is_gaming ? "게임 중" : room.user_cnt === 2 ? "정원 초과" : "입장"}
                </CyberButton>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  </CyberCard>
);

export default WaitingRoomListCard;