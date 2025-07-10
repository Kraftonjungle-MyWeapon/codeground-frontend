import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { tiers } from '@/utils/lpSystem';
import { X } from 'lucide-react';

const availableLanguages = [
  { value: 'python', label: 'Python' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'java', label: 'Java' },
  { value: 'cpp', label: 'C++' },
  { value: 'c', label: 'C' }
];

const availableCategories = [
  { value: 'algorithm', label: '알고리즘' },
  { value: 'data-structure', label: '자료구조' },
  { value: 'dynamic-programming', label: '동적계획법' },
  { value: 'graph', label: '그래프' },
  { value: 'string', label: '문자열' },
  { value: 'math', label: '수학' },
  { value: 'implementation', label: '구현' },
  { value: 'greedy', label: '그리디' },
  { value: 'sorting', label: '정렬' },
  { value: 'search', label: '탐색' }
];

const getLanguageLabel = (value: string) => {
  return availableLanguages.find(lang => lang.value === value)?.label || value;
};

const getCategoryLabel = (value: string) => {
  return availableCategories.find(cat => cat.value === value)?.label || value;
};

export const ProblemBasicInfo = ({ problemData, handleInputChange, handleLanguageToggle, handleCategoryToggle }) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title" className="text-gray-300">문제 제목</Label>
        <Input
          id="title"
          value={problemData.title}
          onChange={(e) => handleInputChange('title', e.target.value)}
          placeholder="문제 제목을 입력하세요"
          className="bg-black/30 border-gray-600 text-white"
        />
      </div>

      {/* 프로그래밍 언어 선택 */}
      <div className="space-y-2">
        <Label className="text-gray-300">프로그래밍 언어</Label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {availableLanguages.map((language) => (
            <div key={language.value} className="flex items-center space-x-2">
              <Checkbox
                id={`lang-${language.value}`}
                checked={problemData.languages.includes(language.value)}
                onCheckedChange={() => handleLanguageToggle(language.value)}
                className="border-gray-600 data-[state=checked]:bg-cyber-blue"
              />
              <Label htmlFor={`lang-${language.value}`} className="text-gray-300 cursor-pointer">
                {language.label}
              </Label>
            </div>
          ))}
        </div>
        {problemData.languages.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {problemData.languages.map((lang) => (
              <span key={lang} className="px-3 py-1 bg-cyber-blue/20 text-cyber-blue rounded-full text-sm flex items-center space-x-2">
                <span>{getLanguageLabel(lang)}</span>
                <button onClick={() => handleLanguageToggle(lang)} className="text-red-400 hover:text-red-300">
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* 카테고리 선택 */}
      <div className="space-y-2">
        <Label className="text-gray-300">카테고리</Label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {availableCategories.map((category) => (
            <div key={category.value} className="flex items-center space-x-2">
              <Checkbox
                id={`cat-${category.value}`}
                checked={problemData.categories.includes(category.value)}
                onCheckedChange={() => handleCategoryToggle(category.value)}
                className="border-gray-600 data-[state=checked]:bg-cyber-blue"
              />
              <Label htmlFor={`cat-${category.value}`} className="text-gray-300 cursor-pointer">
                {category.label}
              </Label>
            </div>
          ))}
        </div>
        {problemData.categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {problemData.categories.map((cat) => (
              <span key={cat} className="px-3 py-1 bg-cyber-purple/20 text-cyber-purple rounded-full text-sm flex items-center space-x-2">
                <span>{getCategoryLabel(cat)}</span>
                <button onClick={() => handleCategoryToggle(cat)} className="text-red-400 hover:text-red-300">
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* 난이도 (티어 기반) */}
      <div className="space-y-2">
        <Label htmlFor="difficulty" className="text-gray-300">난이도</Label>
        <Select value={problemData.difficulty} onValueChange={(value) => handleInputChange('difficulty', value)}>
          <SelectTrigger className="bg-black/30 border-gray-600 text-white">
            <SelectValue placeholder="난이도 선택" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-600">
            {tiers.slice(0, -1).map((tier) => (
              <SelectItem key={tier.name} value={tier.name}>
                <div className="flex items-center space-x-2">
                  <tier.icon className={`h-4 w-4 ${tier.color}`} />
                  <span>{tier.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
