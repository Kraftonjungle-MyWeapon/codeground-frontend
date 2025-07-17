import React, { useEffect, useState } from 'react';
import { fetchAdminProblems, deleteAdminProblem, toggleProblemApproval } from '../api/adminApi'; // toggleProblemApproval import
import { AdminProblemOut } from '@/types/admin';
import CyberCard from '@/components/CyberCard';
import CyberButton from '@/components/CyberButton';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Switch } from '@/components/ui/switch'; // Switch 컴포넌트 import

const ProblemList: React.FC = () => {
  const [problems, setProblems] = useState<AdminProblemOut[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  const loadProblems = async () => {
    setIsLoading(true);
    try {
      const data = await fetchAdminProblems();
      setProblems(data);
    } catch (error) {
      console.error('Failed to fetch problems:', error);
      toast({
        title: '문제 목록 불러오기 실패',
        description: '문제 목록을 불러오는 데 실패했습니다.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProblems();
  }, []);

  const handleDelete = async (problemId: number) => {
    try {
      await deleteAdminProblem(problemId);
      toast({
        title: '문제 삭제 성공',
        description: '문제가 성공적으로 삭제되었습니다.',
        variant: 'success',
      });
      loadProblems(); // 목록 새로고침
    } catch (error) {
      console.error('Failed to delete problem:', error);
      toast({
        title: '문제 삭제 실패',
        description: '문제 삭제에 실패했습니다.',
        variant: 'destructive',
      });
    }
  };

  const handleToggleApproval = async (problemId: number, currentStatus: boolean) => {
    // UI를 먼저 업데이트하여 즉각적인 피드백 제공
    setProblems(prevProblems =>
      prevProblems.map(problem =>
        problem.problem_id === problemId ? { ...problem, is_approved: !currentStatus } : problem
      )
    );

    try {
      await toggleProblemApproval(problemId, !currentStatus);
      toast({
        title: '승인 상태 변경 성공',
        description: `문제 ID ${problemId}의 승인 상태가 ${!currentStatus ? '승인됨' : '승인되지 않음'}으로 변경되었습니다.`, // Changed to use backticks for template literal
        variant: 'success',
      });
    } catch (error) {
      console.error('Failed to toggle approval:', error);
      toast({
        title: '승인 상태 변경 실패',
        description: '문제 승인 상태 변경에 실패했습니다.',
        variant: 'destructive',
      });
      // 오류 발생 시 UI를 이전 상태로 되돌림
      setProblems(prevProblems =>
        prevProblems.map(problem =>
          problem.problem_id === problemId ? { ...problem, is_approved: currentStatus } : problem
        )
      );
    }
  };

  if (isLoading) {
    return <div className="text-white text-center">문제 목록을 불러오는 중...</div>;
  }

  return (
    <CyberCard glowing className="p-6">
      <h2 className="text-2xl font-bold text-white mb-6">문제 관리</h2>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-white w-[25%]">제목</TableHead>
              <TableHead className="text-white w-[10%]">난이도</TableHead>
              <TableHead className="text-white w-[10%]">승인 여부</TableHead> {/* 승인 여부 컬럼 */}
              <TableHead className="text-white w-[10%]">작성자 ID</TableHead>
              <TableHead className="text-white w-[10%]">카테고리</TableHead>
              <TableHead className="text-white w-[10%]">언어</TableHead>
              <TableHead className="text-white w-[10%]">생성일</TableHead>
              <TableHead className="text-white w-[15%]">액션</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {problems.map((problem) => (
              <TableRow key={problem.problem_id}>
                <TableCell className="text-gray-300 w-[25%]">{problem.title}</TableCell>
                <TableCell className="text-gray-300 w-[10%]">{problem.difficulty}</TableCell>
                <TableCell className="text-gray-300 w-[10%]">
                  <Switch
                    checked={problem.is_approved}
                    onCheckedChange={() => handleToggleApproval(problem.problem_id, problem.is_approved)}
                  />
                </TableCell>
                <TableCell className="text-gray-300 w-[10%]">{problem.author_id}</TableCell>
                <TableCell className="text-gray-300 w-[10%]">{problem.category.join(', ')}</TableCell>
                <TableCell className="text-gray-300 w-[10%]">{problem.language.join(', ')}</TableCell>
                <TableCell className="text-gray-300 w-[10%]">{new Date(problem.created_at).toLocaleDateString()}</TableCell>
                <TableCell className="w-[15%]">
                  <div className="flex space-x-2">
                    <CyberButton
                      variant="secondary"
                      size="sm"
                      className="text-xs"
                      onClick={() => navigate(`/admin/problems/${problem.problem_id}`)}
                    >
                      상세/수정
                    </CyberButton>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <CyberButton variant="destructive" size="sm">
                          삭제
                        </CyberButton>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>정말 삭제하시겠습니까?</AlertDialogTitle>
                          <AlertDialogDescription>
                            이 작업은 되돌릴 수 없습니다. 문제와 관련된 모든 데이터가 영구적으로 삭제됩니다.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>취소</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(problem.problem_id)}>
                            삭제
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {problems.length === 0 && (
        <p className="text-center text-gray-400 mt-4">등록된 문제가 없습니다.</p>
      )}
    </CyberCard>
  );
};

export default ProblemList;