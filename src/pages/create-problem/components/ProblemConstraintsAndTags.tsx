import CyberButton from '@/components/CyberButton';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, X } from 'lucide-react';

export const ProblemConstraintsAndTags = ({
  problemData,
  newConstraint,
  setNewConstraint,
  addCustomConstraint,
  removeCustomConstraint,
  handleConstraintChange,
  newTag,
  setNewTag,
  addTag,
  removeTag,
}) => {
  return (
    <div className="space-y-6">
      {/* 기본 제약사항 */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-cyber-blue">기본 제약사항</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-gray-300">시간 제한</Label>
            <div className="flex space-x-2">
              <Input
                type="number"
                value={problemData.constraints.timeLimit.value}
                onChange={(e) => handleConstraintChange('timeLimit', 'value', parseInt(e.target.value))}
                className="bg-black/30 border-gray-600 text-white flex-1"
              />
              <Select
                value={problemData.constraints.timeLimit.unit}
                onValueChange={(value) => handleConstraintChange('timeLimit', 'unit', value)}
              >
                <SelectTrigger className="bg-black/30 border-gray-600 text-white w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  <SelectItem value="ms">ms</SelectItem>
                  <SelectItem value="s">s</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-gray-300">메모리 제한</Label>
            <div className="flex space-x-2">
              <Input
                type="number"
                value={problemData.constraints.memoryLimit.value}
                onChange={(e) => handleConstraintChange('memoryLimit', 'value', parseInt(e.target.value))}
                className="bg-black/30 border-gray-600 text-white flex-1"
              />
              <Select
                value={problemData.constraints.memoryLimit.unit}
                onValueChange={(value) => handleConstraintChange('memoryLimit', 'unit', value)}
              >
                <SelectTrigger className="bg-black/30 border-gray-600 text-white w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  <SelectItem value="MB">MB</SelectItem>
                  <SelectItem value="GB">GB</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* 사용자 정의 제약사항 */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-cyber-blue">사용자 정의 제약사항</h3>
          <CyberButton size="sm" onClick={addCustomConstraint}>
            <Plus className="mr-2 h-4 w-4" />
            제약사항 추가
          </CyberButton>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <Input
            placeholder="제약사항 이름"
            value={newConstraint.name}
            onChange={(e) => setNewConstraint(prev => ({ ...prev, name: e.target.value }))}
            className="bg-black/30 border-gray-600 text-white"
          />
          <Input
            placeholder="값"
            value={newConstraint.value}
            onChange={(e) => setNewConstraint(prev => ({ ...prev, value: e.target.value }))}
            className="bg-black/30 border-gray-600 text-white"
          />
          <Input
            placeholder="단위 (선택사항)"
            value={newConstraint.unit}
            onChange={(e) => setNewConstraint(prev => ({ ...prev, unit: e.target.value }))}
            className="bg-black/30 border-gray-600 text-white"
          />
        </div>
        {problemData.constraints.custom.length > 0 && (
          <div className="space-y-2">
            {problemData.constraints.custom.map((constraint, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-black/20 rounded border border-gray-700">
                <span className="text-gray-300">
                  {constraint.name}: {constraint.value} {constraint.unit}
                </span>
                <CyberButton
                  size="sm"
                  variant="secondary"
                  onClick={() => removeCustomConstraint(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </CyberButton>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 태그 */}
      <div className="space-y-2">
        <Label className="text-gray-300">태그</Label>
        <div className="flex space-x-2">
          <Input
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            placeholder="태그 입력"
            className="bg-black/30 border-gray-600 text-white"
            onKeyPress={(e) => e.key === 'Enter' && addTag()}
          />
          <CyberButton size="sm" onClick={addTag}>
            추가
          </CyberButton>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {problemData.tags.map((tag, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm flex items-center space-x-2"
            >
              <span>{tag}</span>
              <button
                onClick={() => removeTag(tag)}
                className="text-red-400 hover:text-red-300"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
