import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import CyberButton from '@/components/CyberButton';

interface CreateRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: () => void;
}

const CreateRoomModal = ({ isOpen, onClose, onSubmit }: CreateRoomModalProps) => {
  const [formData, setFormData] = useState({
    title: '',
    language: '',
    category: '',
    difficulty: '',
    isPrivate: false,
    password: ''
  });

  const languages = [
    'Python',
    'JavaScript',
    'Java',
    'C++',
    'C#',
    'Go',
    'Rust',
    'TypeScript'
  ];

  const categories = [
    '자료구조',
    '알고리즘',
    '동적계획법',
    '그래프',
    '문자열',
    '수학',
    '구현',
    '완전탐색',
    '이분탐색',
    '정렬'
  ];

  const difficulties = [
    '초급',
    '중급',
    '고급',
    '전문가'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('대기실 생성:', formData);
    // TODO: 실제 대기실 생성 로직 구현
    if (onSubmit) {
      onSubmit();
    }
    onClose();
    setFormData({
      title: '',
      language: '',
      category: '',
      difficulty: '',
      isPrivate: false,
      password: ''
    });
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-cyber-darker border-cyber-blue/30">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-cyber-blue">
            대기실 생성
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-gray-300">대기실 제목</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="대기실 제목을 입력하세요"
              className="bg-black/30 border-gray-600 text-white"
              required
            />
          </div>

          <div className="space-y-2">
            <Label className="text-gray-300">사용 언어</Label>
            <Select value={formData.language} onValueChange={(value) => handleInputChange('language', value)}>
              <SelectTrigger className="bg-black/30 border-gray-600 text-white">
                <SelectValue placeholder="언어를 선택하세요" />
              </SelectTrigger>
              <SelectContent className="bg-cyber-darker border-gray-600">
                {languages.map((language) => (
                  <SelectItem key={language} value={language} className="text-white hover:bg-cyber-blue/20">
                    {language}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-gray-300">문제 분야</Label>
            <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
              <SelectTrigger className="bg-black/30 border-gray-600 text-white">
                <SelectValue placeholder="분야를 선택하세요" />
              </SelectTrigger>
              <SelectContent className="bg-cyber-darker border-gray-600">
                {categories.map((category) => (
                  <SelectItem key={category} value={category} className="text-white hover:bg-cyber-blue/20">
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-gray-300">문제 난이도</Label>
            <Select value={formData.difficulty} onValueChange={(value) => handleInputChange('difficulty', value)}>
              <SelectTrigger className="bg-black/30 border-gray-600 text-white">
                <SelectValue placeholder="난이도를 선택하세요" />
              </SelectTrigger>
              <SelectContent className="bg-cyber-darker border-gray-600">
                {difficulties.map((difficulty) => (
                  <SelectItem key={difficulty} value={difficulty} className="text-white hover:bg-cyber-blue/20">
                    {difficulty}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isPrivate"
                checked={formData.isPrivate}
                onCheckedChange={(checked) => handleInputChange('isPrivate', checked as boolean)}
                className="border-gray-600"
              />
              <Label htmlFor="isPrivate" className="text-gray-300">
                비공개 대기실로 설정
              </Label>
            </div>

            {formData.isPrivate && (
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-300">비밀번호</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="비밀번호를 입력하세요"
                  className="bg-black/30 border-gray-600 text-white"
                  required={formData.isPrivate}
                />
              </div>
            )}
          </div>

          <div className="flex space-x-3 pt-4">
            <CyberButton type="submit" className="flex-1">
              대기실 생성
            </CyberButton>
            <CyberButton 
              type="button"
              variant="secondary" 
              onClick={onClose}
              className="flex-1"
            >
              취소
            </CyberButton>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateRoomModal;
