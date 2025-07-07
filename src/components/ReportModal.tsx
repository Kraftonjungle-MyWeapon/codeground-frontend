import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ReportPayload } from '@/hooks/useCheatDetection';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: ReportPayload) => void;
}

const ReportModal = ({ isOpen, onClose, onSubmit }: ReportModalProps) => {
  const [reason, setReason] = useState('screen_sharing_issue');
  const [description, setDescription] = useState('');

  const handleSubmit = () => {
    if (!reason) {
      alert('신고 유형을 선택해주세요.');
      return;
    }
    onSubmit({ reason, description });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>부정행위 신고</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label>신고 유형</Label>
            <RadioGroup value={reason} onValueChange={setReason}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="screen_sharing_issue" id="r1" />
                <Label htmlFor="r1">화면 공유 문제 (화면을 가리거나, 공유 중단 등)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="outside_activity" id="r2" />
                <Label htmlFor="r2">과도한 화면/마우스 이탈</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="inappropriate_chat" id="r3" />
                <Label htmlFor="r3">불쾌한 채팅</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="other" id="r4" />
                <Label htmlFor="r4">기타</Label>
              </div>
            </RadioGroup>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">상세 내용</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="신고 내용을 구체적으로 작성해주세요."
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>취소</Button>
          <Button onClick={handleSubmit}>신고 제출</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReportModal;