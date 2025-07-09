import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export const ProblemDescription = ({ description, handleInputChange }) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="description" className="text-gray-300">문제 내용</Label>
      <Textarea
        id="description"
        value={description}
        onChange={(e) => handleInputChange('description', e.target.value)}
        placeholder="문제 설명을 입력하세요"
        className="bg-black/30 border-gray-600 text-white min-h-[200px]"
      />
    </div>
  );
};
