import CyberButton from '@/components/CyberButton';
import { Eye, Ban, UnlockKeyhole } from 'lucide-react';

interface Report {
  id: number;
  reportedUser: string;
  reportedBy: string;
  reason: string;
  date: string;
  status: string;
}

interface Props {
  userReports: Report[];
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending': return 'text-yellow-400 bg-yellow-400/20';
    case 'resolved': return 'text-green-400 bg-green-400/20';
    default: return 'text-gray-400 bg-gray-400/20';
  }
};

const ReportList = ({ userReports }: Props) => (
  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <h2 className="text-xl font-bold text-white">사용자 신고 내역</h2>
      <span className="text-sm text-gray-400">총 {userReports.length}건</span>
    </div>
    <div className="space-y-3">
      {userReports.map(report => (
        <div key={report.id} className="p-4 bg-black/20 rounded-lg border border-gray-700/50">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-3">
              <span className="text-white font-medium">{report.reportedUser}</span>
              <span className={`px-2 py-1 rounded text-xs ${getStatusColor(report.status)}`}>
                {report.status === 'pending' ? '대기중' : '처리완료'}
              </span>
            </div>
            <span className="text-sm text-gray-400">{report.date}</span>
          </div>
          <div className="text-sm text-gray-300 mb-3">
            <span className="text-gray-400">신고자:</span> {report.reportedBy} | 
            <span className="text-gray-400"> 사유:</span> {report.reason}
          </div>
          <div className="flex space-x-2">
            <CyberButton size="sm" variant="secondary">
              <Eye className="h-4 w-4" />
              상세보기
            </CyberButton>
            <CyberButton size="sm" className="bg-red-500/20 text-red-400 hover:bg-red-500/30">
              <Ban className="h-4 w-4" />
              제재
            </CyberButton>
            <CyberButton size="sm" variant="secondary">
              <UnlockKeyhole className="h-4 w-4" />
              무시
            </CyberButton>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default ReportList;