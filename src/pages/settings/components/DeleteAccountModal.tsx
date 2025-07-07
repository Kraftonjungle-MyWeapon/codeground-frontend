import CyberCard from "@/components/CyberCard";
import CyberButton from "@/components/CyberButton";

interface Props {
  onClose: () => void;
}

const DeleteAccountModal = ({ onClose }: Props) => {
  const handleDeleteAccount = () => {
    alert("계정 삭제 요청이 전송되었습니다.");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center">
      <CyberCard className="w-full max-w-md mx-4">
        <h3 className="text-xl font-bold text-red-400 mb-4">계정 삭제</h3>
        <p className="text-gray-300 mb-6">
          정말로 계정을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
        </p>
        <div className="flex justify-end space-x-3">
          <CyberButton variant="secondary" onClick={onClose}>
            취소
          </CyberButton>
          <CyberButton className="bg-red-500 hover:bg-red-600" onClick={handleDeleteAccount}>
            확인
          </CyberButton>
        </div>
      </CyberCard>
    </div>
  );
};

export default DeleteAccountModal;