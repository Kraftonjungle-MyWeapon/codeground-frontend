import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import CyberButton from '@/components/CyberButton';

interface GameExitModalProps {
  isOpen: boolean;
  onConfirmExit: () => void;
  onCancelExit: () => void;
}

const GameExitModal: React.FC<GameExitModalProps> = ({
  isOpen,
  onConfirmExit,
  onCancelExit,
}) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onCancelExit}>
      <AlertDialogContent className="cyber-card border border-cyber-blue/20 bg-card/95 backdrop-blur-sm">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-red-400">경고: 게임 이탈 감지</AlertDialogTitle>
          <AlertDialogDescription className="text-gray-300">
            현재 게임이 진행 중입니다. 이 페이지를 벗어나면 기권 처리되며, 패배로 기록됩니다.
            정말로 게임을 포기하고 나가시겠습니까?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex justify-center space-x-4">
          <AlertDialogCancel asChild>
            <CyberButton variant="secondary" onClick={onCancelExit} className="flex-1">
              아니요, 계속 플레이하겠습니다.
            </CyberButton>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <CyberButton variant="destructive" onClick={() => {
              localStorage.removeItem('gameId');
              localStorage.removeItem('problemId');
              onConfirmExit();
            }} className="flex-1">
              네, 기권하고 나가겠습니다.
            </CyberButton>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default GameExitModal;