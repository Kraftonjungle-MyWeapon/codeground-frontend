import { useState } from 'react';
import Header from '@/components/Header';
import AdminSidebar from './components/AdminSidebar';
import ReportList from './components/ReportList';
import ProblemList from './components/ProblemList';
import AchievementList from './components/AchievementList';
import UserList from './components/UserList';

import { useAchievements } from './hooks/useAchievements';
import { useReports } from './hooks/useReports';
import { useProblems } from './hooks/useProblems';
import { useUsers } from './hooks/useUsers';

import CyberCard from '@/components/CyberCard';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Shield } from 'lucide-react';

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('reports');

  // hooks에서 데이터 가져오기
  const { reports, loading: reportsLoading, error: reportsError } = useReports();
  const { problems, loading: problemsLoading, error: problemsError } = useProblems();
  const { achievements, loading: achievementsLoading, error: achievementsError } = useAchievements();
  const { users, loading: usersLoading, error: usersError, fetchUsers } = useUsers();

  // 탭 헤더 정보
  const tabTitles = {
    reports: '사용자 신고 내역',
    problems: '문제 관리',
    achievements: '업적 관리',
    users: '사용자 관리',
  };

  return (
    <div className="min-h-screen cyber-grid">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* 페이지 헤더 */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <Shield className="h-8 w-8 text-red-400" />
              <h1 className="text-3xl font-bold text-white">관리자 대시보드</h1>
            </div>
            {/* 검색/필터 등은 별도 분리하여 필요 시 각 리스트 컴포넌트에서 구현 권장 */}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* 사이드바 탭 */}
            <div className="lg:col-span-1">
              <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
            </div>
            {/* 메인 콘텐츠 */}
            <div className="lg:col-span-3">
              <CyberCard>
                <div className="h-[600px] overflow-hidden">
                  <ScrollArea className="h-full">
                    <div className="pr-4">
                      {activeTab === 'reports' && (
                        reportsLoading ? (
                          <div className="text-gray-400 text-center py-8">로딩 중...</div>
                        ) : reportsError ? (
                          <div className="text-red-400 text-center py-8">{reportsError.message}</div>
                        ) : (
                          <ReportList userReports={reports} />
                        )
                      )}

                      {activeTab === 'problems' && (
                        problemsLoading ? (
                          <div className="text-gray-400 text-center py-8">로딩 중...</div>
                        ) : problemsError ? (
                          <div className="text-red-400 text-center py-8">{problemsError.message}</div>
                        ) : (
                          <ProblemList problems={problems} />
                        )
                      )}

                      {activeTab === 'achievements' && (
                        achievementsLoading ? (
                          <div className="text-gray-400 text-center py-8">로딩 중...</div>
                        ) : achievementsError ? (
                          <div className="text-red-400 text-center py-8">{achievementsError.message}</div>
                        ) : (
                          <AchievementList achievements={achievements} />
                        )
                      )}

                      {activeTab === 'users' && (
                        usersLoading ? (
                          <div className="text-gray-400 text-center py-8">로딩 중...</div>
                        ) : usersError ? (
                          <div className="text-red-400 text-center py-8">{usersError.message}</div>
                        ) : (
                          <UserList users={users} refreshUsers={fetchUsers} />
                        )
                      )}
                    </div>
                  </ScrollArea>
                </div>
              </CyberCard>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminPage;