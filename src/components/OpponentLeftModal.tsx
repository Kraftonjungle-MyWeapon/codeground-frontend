
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

interface OpponentLeftModalProps {
  isOpen: boolean;
  onStay: () => void;
  onLeave: () => void;
}

export function OpponentLeftModal({ isOpen, onStay, onLeave }: OpponentLeftModalProps) {
  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>상대방이 나갔습니다.</AlertDialogTitle>
          <AlertDialogDescription>
            계속해서 문제를 푸시겠습니까?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onLeave}>나가기</AlertDialogCancel>
          <AlertDialogAction onClick={onStay}>계속 풀기</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
