import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import AchievementForm from './AchievementForm';
import { Achievement } from '../hooks/useAchievements';

interface AchievementModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Achievement;
  onSubmit: (data: Omit<Achievement, 'achievement_id' | 'created_at' | 'updated_at'>) => void;
  isSubmitting: boolean;
}

const AchievementModal: React.FC<AchievementModalProps> = ({
  isOpen, onClose, initialData, onSubmit, isSubmitting
}) => {
  const title = initialData ? '업적 수정' : '새 업적 추가';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-gray-900 text-white border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-white">{title}</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <AchievementForm
            initialData={initialData}
            onSubmit={onSubmit}
            onCancel={onClose}
            isSubmitting={isSubmitting}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AchievementModal;
