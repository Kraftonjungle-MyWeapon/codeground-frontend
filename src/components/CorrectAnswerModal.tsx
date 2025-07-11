import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
  } from '@/components/ui/alert-dialog';
  
  interface CorrectAnswerModalProps {
    isOpen: boolean;
    isWinner: boolean;
    onStay: () => void;
    onLeave: () => void;
  }
  
  export function CorrectAnswerModal({ isOpen, isWinner, onStay, onLeave }: CorrectAnswerModalProps) {
    return (
      <AlertDialog open={isOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{isWinner ? "정답입니다! 승리하셨습니다." : "상대방이 먼저 정답을 맞췄습니다."}</AlertDialogTitle>
            <AlertDialogDescription>
              {isWinner ? "결과를 보러 가시겠습니까? 아니면 코드를 검토하시겠습니까?" : "결과를 보러 가시겠습니까? 아니면 계속해서 문제를 푸시겠습니까?"}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={onLeave}>결과 보기</AlertDialogCancel>
            <AlertDialogAction onClick={onStay}>{isWinner ? "검토하기" : "계속 풀기"}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }