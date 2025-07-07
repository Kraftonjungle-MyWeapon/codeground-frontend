import { useState } from "react";
import CyberCard from "@/components/CyberCard";
import CyberButton from "@/components/CyberButton";

interface Props {
  onClose: () => void;
}

const PasswordChangeModal = ({ onClose }: Props) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handlePasswordChange = () => {
    if (newPassword !== confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }
    if (newPassword.length < 6) {
      alert("비밀번호는 6자 이상이어야 합니다.");
      return;
    }
    alert("비밀번호가 변경되었습니다.");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center">
      <CyberCard className="w-full max-w-md mx-4">
        <h3 className="text-xl font-bold text-white mb-4">비밀번호 변경</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              현재 비밀번호
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full p-3 bg-black/30 border border-gray-600 rounded text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              새 비밀번호
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-3 bg-black/30 border border-gray-600 rounded text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              비밀번호 확인
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-3 bg-black/30 border border-gray-600 rounded text-white"
            />
          </div>
        </div>
        <div className="flex justify-end space-x-3 mt-6">
          <CyberButton variant="secondary" onClick={onClose}>
            취소
          </CyberButton>
          <CyberButton onClick={handlePasswordChange}>변경</CyberButton>
        </div>
      </CyberCard>
    </div>
  );
};

export default PasswordChangeModal;