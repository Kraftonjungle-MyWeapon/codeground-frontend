import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import CyberButton from "@/components/CyberButton";
import { User, Upload } from "lucide-react";

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUsername: string;
}

const ProfileEditModal = ({
  isOpen,
  onClose,
  currentUsername,
}: ProfileEditModalProps) => {
  const [formData, setFormData] = useState({
    username: currentUsername,
    profileImage: null as File | null,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("프로필 업데이트:", formData);
    // TODO: 실제 프로필 업데이트 로직 구현
    onClose();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        profileImage: file,
      }));
    }
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      username: e.target.value,
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px] bg-cyber-darker border-cyber-blue/30">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-cyber-blue">
            프로필 편집
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 프로필 사진 */}
          <div className="space-y-4 text-center">
            <div className="w-24 h-24 bg-gradient-to-r from-cyber-blue to-cyber-purple rounded-full mx-auto flex items-center justify-center">
              <User className="h-12 w-12 text-white" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="profileImage" className="text-gray-300">
                프로필 사진
              </Label>
              <div className="flex items-center justify-center">
                <label htmlFor="profileImage" className="cursor-pointer">
                  <div className="flex items-center space-x-2 px-4 py-2 bg-black/30 border border-gray-600 rounded-lg hover:border-cyber-blue/40 transition-colors">
                    <Upload className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-300">이미지 업로드</span>
                  </div>
                </label>
                <input
                  id="profileImage"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
              {formData.profileImage && (
                <p className="text-xs text-green-400">
                  선택된 파일: {formData.profileImage.name}
                </p>
              )}
            </div>
          </div>

          {/* 닉네임 */}
          <div className="space-y-2">
            <Label htmlFor="username" className="text-gray-300">
              닉네임
            </Label>
            <Input
              id="username"
              value={formData.username}
              onChange={handleUsernameChange}
              placeholder="닉네임을 입력하세요"
              className="bg-black/30 border-gray-600 text-white"
              required
            />
          </div>

          {/* 버튼들 */}
          <div className="flex space-x-3 pt-4">
            <CyberButton type="submit" className="flex-1">
              저장
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

export default ProfileEditModal;
