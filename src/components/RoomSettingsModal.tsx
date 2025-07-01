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

interface RoomSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSettings: {
    title: string;
    language: string;
    category: string;
    difficulty: string;
  };
}

const RoomSettingsModal = ({
  isOpen,
  onClose,
  currentSettings,
}: RoomSettingsModalProps) => {
  const [formData, setFormData] = useState({
    title: currentSettings.title,
    language: currentSettings.language,
    category: currentSettings.category,
    difficulty: currentSettings.difficulty,
  });

  const languages = [
    "Python",
    "JavaScript",
    "Java",
    "C++",
    "C#",
    "Go",
    "Rust",
    "TypeScript",
  ];

  const categories = [
    "자료구조",
    "알고리즘",
    "동적계획법",
    "그래프",
    "문자열",
    "수학",
    "구현",
    "완전탐색",
    "이분탐색",
    "정렬",
  ];

  const difficulties = ["초급", "중급", "고급", "전문가"];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("대기실 설정 변경:", formData);
    // TODO: 실제 설정 변경 로직 구현
    onClose();
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
                {languages.map((language) => (
                  <SelectItem
                    key={language}
                    value={language}
                    className="text-white hover:bg-cyber-blue/20"
                  >
                    {language}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 문제 분야 */}
          <div className="space-y-2">
            <Label className="text-gray-300">문제 분야</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => handleInputChange("category", value)}
            >
              <SelectTrigger className="bg-black/30 border-gray-600 text-white">
                <SelectValue placeholder="분야를 선택하세요" />
              </SelectTrigger>
              <SelectContent className="bg-cyber-darker border-gray-600">
                {categories.map((category) => (
                  <SelectItem
                    key={category}
                    value={category}
                    className="text-white hover:bg-cyber-blue/20"
                  >
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
                {difficulties.map((difficulty) => (
                  <SelectItem
                    key={difficulty}
                    value={difficulty}
                    className="text-white hover:bg-cyber-blue/20"
                  >
                    {difficulty}
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
