import { User } from '../hooks/useUsers';
import CyberButton from '@/components/CyberButton';
import { Users } from 'lucide-react';
import { unbanUser, banUser } from '../api/adminApi';

interface Props {
  users: User[];
  refreshUsers: () => void;
}

const UserList = ({ users, refreshUsers }: Props) => {
  // 정지 해제 핸들러
  const handleUnban = async (user_id: number) => {
    try {
      await unbanUser(user_id);
      refreshUsers();
    } catch (err) {
      alert('정지 해제에 실패했습니다');
    }
  };

  // 정지 핸들러 (원하시면 banUser도 만드세요)
  const handleBan = async (user_id: number) => {
    try {
      await banUser(user_id);
      refreshUsers();
    } catch (err) {
      alert('정지 처리에 실패했습니다');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">사용자 관리</h2>
        <span className="text-sm text-gray-400">총 {users.length}명</span>
      </div>
      <div className="overflow-x-auto">
        {users.length === 0 ? (
          <div className="text-center py-12">
            <Users className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">등록된 사용자가 없습니다.</p>
          </div>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="p-2">닉네임</th>
                <th className="p-2">이메일</th>
                <th className="p-2">상태</th>
                <th className="p-2">신고횟수</th>
                <th className="p-2">관리</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.user_id} className={user.is_banned ? "bg-red-900/30" : ""}>
                  <td className="p-2">{user.nickname}</td>
                  <td className="p-2">{user.email}</td>
                  <td className="p-2">
                    {user.is_banned ? (
                      <span className="px-2 py-1 bg-red-500/30 text-red-400 rounded">정지됨</span>
                    ) : (
                      <span className="px-2 py-1 bg-green-500/30 text-green-400 rounded">정상</span>
                    )}
                  </td>
                  <td className="p-2">
                    <span className="px-2 py-1 bg-yellow-500/30 text-yellow-400 rounded">
                      {user.report_count ?? 0}회
                    </span>
                  </td>
                  <td className="p-2 space-x-1">
                    {user.is_banned ? (
                      <CyberButton size="sm" variant="secondary" onClick={() => handleUnban(user.user_id)}>
                        해제
                      </CyberButton>
                    ) : (
                      <CyberButton
                        size="sm"
                        className="bg-red-500/20 text-red-400 hover:bg-red-500/30"
                        onClick={() => handleBan(user.user_id)}
                      >
                        정지
                      </CyberButton>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default UserList;