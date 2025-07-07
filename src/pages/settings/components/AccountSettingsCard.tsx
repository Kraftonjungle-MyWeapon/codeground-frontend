import CyberCard from "@/components/CyberCard";
import CyberButton from "@/components/CyberButton";
import { Shield } from "lucide-react";

interface Props {
  onChangePassword: () => void;
  onDeleteAccount: () => void;
}

const AccountSettingsCard = ({ onChangePassword, onDeleteAccount }: Props) => (
  <CyberCard>
    <h2 className="text-xl font-bold text-cyber-blue mb-4 flex items-center">
      <Shield className="mr-2 h-5 w-5" />
      계정 설정
    </h2>
    <div className="space-y-4">
      <div className="flex items-center justify-between p-3 bg-black/20 rounded-lg">
        <div>
          <h3 className="font-semibold text-white">비밀번호 변경</h3>
          <p className="text-sm text-gray-400">계정 보안을 위해 비밀번호를 변경하세요</p>
        </div>
        <CyberButton size="sm" variant="secondary" onClick={onChangePassword}>
          변경
        </CyberButton>
      </div>
      <div className="flex items-center justify-between p-3 bg-black/20 rounded-lg">
        <div>
          <h3 className="font-semibold text-white">계정 삭제</h3>
          <p className="text-sm text-gray-400">계정을 영구적으로 삭제합니다</p>
        </div>
        <CyberButton size="sm" className="bg-red-500 hover:bg-red-600" onClick={onDeleteAccount}>
          삭제
        </CyberButton>
      </div>
    </div>
  </CyberCard>
);

export default AccountSettingsCard;