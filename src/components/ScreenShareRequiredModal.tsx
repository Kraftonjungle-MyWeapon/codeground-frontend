
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import CyberButton from '@/components/CyberButton';

interface ScreenShareRequiredModalProps {
  isOpen: boolean;
  countdown: number;
  onRestartScreenShare: () => void;
}

export function ScreenShareRequiredModal({ isOpen, countdown, onRestartScreenShare }: ScreenShareRequiredModalProps) {
  const minutes = Math.floor(countdown / 60);
  const seconds = countdown % 60;

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>화면 공유 재시작 필요</AlertDialogTitle>
          <AlertDialogDescription>
            화면 공유가 중지되었습니다. 게임을 계속하려면 화면 공유를 다시 시작해야 합니다.
            <br />
            남은 시간: {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <CyberButton onClick={onRestartScreenShare}>
            화면 공유 다시 시작
          </CyberButton>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
