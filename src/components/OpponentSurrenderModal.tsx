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
  
  interface OpponentSurrenderModalProps {
    isOpen: boolean;
    onStay: () => void;
    onLeave: () => void;
  }
  
  export function OpponentSurrenderModal({ isOpen, onStay, onLeave }: OpponentSurrenderModalProps) {
    return (
      <AlertDialog open={isOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>상대방이 항복했습니다.</AlertDialogTitle>
            <AlertDialogDescription>
              계속해서 문제를 푸시겠습니까? 결과를 보러 가실 수도 있습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={onLeave}>결과 보기</AlertDialogCancel>
            <AlertDialogAction onClick={onStay}>계속 풀기</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }