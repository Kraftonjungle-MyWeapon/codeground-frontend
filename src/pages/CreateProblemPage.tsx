import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import CyberCard from '@/components/CyberCard';
import CyberButton from '@/components/CyberButton';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Save, Plus, Trash2, X, Code, Image, Upload } from 'lucide-react';
import { tiers } from '@/utils/lpSystem';
import { createProblem } from '@/utils/api';
import { useToast } from '@/components/ui/use-toast';

const CreateProblemPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [problemData, setProblemData] = useState({
    title: '',
    description: '',
    inputFormat: '',
    outputFormat: '',
    constraints: '',
    languages: [] as string[],
    categories: [] as string[],
    difficulty: '',
    examples: [{ input: '', output: '', explanation: '' }],
    testCases: [{ input: '', output: '' }],
    exampleCode: {
      python: '',
      java: '',
      c: '',
      cpp: ''
    },
    timeLimitMs: 2000,
    memoryLimitKb: 262144
  });

  const [uploadedImages, setUploadedImages] = useState<{[key: string]: { file: File, dataURL: string }}>({});

  const availableLanguages = [
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'c', label: 'C' },
    { value: 'cpp', label: 'C++' }
  ];

  const availableCategories = [
    { value: 'implementation', label: '구현' },
    { value: 'simulation', label: '시뮬레이션' },
    { value: 'dp', label: 'DP (동적계획법)' },
    { value: 'greedy', label: '그리디' },
    { value: 'stack', label: '스택' },
    { value: 'queue', label: '큐' },
    { value: 'string', label: '문자열' },
    { value: 'math', label: '수학' },
    { value: 'geometry', label: '기하학' },
    { value: 'sorting', label: '정렬' },
    { value: 'binary-search', label: '이분탐색' },
    { value: 'parametric-search', label: '매개변수 탐색' },
    { value: 'graph', label: '그래프' },
    { value: 'dfs', label: 'DFS' },
    { value: 'bfs', label: 'BFS' },
    { value: 'shortest-path', label: '최단거리 탐색' }
  ];

  const handleInputChange = (field: string, value: any) => {
    setProblemData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const originalFileName = file.name.split('.').slice(0, -1).join('.'); // 확장자 제외한 원본 파일명
        const fileExtension = file.name.split('.').pop(); // 원본 파일 확장자
        const normalizedFileName = originalFileName.normalize('NFC'); // 한글 정규화
        const safeFileName = normalizedFileName.replace(/[^a-zA-Z0-9_\-.가-힣]/g, '_'); // 안전한 파일명 (한글 포함)
        const timestamp = Date.now();
        const imageId = `img_${timestamp}_${safeFileName}`; // 이미지 태그에 사용될 ID

        // 백엔드로 전송될 파일명 (imageId + 원본 확장자)
        const newFileName = `${imageId}.${fileExtension}`;

        // 새로운 File 객체 생성 (이름만 변경)
        const renamedFile = new File([file], newFileName, { type: file.type });

        const imageData = e.target?.result as string;
        setUploadedImages(prev => ({
          ...prev,
          [imageId]: { file: renamedFile, dataURL: imageData } // 이름이 변경된 File 객체 저장
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const insertImageMarker = (imageId: string) => {
    const marker = `\n[IMAGE:${imageId}]\n`;
    setProblemData(prev => ({
      ...prev,
      description: prev.description + marker
    }));
  };

  const removeImage = (imageId: string) => {
    setUploadedImages(prev => {
      const newImages = { ...prev };
      delete newImages[imageId];
      return newImages;
    });
    
    // Remove image markers from description
    setProblemData(prev => ({
      ...prev,
      description: prev.description.replace(new RegExp(`\\n?\\[IMAGE:${imageId}\\]\\n?`, 'g'), '')
    }));
  };

  const handleLanguageToggle = (language: string) => {
    setProblemData(prev => ({
      ...prev,
      languages: prev.languages.includes(language)
        ? prev.languages.filter(l => l !== language)
        : [...prev.languages, language]
    }));
  };

  const handleCategoryToggle = (category: string) => {
    setProblemData(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
  };

  const handleExampleChange = (index: number, field: string, value: string) => {
    const updatedExamples = [...problemData.examples];
    updatedExamples[index] = { ...updatedExamples[index], [field]: value };
    setProblemData(prev => ({
      ...prev,
      examples: updatedExamples
    }));
  };

  const addExample = () => {
    setProblemData(prev => ({
      ...prev,
      examples: [...prev.examples, { input: '', output: '', explanation: '' }]
    }));
  };

  const removeExample = (index: number) => {
    setProblemData(prev => ({
      ...prev,
      examples: prev.examples.filter((_, i) => i !== index)
    }));
  };

  const handleTestCaseChange = (index: number, field: string, value: string) => {
    const updatedTestCases = [...problemData.testCases];
    updatedTestCases[index] = { ...updatedTestCases[index], [field]: value };
    setProblemData(prev => ({
      ...prev,
      testCases: updatedTestCases
    }));
  };

  const addTestCase = () => {
    setProblemData(prev => ({
      ...prev,
      testCases: [...prev.testCases, { input: '', output: '' }]
    }));
  };

  const removeTestCase = (index: number) => {
    setProblemData(prev => ({
      ...prev,
      testCases: prev.testCases.filter((_, i) => i !== index)
    }));
  };

  const handleExampleCodeChange = (language: string, code: string) => {
    setProblemData(prev => ({
      ...prev,
      exampleCode: {
        ...prev.exampleCode,
        [language]: code
      }
    }));
  };

  const handleSubmit = async () => {
    const problemJsonData = {
      title: problemData.title,
      description: problemData.description,
      input_format: problemData.inputFormat,
      output_format: problemData.outputFormat,
      time_limit_milliseconds: String(problemData.timeLimitMs),
      memory_limit_kilobytes: String(problemData.memoryLimitKb),
      difficulty: problemData.difficulty.toLowerCase(),
      category: problemData.categories.map(cat => availableCategories.find(ac => ac.value === cat)?.label || cat),
      constraints: problemData.constraints,
      languages: problemData.languages,
      test_cases: [
        ...problemData.examples.map((example, index) => ({
          input: example.input,
          output: example.output,
          description: example.explanation,
          visibility: "public"
        })),
        ...problemData.testCases.map((testCase, index) => ({
          input: testCase.input,
          output: testCase.output,
          visibility: "hidden"
        }))
      ]
    };

    const formData = new FormData();
    formData.append("problem", JSON.stringify(problemJsonData));

    Object.values(uploadedImages).forEach(image => {
      formData.append("images", image.file);
    });

    try {
      await createProblem(formData);
      toast({
        title: "문제 등록 성공",
        description: "새로운 문제가 성공적으로 등록되었습니다.",
        variant: "success",
      });
      navigate('/home');
    } catch (error) {
      console.error("문제 등록 실패:", error);
      toast({
        title: "문제 등록 실패",
        description: error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  const getLanguageLabel = (value: string) => {
    return availableLanguages.find(lang => lang.value === value)?.label || value;
  };

  const getCategoryLabel = (value: string) => {
    return availableCategories.find(cat => cat.value === value)?.label || value;
  };

  const uniqueMainTierNames = Array.from(new Set(tiers.map(tier => {
    if (tier.name.includes(' ')) {
      return tier.name.split(' ')[0];
    }
    return tier.name;
  })));

  const mainTiersForSelect = uniqueMainTierNames.map(mainTierName => {
    const foundTier = tiers.find(tier => {
      if (tier.name.includes(' ')) {
        return tier.name.split(' ')[0] === mainTierName;
      }
      return tier.name === mainTierName;
    });
    return {
      name: mainTierName,
      icon: foundTier?.icon,
      color: foundTier?.color,
    };
  });

  return (
    <div className="min-h-screen cyber-grid">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center mb-8">
            <CyberButton 
              variant="secondary" 
              size="sm" 
              onClick={() => navigate('/home')}
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4" />
            </CyberButton>
            <h1 className="text-3xl font-bold text-cyber-blue">코딩테스트 문제 등록</h1>
          </div>

          <div className="space-y-6">
            {/* 기본 정보 */}
            <CyberCard className="p-6">
              <h2 className="text-xl font-bold text-white mb-4">기본 정보</h2>
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

                
                
                <div className="space-y-2">
                  <Label className="text-gray-300">프로그래밍 언어</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
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

                
                
                <div className="space-y-2">
                  <Label className="text-gray-300">알고리즘 카테고리</Label>
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

                {/* 난이도 */}
                <div className="space-y-2">
                  <Label htmlFor="difficulty" className="text-gray-300">난이도</Label>
                  <Select value={problemData.difficulty} onValueChange={(value) => handleInputChange('difficulty', value)}>
                    <SelectTrigger className="bg-black/30 border-gray-600 text-white">
                      <SelectValue placeholder="난이도 선택" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600">
                      {mainTiersForSelect.map((tier) => (
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
            </CyberCard>

            {/* 문제 설명 */}
            <CyberCard className="p-6">
              <h2 className="text-xl font-bold text-white mb-4">문제 설명</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-gray-300">문제 내용</Label>
                  
                  {/* 이미지 업로드 및 관리 */}
                  <div className="mb-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <Label htmlFor="image-upload" className="text-gray-400 text-sm">이미지 추가:</Label>
                      <Input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="bg-black/30 border-gray-600 text-white w-auto"
                      />
                    </div>
                    
                    {/* 업로드된 이미지 목록 */}
                    {Object.keys(uploadedImages).length > 0 && (
                      <div className="space-y-2">
                        <Label className="text-gray-400 text-sm">업로드된 이미지:</Label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {Object.entries(uploadedImages).map(([imageId, imageData]) => (
                            <div key={imageId} className="relative group">
                              <img 
                                src={imageData.dataURL} 
                                alt={`Uploaded ${imageId}`}
                                className="w-full h-20 object-cover rounded border border-gray-600"
                              />
                              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                                <CyberButton
                                  size="sm"
                                  onClick={() => insertImageMarker(imageId)}
                                  className="text-xs px-2 py-1"
                                >
                                  <Image className="h-3 w-3 mr-1" />
                                  삽입
                                </CyberButton>
                                <CyberButton
                                  variant="secondary"
                                  size="sm"
                                  onClick={() => removeImage(imageId)}
                                  className="text-xs px-2 py-1"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </CyberButton>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <Textarea
                    id="description"
                    value={problemData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="문제 설명을 입력하세요. 이미지를 삽입하려면 위에서 이미지를 업로드하고 '삽입' 버튼을 클릭하세요."
                    className="bg-black/30 border-gray-600 text-white min-h-[200px]"
                  />
                  <div className="text-xs text-gray-400">
                    * 이미지는 [IMAGE:이미지ID] 형태로 텍스트에 삽입됩니다.
                  </div>
                </div>

                
                
                <div className="space-y-2">
                  <Label htmlFor="inputFormat" className="text-gray-300">입력 형식</Label>
                  <Textarea
                    id="inputFormat"
                    value={problemData.inputFormat}
                    onChange={(e) => handleInputChange('inputFormat', e.target.value)}
                    placeholder="입력 형식을 설명하세요 (예: 첫 번째 줄에 정수 N이 주어진다.)"
                    className="bg-black/30 border-gray-600 text-white"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="outputFormat" className="text-gray-300">출력 형식</Label>
                  <Textarea
                    id="outputFormat"
                    value={problemData.outputFormat}
                    onChange={(e) => handleInputChange('outputFormat', e.target.value)}
                    placeholder="출력 형식을 설명하세요 (예: 결과를 한 줄에 출력한다.)"
                    className="bg-black/30 border-gray-600 text-white"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="constraints" className="text-gray-300">제한사항</Label>
                  <Textarea
                    id="constraints"
                    value={problemData.constraints}
                    onChange={(e) => handleInputChange('constraints', e.target.value)}
                    placeholder="제한사항을 입력하세요 (예: 1 ≤ N ≤ 1000, 1 ≤ K ≤ 100,000)"
                    className="bg-black/30 border-gray-600 text-white"
                    rows={4}
                  />
                </div>
              </div>
            </CyberCard>

            
            
            <CyberCard className="p-6">
              <h2 className="text-xl font-bold text-white mb-4">실행 제한</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-gray-300">시간 제한 (ms)</Label>
                  <Input
                    type="number"
                    value={problemData.timeLimitMs}
                    onChange={(e) => handleInputChange('timeLimitMs', parseInt(e.target.value))}
                    className="bg-black/30 border-gray-600 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-300">메모리 제한 (KB)</Label>
                  <Input
                    type="number"
                    value={problemData.memoryLimitKb}
                    onChange={(e) => handleInputChange('memoryLimitKb', parseInt(e.target.value))}
                    className="bg-black/30 border-gray-600 text-white"
                  />
                </div>
              </div>
            </CyberCard>

            <CyberCard className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white">예제</h2>
                <CyberButton size="sm" onClick={addExample}>
                  <Plus className="mr-2 h-4 w-4" />
                  예제 추가
                </CyberButton>
              </div>
              <div className="space-y-4">
                {problemData.examples.map((example, index) => (
                  <div key={index} className="p-4 bg-black/20 rounded-lg border border-gray-700">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-cyber-blue font-semibold">예제 {index + 1}</h3>
                      {problemData.examples.length > 1 && (
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
            </CyberCard>

            <CyberCard className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white">테스트 케이스</h2>
                <CyberButton size="sm" onClick={addTestCase}>
                  <Plus className="mr-2 h-4 w-4" />
                  테스트 케이스 추가
                </CyberButton>
              </div>
              <div className="space-y-4">
                {problemData.testCases.map((testCase, index) => (
                  <div key={index} className="p-4 bg-black/20 rounded-lg border border-gray-700">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-green-400 font-semibold">테스트 케이스 {index + 1}</h3>
                      {problemData.testCases.length > 1 && (
                        <CyberButton 
                          size="sm" 
                          variant="secondary" 
                          onClick={() => removeTestCase(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </CyberButton>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-gray-300">입력</Label>
                        <Textarea
                          value={testCase.input}
                          onChange={(e) => handleTestCaseChange(index, 'input', e.target.value)}
                          placeholder="테스트 케이스 입력"
                          className="bg-black/30 border-gray-600 text-white font-mono text-sm"
                          rows={3}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-gray-300">출력</Label>
                        <Textarea
                          value={testCase.output}
                          onChange={(e) => handleTestCaseChange(index, 'output', e.target.value)}
                          placeholder="테스트 케이스 출력"
                          className="bg-black/30 border-gray-600 text-white font-mono text-sm"
                          rows={3}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CyberCard>

            <CyberCard className="p-6">
              <div className="flex items-center mb-4">
                <Code className="mr-2 h-5 w-5 text-cyber-blue" />
                <h2 className="text-xl font-bold text-white">예시 코드</h2>
              </div>
              <div className="space-y-4">
                {availableLanguages.map((language) => (
                  <div key={language.value} className="space-y-2">
                    <Label className="text-gray-300">{language.label} 예시 코드</Label>
                    <Textarea
                      value={problemData.exampleCode[language.value as keyof typeof problemData.exampleCode]}
                      onChange={(e) => handleExampleCodeChange(language.value, e.target.value)}
                      placeholder={`${language.label} 예시 코드를 입력하세요`}
                      className="bg-black/30 border-gray-600 text-white font-mono text-sm"
                      rows={6}
                    />
                  </div>
                ))}
              </div>
            </CyberCard>

            {/* 저장 버튼 */}
            <div className="flex justify-end space-x-4">
              <CyberButton variant="secondary" onClick={() => navigate('/home')}>
                취소
              </CyberButton>
              <CyberButton onClick={handleSubmit}>
                <Save className="mr-2 h-4 w-4" />
                문제 등록
              </CyberButton>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreateProblemPage;