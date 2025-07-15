import CyberButton from '@/components/CyberButton';
import { Plus, Edit, Trash2 } from 'lucide-react';

interface Problem {
  id: number;
  title: string;
  difficulty: string;
  category: string[];
  status: string;
  submissions: number;
  successRate: string;
}

interface Props {
  problems: Problem[];
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active': return 'text-green-400 bg-green-400/20';
    default: return 'text-gray-400 bg-gray-400/20';
  }
};

const ProblemList = ({ problems }: Props) => (
  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <h2 className="text-xl font-bold text-white">문제 관리</h2>
      <CyberButton size="sm">
        <Plus className="h-4 w-4" />
        새 문제 추가
      </CyberButton>
    </div>
    <div className="space-y-3">
      {problems.map(problem => (
        <div key={problem.id} className="p-4 bg-black/20 rounded-lg border border-gray-700/50">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-white font-medium">{problem.title}</h3>
            <span className={`px-2 py-1 rounded text-xs ${getStatusColor(problem.status)}`}>
              활성
            </span>
          </div>
          <div className="flex items-center space-x-4 text-sm text-gray-300 mb-3">
            <span>난이도: <span className="text-cyber-blue">{problem.difficulty}</span></span>
            <span>제출: {problem.submissions}회</span>
            <span>성공률: {problem.successRate}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-1">
              {problem.category.map((cat, i) => (
                <span key={i} className="px-2 py-1 bg-cyber-purple/20 text-cyber-purple text-xs rounded">
                  {cat}
                </span>
              ))}
            </div>
            <div className="flex space-x-2">
              <CyberButton size="sm" variant="secondary">
                <Edit className="h-4 w-4" />
                수정
              </CyberButton>
              <CyberButton size="sm" className="bg-red-500/20 text-red-400 hover:bg-red-500/30">
                <Trash2 className="h-4 w-4" />
                삭제
              </CyberButton>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default ProblemList;