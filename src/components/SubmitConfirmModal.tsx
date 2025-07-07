import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import CyberButton from '@/components/CyberButton';

interface SubmitConfirmModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const SubmitConfirmModal: React.FC<SubmitConfirmModalProps> = ({ isOpen, onConfirm, onCancel }) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onCancel}>
      <AlertDialogContent className="cyber-card border border-cyber-blue/20 bg-card/95 backdrop-blur-sm">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-yellow-400">경고</AlertDialogTitle>
          <AlertDialogDescription className="text-gray-300">
            테스트케이스를 전부 통과하지 못했습니다. 그래도 제출하시겠습니까?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex justify-center space-x-4">
          <AlertDialogCancel asChild>
            <CyberButton variant="secondary" onClick={onCancel} className="flex-1">
              아니오
            </CyberButton>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <CyberButton variant="destructive" onClick={onConfirm} className="flex-1">
              예, 제출합니다
            </CyberButton>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default SubmitConfirmModal;
