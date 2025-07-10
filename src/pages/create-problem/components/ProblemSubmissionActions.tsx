import CyberButton from '@/components/CyberButton';
import { Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ProblemSubmissionActions = ({ handleSubmit }) => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-end space-x-4">
      <CyberButton variant="secondary" onClick={() => navigate('/home')}>
        취소
      </CyberButton>
      <CyberButton onClick={handleSubmit}>
        <Save className="mr-2 h-4 w-4" />
        문제 등록
      </CyberButton>
    </div>
  );
};
