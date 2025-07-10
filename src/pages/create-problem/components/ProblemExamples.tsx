import CyberButton from '@/components/CyberButton';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2 } from 'lucide-react';

export const ProblemExamples = ({ examples, handleExampleChange, addExample, removeExample }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white">예제</h2>
        <CyberButton size="sm" onClick={addExample}>
          <Plus className="mr-2 h-4 w-4" />
          예제 추가
        </CyberButton>
      </div>
      {examples.map((example, index) => (
        <div key={index} className="p-4 bg-black/20 rounded-lg border border-gray-700">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-cyber-blue font-semibold">예제 {index + 1}</h3>
            {examples.length > 1 && (
              <CyberButton
                size="sm"
                variant="secondary"
                onClick={() => removeExample(index)}
              >
                <Trash2 className="h-4 w-4" />
              </CyberButton>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-gray-300">입력</Label>
              <Textarea
                value={example.input}
                onChange={(e) => handleExampleChange(index, 'input', e.target.value)}
                placeholder="입력 예제"
                className="bg-black/30 border-gray-600 text-white font-mono text-sm"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-300">출력</Label>
              <Textarea
                value={example.output}
                onChange={(e) => handleExampleChange(index, 'output', e.target.value)}
                placeholder="출력 예제"
                className="bg-black/30 border-gray-600 text-white font-mono text-sm"
                rows={3}
              />
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <Label className="text-gray-300">설명 (선택사항)</Label>
            <Textarea
              value={example.explanation}
              onChange={(e) => handleExampleChange(index, 'explanation', e.target.value)}
              placeholder="예제 설명"
              className="bg-black/30 border-gray-600 text-white"
              rows={2}
            />
          </div>
        </div>
      ))}
    </div>
  );
};
