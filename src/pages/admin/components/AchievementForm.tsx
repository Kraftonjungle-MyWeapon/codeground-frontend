import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import CyberButton from '@/components/CyberButton';
import { Achievement } from '../hooks/useAchievements';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Badge } from '@/components/ui/badge';
import { Check, ChevronsUpDown, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AchievementFormProps {
  initialData?: Achievement;
  onSubmit: (data: Omit<Achievement, 'achievement_id' | 'created_at' | 'updated_at'>) => void;
  onCancel: () => void;
  isSubmitting: boolean;
  allAchievements: Achievement[];
}

const triggerTypes = [
  { value: 'TOTAL_WIN', label: '총 승리 횟수' },
  { value: 'FIRST_WIN', label: '첫 승리' },
  { value: 'CONSECUTIVE_WIN', label: '연속 승리 횟수' },
  { value: 'TOTAL_LOSS', label: '총 패배 횟수' },
  { value: 'CONSECUTIVE_LOSS', label: '연속 패배 횟수' },
  { value: 'TOTAL_DRAW', label: '총 무승부 횟수' },
  { value: 'PROBLEM_SOLVED', label: '승리한 고유한 문제의 총개수' },
  { value: 'WIN_WITHIN_N_SUBMISSIONS', label: '특정 횟수 이하로 코드를 제출하여 승리' },
  { value: 'WIN_WITHOUT_MISS', label: '오답 제출 없이 승리' },
  { value: 'FAST_WIN', label: '특정 시간(초) 이내에 승리' },
  { value: 'APPROVED_PROBLEM_COUNT', label: '유저가 등록한 문제가 관리자에 의해 승인된 횟수' },
  { value: 'CONSECUTIVE_LOGIN', label: '연속 로그인 일수' },
  { value: 'LOGIN_ON_DAY_OF_WEEK', label: '특정 요일에 로그인' },
  { value: 'TOTAL_REPORTS_MADE', label: '총 신고 횟수' },
];

const rewardTypes = [
  { value: 'BADGE', label: '뱃지' },
  // Add other reward types if they become available
];

const AchievementForm: React.FC<AchievementFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting,
  allAchievements,
}) => {
  const [formData, setFormData] = useState<Omit<Achievement, 'achievement_id' | 'created_at' | 'updated_at'>>({
    title: '',
    description: '',
    achievement_category_id: 1, // 기본값 또는 초기값 설정
    trigger_type: '',
    parameter: 0,
    reward_type: '',
    reward_amount: 0,
    prerequisite_achievement_ids: [],
  });
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        description: initialData.description,
        achievement_category_id: initialData.achievement_category_id || 1,
        trigger_type: initialData.trigger_type,
        parameter: initialData.parameter,
        reward_type: initialData.reward_type,
        reward_amount: initialData.reward_amount,
        prerequisite_achievement_ids: initialData.prerequisite_achievement_ids || [],
      });
    } else {
      // Reset form for new achievement
      setFormData({
        title: '',
        description: '',
        trigger_type: '',
        parameter: 0,
        reward_type: '',
        reward_amount: 0,
        prerequisite_achievement_ids: [],
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'parameter' || name === 'reward_amount' ? Number(value) : value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePrerequisiteChange = (achievementId: number) => {
    setFormData(prev => {
      const newIds = prev.prerequisite_achievement_ids?.includes(achievementId)
        ? prev.prerequisite_achievement_ids.filter(id => id !== achievementId)
        : [...(prev.prerequisite_achievement_ids || []), achievementId];
      return { ...prev, prerequisite_achievement_ids: newIds };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const selectedPrerequisites = allAchievements.filter(ach =>
    formData.prerequisite_achievement_ids?.includes(ach.achievement_id)
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-white">
      {/* ... other form fields ... */}
      <div>
        <Label htmlFor="title" className="text-gray-300">
          제목
        </Label>
        <Input
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          className="bg-gray-800 border-gray-700 text-white"
        />
      </div>
      <div>
        <Label htmlFor="description" className="text-gray-300">
          설명
        </Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          className="bg-gray-800 border-gray-700 text-white"
        />
      </div>
      <div>
        <Label htmlFor="achievement_category_id" className="text-gray-300">
          업적 카테고리 ID
        </Label>
        <Input
          id="achievement_category_id"
          name="achievement_category_id"
          type="number"
          value={formData.achievement_category_id}
          onChange={handleChange}
          required
          className="bg-gray-800 border-gray-700 text-white"
        />
      </div>
      <div>
        <Label htmlFor="trigger_type" className="text-gray-300">
          트리거 타입
        </Label>
        <Select
          name="trigger_type"
          value={formData.trigger_type}
          onValueChange={value => handleSelectChange('trigger_type', value)}
          required
        >
          <SelectTrigger className="w-full bg-gray-800 border-gray-700 text-white">
            <SelectValue placeholder="트리거 타입을 선택하세요" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-700 text-white">
            {triggerTypes.map(type => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="parameter" className="text-gray-300">
          파라미터
        </Label>
        <Input
          id="parameter"
          name="parameter"
          type="number"
          value={formData.parameter}
          onChange={handleChange}
          required
          className="bg-gray-800 border-gray-700 text-white"
        />
      </div>
      <div>
        <Label htmlFor="reward_type" className="text-gray-300">
          보상 타입
        </Label>
        <Select
          name="reward_type"
          value={formData.reward_type}
          onValueChange={value => handleSelectChange('reward_type', value)}
          required
        >
          <SelectTrigger className="w-full bg-gray-800 border-gray-700 text-white">
            <SelectValue placeholder="보상 타입을 선택하세요" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-700 text-white">
            {rewardTypes.map(type => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="reward_amount" className="text-gray-300">
          보상 수량
        </Label>
        <Input
          id="reward_amount"
          name="reward_amount"
          type="number"
          value={formData.reward_amount}
          onChange={handleChange}
          required
          className="bg-gray-800 border-gray-700 text-white"
        />
      </div>
      <div>
        <Label className="text-gray-300">선행 업적 (선택 사항)</Label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-between flex items-center rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white"
            >
              <span className="truncate">
                {selectedPrerequisites.length > 0
                  ? `${selectedPrerequisites.length}개 선택됨`
                  : '선행 업적 선택...'}
              </span>
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-[--radix-popover-trigger-width] p-0 bg-gray-800 border-gray-700">
            <Command>
              <CommandInput placeholder="업적 검색..." className="text-white" />
              <CommandList>
                <CommandEmpty>검색 결과 없음.</CommandEmpty>
                <ScrollArea className="h-[200px]" onWheel={e => e.stopPropagation()}>
                  <CommandGroup>
                    {allAchievements
                      .filter(ach => ach.achievement_id !== initialData?.achievement_id) // Prevent self-selection
                      .map(achievement => (
                        <CommandItem
                          key={achievement.achievement_id}
                          value={achievement.title}
                          onSelect={() => handlePrerequisiteChange(achievement.achievement_id)}
                          className="text-white hover:bg-gray-700"
                        >
                          <Check
                            className={cn(
                              'mr-2 h-4 w-4',
                              selectedPrerequisites.some(
                                (a) => a.achievement_id === achievement.achievement_id
                              )
                                ? 'opacity-100'
                                : 'opacity-0'
                            )}
                          />
                          {achievement.title}
                        </CommandItem>
                      ))}
                  </CommandGroup>
                </ScrollArea>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        <div className="pt-2 space-x-1">
          {selectedPrerequisites.map(ach => (
            <Badge
              key={ach.achievement_id}
              variant="secondary"
              className="bg-gray-700 text-gray-300"
            >
              {ach.title}
              <button
                type="button"
                className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                onClick={() => handlePrerequisiteChange(ach.achievement_id)}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <CyberButton type="button" variant="secondary" onClick={onCancel} disabled={isSubmitting}>
          취소
        </CyberButton>
        <CyberButton type="submit" disabled={isSubmitting}>
          {isSubmitting ? '저장 중...' : '저장'}
        </CyberButton>
      </div>
    </form>
  );
};

export default AchievementForm;
