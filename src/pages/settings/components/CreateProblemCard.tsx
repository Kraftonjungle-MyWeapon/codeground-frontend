import { useNavigate } from 'react-router-dom';
import CyberCard from "@/components/CyberCard";
import CyberButton from "@/components/CyberButton";
import { FilePlus } from "lucide-react";

const CreateProblemCard = () => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate('/create-problem');
  };

  return (
    <CyberCard>
      <h2 className="text-xl font-bold text-cyber-blue mb-4 flex items-center">
        <FilePlus className="mr-2 h-5 w-5" />
        문제 관리
      </h2>
      <div className="space-y-4">
        <div className="flex items-center justify-between p-3 bg-black/20 rounded-lg">
          <div>
            <h3 className="font-semibold text-white">코딩 테스트 문제 생성</h3>
            <p className="text-sm text-gray-400">새로운 코딩 테스트 문제를 추가합니다</p>
          </div>
          <CyberButton size="sm" variant="secondary" onClick={handleNavigate}>
            생성
          </CyberButton>
        </div>
      </div>
    </CyberCard>
  );
};

export default CreateProblemCard;
