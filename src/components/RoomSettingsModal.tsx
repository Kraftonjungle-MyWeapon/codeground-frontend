import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CyberButton from "@/components/CyberButton";
import { Checkbox } from "@/components/ui/checkbox";
import { updateRoom } from "@/utils/api";
import { useUser } from "@/context/UserContext";
import { CustomRoom } from "@/types/room";

interface RoomSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSettings: {
    title: string;
    language: string;
    category: number; // Changed to number for bitmasking
    difficulty: string;
  };
  roomId: number; // Add roomId prop
  onSettingsSaved: (updatedRoom: CustomRoom) => void; // Callback for when settings are saved
}

const RoomSettingsModal = ({
  isOpen,
  onClose,
  currentSettings,
  roomId,
  onSettingsSaved,
}: RoomSettingsModalProps) => {
  const { user } = useUser();

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

  const getCategoryBitValue = (index: number) => 1 << index;

  const [formData, setFormData] = useState({
    title: currentSettings.title,
    language: currentSettings.language,
    category: currentSettings.category, // Changed to number for bitmasking
    difficulty: currentSettings.difficulty,
  });

  const availableLanguages = [
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'c', label: 'C' },
    { value: 'cpp', label: 'C++' }
  ];

  const difficulties = [
    { value: 'bronze', label: '브론즈' },
    { value: 'silver', label: '실버' },
    { value: 'gold', label: '골드' },
    { value: 'platinum', label: '플래티넘' },
    { value: 'diamond', label: '다이아몬드' },
    { value: 'challenger', label: '챌린저' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.user_id) {
      console.error("User not logged in.");
      return;
    }

    try {
      const updateData = {
        title: formData.title,
        use_language: formData.language,
        category: formData.category,
        difficulty: formData.difficulty,
      };
      const updatedRoom = await updateRoom(roomId, user.user_id, updateData);
      console.log("대기실 설정 변경 성공:", updatedRoom);
      onSettingsSaved(updatedRoom);
      onClose();
    } catch (error) {
      console.error("대기실 설정 변경 실패:", error);
      // TODO: 사용자에게 에러 메시지 표시
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-cyber-darker border-cyber-blue/30">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-cyber-blue">
            대기실 설정 변경
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 대기실 제목 */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-gray-300">
              대기실 제목
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="대기실 제목을 입력하세요"
              className="bg-black/30 border-gray-600 text-white"
              required
            />
          </div>

          {/* 사용 언어 */}
          <div className="space-y-2">
            <Label className="text-gray-300">사용 언어</Label>
            <Select
              value={formData.language}
              onValueChange={(value) => handleInputChange("language", value)}
            >
              <SelectTrigger className="bg-black/30 border-gray-600 text-white">
                <SelectValue placeholder="언어를 선택하세요" />
              </SelectTrigger>
              <SelectContent className="bg-cyber-darker border-gray-600">
                {availableLanguages.map((lang) => (
                  <SelectItem
                    key={lang.value}
                    value={lang.value}
                    className="text-white hover:bg-cyber-blue/20"
                  >
                    {lang.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 문제 분야 */}
          <div className="space-y-2">
            <Label className="text-gray-300">문제 분야</Label>
            <div className="grid grid-cols-2 gap-2">
              {availableCategories.map((category, index) => {
                const bitValue = getCategoryBitValue(index);
                return (
                  <div key={category.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={`category-${category.value}`}
                      checked={(formData.category & bitValue) === bitValue}
                      onCheckedChange={(checked) => {
                        setFormData((prev) => ({
                          ...prev,
                          category: checked
                            ? prev.category | bitValue
                            : prev.category & ~bitValue,
                        }));
                      }}
                      className="border-gray-600"
                    />
                    <Label htmlFor={`category-${category.value}`} className="text-gray-300">
                      {category.label}
                    </Label>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 문제 난이도 */}
          <div className="space-y-2">
            <Label className="text-gray-300">문제 난이도</Label>
            <Select
              value={formData.difficulty}
              onValueChange={(value) => handleInputChange("difficulty", value)}
            >
              <SelectTrigger className="bg-black/30 border-gray-600 text-white">
                <SelectValue placeholder="난이도를 선택하세요" />
              </SelectTrigger>
              <SelectContent className="bg-cyber-darker border-gray-600">
                {difficulties.map((tier) => (
                  <SelectItem
                    key={tier.value}
                    value={tier.value}
                    className="text-white hover:bg-cyber-blue/20"
                  >
                    {tier.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 버튼들 */}
          <div className="flex space-x-3 pt-4">
            <CyberButton type="submit" className="flex-1">
              설정 저장
            </CyberButton>
            <CyberButton
              type="button"
              variant="secondary"
              onClick={onClose}
              className="flex-1"
            >
              취소
            </CyberButton>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RoomSettingsModal;
