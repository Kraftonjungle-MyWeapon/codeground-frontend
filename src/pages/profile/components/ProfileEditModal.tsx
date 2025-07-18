import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useUser } from "@/context/UserContext";
import { updateUserProfile } from "@/utils/api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import CyberButton from "@/components/CyberButton";
import { User, Upload } from "lucide-react";
import { authFetch } from "@/utils/api";

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentNickname: string;
  currentProfileImageUrl: string;
}



const ProfileEditModal = ({
  isOpen,
  onClose,
  currentNickname,
  currentProfileImageUrl,
}: ProfileEditModalProps) => {
  const { user, setUser } = useUser();
  const [nickname, setNickname] = useState(currentNickname);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    currentProfileImageUrl
  );
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setNickname(currentNickname);
    setPreviewUrl(currentProfileImageUrl);
  }, [currentNickname, currentProfileImageUrl, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData();
    formData.append("nickname", nickname);
    if (profileImage) {
      formData.append("profile_image", profileImage);
    }

    try {
      const response = await updateUserProfile(formData);
      const updatedUserFromBackend = response.user; // 백엔드 응답에서 user 객체 추출

      // ✅ 이미지 업로드한 경우에만 확인
      if (profileImage && !updatedUserFromBackend.profile_img_url) {
        throw new Error("프로필 이미지가 정상적으로 반영되지 않았습니다.");
      }

      // UserContext의 user 객체 업데이트
      const newUserState = {
        ...user, // 기존 user 상태를 스프레드
        ...updatedUserFromBackend, // 백엔드에서 받은 업데이트된 사용자 정보 스프레드
        profileImageUrl: updatedUserFromBackend.profile_img_url, // profile_img_url을 profileImageUrl로 매핑
        totalScore: updatedUserFromBackend.user_mmr, // user_mmr을 totalScore로 매핑
        rank: updatedUserFromBackend.user_rank, // user_rank를 rank로 매핑
      };
      setUser(newUserState);

      // 🔥 추가: 프리뷰 상태를 최신 이미지로 갱신 + 캐시 방지 쿼리 붙이기
      setPreviewUrl(`${updatedUserFromBackend.profile_img_url}?t=${Date.now()}`);

      toast.success("프로필이 성공적으로 업데이트되었습니다.");
      onClose();
    } catch (error: any) {
      console.error("Failed to update profile:", error);
      toast.error(error.message || "프로필 업데이트에 실패했습니다.");
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px] bg-cyber-darker border-cyber-blue/30">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-cyber-blue">
            프로필 편집
          </DialogTitle>
          <DialogDescription>
            프로필 사진과 닉네임을 변경할 수 있습니다.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4 text-center">
            <div className="w-24 h-24 rounded-full mx-auto flex items-center justify-center overflow-hidden border-2 border-cyber-blue">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Profile Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="h-12 w-12 text-white" />
              )}
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
                  disabled={isLoading}
                />
              </div>
              {profileImage && (
                <p className="text-xs text-green-400">
                  선택된 파일: {profileImage.name}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="username" className="text-gray-300">
              닉네임
            </Label>
            <Input
              id="username"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="닉네임을 입력하세요"
              className="bg-black/30 border-gray-600 text-white"
              required
              disabled={isLoading}
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <CyberButton type="submit" className="flex-1" disabled={isLoading}>
              {isLoading ? "저장 중..." : "저장"}
            </CyberButton>
            <CyberButton
              type="button"
              variant="secondary"
              onClick={onClose}
              className="flex-1"
              disabled={isLoading}
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
