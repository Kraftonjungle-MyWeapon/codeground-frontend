import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import CyberCard from '@/components/CyberCard';
import CyberButton from '@/components/CyberButton';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Upload, Save, Plus, Trash2, X } from 'lucide-react';
import { createProblem } from '@/utils/api';
import { useToast } from '@/components/ui/use-toast';
import ProblemDescriptionRenderer from '@/components/ProblemDescriptionRenderer';
import { tiers } from '@/utils/lpSystem';

interface ProblemData {
  title: string;
  description: string;
  input_format: string;
  output_format: string;
  time_limit_milliseconds: string;
  memory_limit_kilobytes: string;
  difficulty: string;
  category: string[];
  languages: string[];
  constraints: string;
  test_cases: Array<{
    input: string;
    output: string;
    description?: string;
    visibility: "public" | "hidden";
  }>;
}

const UploadProblemPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [jsonFile, setJsonFile] = useState<File | null>(null);
  const [problemData, setProblemData] = useState<ProblemData | null>(null);
  const [uploadedImages, setUploadedImages] = useState<{[placeholderId: string]: { file: File, generatedImageId: string, dataURL: string }}>({});

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
      return tier.name;
    });
    return {
      name: mainTierName,
      icon: foundTier?.icon,
      color: foundTier?.color,
    };
  });

  const handleJsonFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/json') {
      setJsonFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const parsedData: ProblemData = JSON.parse(e.target?.result as string);
          // Convert category labels to values if necessary
          const processedCategories = parsedData.category.map(catLabel => {
            const foundCategory = availableCategories.find(cat => cat.label === catLabel);
            return foundCategory ? foundCategory.value : catLabel; // Use value if found, otherwise keep original
          });
          setProblemData({ ...parsedData, category: processedCategories });
          setUploadedImages({}); // Reset images when new JSON is loaded
        } catch (error) {
          setProblemData(null);
          setJsonFile(null);
          toast({
            title: "JSON 파싱 오류",
            description: "유효한 JSON 파일이 아닙니다.",
            variant: "destructive",
          });
        }
      };
      reader.readAsText(file);
    } else {
      setJsonFile(null);
      setProblemData(null);
      toast({
        title: "파일 형식 오류",
        description: "JSON 파일만 업로드할 수 있습니다.",
        variant: "destructive",
      });
    }
  };

  const handleImageUpload = (placeholderId: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const originalFileName = file.name.split('.').slice(0, -1).join('.');
        const fileExtension = file.name.split('.').pop();
        const normalizedFileName = originalFileName.normalize('NFC');
        const safeFileName = normalizedFileName.replace(/[^a-zA-Z0-9_\-.가-힣]/g, '_');
        const timestamp = Date.now();
        const generatedImageId = `img_${timestamp}_${safeFileName}`; // This will be the actual file name sent to backend

        const imageData = e.target?.result as string;
        setUploadedImages(prev => ({
          ...prev,
          [placeholderId]: { file: new File([file], `${generatedImageId}.${fileExtension}`, { type: file.type }), generatedImageId, dataURL: imageData }
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProblemDataChange = (field: keyof ProblemData, value: string | string[]) => {
    setProblemData(prev => {
      if (!prev) return null;
      return {
        ...prev,
        [field]: value
      };
    });
  };

  const handleLanguageToggle = (language: string) => {
    setProblemData(prev => {
      if (!prev) return null;
      const updatedLanguages = prev.languages.includes(language)
        ? prev.languages.filter(l => l !== language)
        : [...prev.languages, language];
      return { ...prev, languages: updatedLanguages };
    });
  };

  const handleCategoryToggle = (category: string) => {
    setProblemData(prev => {
      if (!prev) return null;
      const updatedCategories = prev.category.includes(category)
        ? prev.category.filter(c => c !== category)
        : [...prev.category, category];
      return { ...prev, category: updatedCategories };
    });
  };

  const handleTestCaseChange = (index: number, field: keyof (typeof problemData.test_cases)[0], value: string) => {
    setProblemData(prev => {
      if (!prev) return null;
      const updatedTestCases = [...prev.test_cases];
      updatedTestCases[index] = { ...updatedTestCases[index], [field]: value };
      return { ...prev, test_cases: updatedTestCases };
    });
  };

  const addTestCase = (visibility: "public" | "hidden" = "public") => {
    setProblemData(prev => {
      if (!prev) return null;
      return {
        ...prev,
        test_cases: [...prev.test_cases, { input: '', output: '', visibility: visibility }]
      };
    });
  };

  const removeTestCase = (index: number) => {
    setProblemData(prev => {
      if (!prev) return null;
      return {
        ...prev,
        test_cases: prev.test_cases.filter((_, i) => i !== index)
      };
    });
  };

  const handleSubmit = async () => {
    if (!problemData || !jsonFile) {
      toast({
        title: "업로드 오류",
        description: "문제 JSON 파일을 먼저 업로드하고 모든 이미지를 등록해주세요.",
        variant: "destructive",
      });
      return;
    }

    let finalDescription = problemData.description;
    const imagePlaceholders = Array.from(finalDescription.matchAll(/[\[]IMAGE:([^\]]+)\]/g));
    const missingImages: string[] = [];

    // First, replace mapped images and collect missing ones
    for (const match of imagePlaceholders) {
      const placeholderId = match[1];
      if (uploadedImages[placeholderId]) {
        finalDescription = finalDescription.replace(new RegExp(`[\[]IMAGE:${placeholderId}\]`, 'g'), `[IMAGE:${uploadedImages[placeholderId].generatedImageId}]`);
      } else {
        missingImages.push(match[0]); // Store the full tag to remove later
      }
    }

    // Remove missing image tags from the final description
    missingImages.forEach(tag => {
      finalDescription = finalDescription.replace(new RegExp(tag.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g'), '');
    });

    const finalProblemData = {
      ...problemData,
      description: finalDescription,
    };

    const formData = new FormData();
    
    formData.append("problem", JSON.stringify(finalProblemData));

    // Append only actually uploaded image files
    Object.values(uploadedImages).forEach(imageData => {
      formData.append("images", imageData.file);
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
            <h1 className="text-3xl font-bold text-cyber-blue">문제 등록</h1>
          </div>

          <div className="space-y-6">
            <CyberCard className="p-6">
              <h2 className="text-xl font-bold text-white mb-4">문제 JSON 파일 업로드</h2>
              <div className="space-y-2">
                <Label htmlFor="json-file" className="text-gray-300">문제 정의 JSON 파일</Label>
                <Input
                  id="json-file"
                  type="file"
                  accept=".json"
                  onChange={handleJsonFileChange}
                  className="bg-black/30 border-gray-600 text-white"
                />
                {jsonFile && (
                  <p className="text-sm text-gray-400">선택된 파일: {jsonFile.name}</p>
                )}
              </div>
            </CyberCard>

            {problemData && (
              <>
                <CyberCard className="p-6">
                  <h2 className="text-xl font-bold text-white mb-4">문제 미리보기</h2>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="preview-title" className="text-gray-300">문제 제목</Label>
                      <Input
                        id="preview-title"
                        value={problemData.title}
                        onChange={(e) => handleProblemDataChange('title', e.target.value)}
                        className="bg-black/30 border-gray-600 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="preview-description" className="text-gray-300">문제 설명</Label>
                      <Textarea
                        id="preview-description"
                        value={problemData.description}
                        onChange={(e) => handleProblemDataChange('description', e.target.value)}
                        placeholder="문제 설명을 입력하세요. [IMAGE:X] 형태로 이미지 태그를 사용할 수 있습니다."
                        className="bg-black/30 border-gray-600 text-white min-h-[200px]"
                      />
                      <div className="mt-2">
                        <div className="text-sm text-gray-400 mb-2">미리보기:</div>
                        <ProblemDescriptionRenderer 
                          description={problemData.description} 
                          imageMap={uploadedImages}
                          onImageUpload={handleImageUpload}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="preview-input-format" className="text-gray-300">입력 형식</Label>
                      <Textarea
                        id="preview-input-format"
                        value={problemData.input_format}
                        onChange={(e) => handleProblemDataChange('input_format', e.target.value)}
                        placeholder="입력 형식을 설명하세요"
                        className="bg-black/30 border-gray-600 text-white"
                        rows={3}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="preview-output-format" className="text-gray-300">출력 형식</Label>
                      <Textarea
                        id="preview-output-format"
                        value={problemData.output_format}
                        onChange={(e) => handleProblemDataChange('output_format', e.target.value)}
                        placeholder="출력 형식을 설명하세요"
                        className="bg-black/30 border-gray-600 text-white"
                        rows={3}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="preview-constraints" className="text-gray-300">제한사항</Label>
                      <Textarea
                        id="preview-constraints"
                        value={problemData.constraints}
                        onChange={(e) => handleProblemDataChange('constraints', e.target.value)}
                        placeholder="제한사항을 입력하세요"
                        className="bg-black/30 border-gray-600 text-white"
                        rows={4}
                      />
                    </div>

                    {/* 난이도 */}
                    <div className="space-y-2">
                      <Label htmlFor="difficulty" className="text-gray-300">난이도</Label>
                      <Select value={problemData.difficulty} onValueChange={(value) => handleProblemDataChange('difficulty', value)}>
                        <SelectTrigger className="bg-black/30 border-gray-600 text-white">
                          <SelectValue placeholder="난이도 선택" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-600">
                          {mainTiersForSelect.map((tier) => (
                            <SelectItem key={tier.name} value={tier.name}>
                              <div className="flex items-center space-x-2">
                                {tier.icon && <tier.icon className={`h-4 w-4 ${tier.color}`} />}
                                <span>{tier.name}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* 프로그래밍 언어 */}
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
                              <span>{availableLanguages.find(l => l.value === lang)?.label || lang}</span>
                              <button onClick={() => handleLanguageToggle(lang)} className="text-red-400 hover:text-red-300">
                                <X className="h-3 w-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* 알고리즘 카테고리 */}
                    <div className="space-y-2">
                      <Label className="text-gray-300">알고리즘 카테고리</Label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {availableCategories.map((category) => (
                          <div key={category.value} className="flex items-center space-x-2">
                            <Checkbox
                              id={`cat-${category.value}`}
                              checked={problemData.category.includes(category.value)}
                              onCheckedChange={() => handleCategoryToggle(category.value)}
                              className="border-gray-600 data-[state=checked]:bg-cyber-blue"
                            />
                            <Label htmlFor={`cat-${category.value}`} className="text-gray-300 cursor-pointer">
                              {category.label}
                            </Label>
                          </div>
                        ))}
                      </div>
                      {problemData.category.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {problemData.category.map((cat) => (
                            <span key={cat} className="px-3 py-1 bg-cyber-purple/20 text-cyber-purple rounded-full text-sm flex items-center space-x-2">
                              <span>{availableCategories.find(c => c.value === cat)?.label || cat}</span>
                              <button onClick={() => handleCategoryToggle(cat)} className="text-red-400 hover:text-red-300">
                                <X className="h-3 w-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* 시간 및 메모리 제한 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-gray-300">시간 제한 (ms)</Label>
                        <Input
                          type="number"
                          value={problemData.time_limit_milliseconds}
                          onChange={(e) => handleProblemDataChange('time_limit_milliseconds', e.target.value)}
                          className="bg-black/30 border-gray-600 text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-gray-300">메모리 제한 (KB)</Label>
                        <Input
                          type="number"
                          value={problemData.memory_limit_kilobytes}
                          onChange={(e) => handleProblemDataChange('memory_limit_kilobytes', e.target.value)}
                          className="bg-black/30 border-gray-600 text-white"
                        />
                      </div>
                    </div>

                    {/* 테스트 케이스 */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between mb-4">
                        <Label className="text-gray-300">테스트 케이스</Label>
                        <div className="flex space-x-2">
                          <CyberButton size="sm" onClick={() => addTestCase("public")}>
                            <Plus className="mr-2 h-4 w-4" />
                            공개 테스트 케이스 추가
                          </CyberButton>
                          <CyberButton size="sm" variant="secondary" onClick={() => addTestCase("hidden")}>
                            <Plus className="mr-2 h-4 w-4" />
                            숨김 테스트 케이스 추가
                          </CyberButton>
                        </div>
                      </div>
                      {problemData.test_cases.map((tc, index) => (
                        <div key={index} className="bg-black/20 p-3 rounded-lg mb-2 border border-gray-700">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className={`font-semibold ${tc.visibility === "public" ? "text-green-400" : "text-yellow-400"}`}>
                              테스트 케이스 {index + 1} ({tc.visibility === "public" ? "공개" : "숨김"})
                            </h3>
                            <CyberButton 
                              size="sm" 
                              variant="secondary" 
                              onClick={() => removeTestCase(index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </CyberButton>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-gray-300">입력</Label>
                            <Textarea
                              value={tc.input}
                              onChange={(e) => handleTestCaseChange(index, 'input', e.target.value)}
                              placeholder="테스트 케이스 입력"
                              className="bg-black/30 border-gray-600 text-white font-mono text-sm"
                              rows={3}
                            />
                          </div>
                          <div className="border-t border-gray-700 my-4"></div> {/* 구분선 추가 */}
                          <div className="space-y-2 mt-2">
                            <Label className="text-gray-300">출력</Label>
                            <Textarea
                              value={tc.output}
                              onChange={(e) => handleTestCaseChange(index, 'output', e.target.value)}
                              placeholder="테스트 케이스 출력"
                              className="bg-black/30 border-gray-600 text-white font-mono text-sm"
                              rows={3}
                            />
                          </div>
                          {tc.description !== undefined && (
                            <div className="space-y-2 mt-2">
                              <Label className="text-gray-300">설명 (선택사항)</Label>
                              <Textarea
                                value={tc.description}
                                onChange={(e) => handleTestCaseChange(index, 'description', e.target.value)}
                                placeholder="테스트 케이스 설명"
                                className="bg-black/30 border-gray-600 text-white"
                                rows={2}
                              />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </CyberCard>
              </>
            )}

            <div className="flex justify-end space-x-4">
              <CyberButton variant="secondary" onClick={() => navigate('/home')}>
                취소
              </CyberButton>
              <CyberButton onClick={handleSubmit} disabled={!problemData}>
                <Upload className="mr-2 h-4 w-4" />
                문제 등록
              </CyberButton>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UploadProblemPage;