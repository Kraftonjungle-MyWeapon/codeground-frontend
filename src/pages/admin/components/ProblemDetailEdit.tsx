import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchAdminProblemDetail, updateAdminProblem } from '../api/adminApi';
import { AdminProblemDetailOut } from '@/types/admin';
import CyberCard from '@/components/CyberCard';
import CyberButton from '@/components/CyberButton';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import ProblemDescriptionRenderer from '@/components/ProblemDescriptionRenderer';
import { tiers } from '@/utils/lpSystem';

interface ProblemBodyContent {
  description: string;
  constraints: string;
  input_format: string;
  output_format: string;
  test_cases: Array<{
    input: string;
    output: string;
    description?: string;
    visibility: "public" | "hidden";
  }>;
}

const ProblemDetailEdit: React.FC = () => {
  const { problemId } = useParams<{ problemId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [problemDetail, setProblemDetail] = useState<AdminProblemDetailOut | null>(null);
  const [problemBodyContent, setProblemBodyContent] = useState<ProblemBodyContent | null>(null);
  const [uploadedImages, setUploadedImages] = useState<{ [key: string]: { file?: File, generatedImageId: string, dataURL: string } }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const availableLanguages = [
    { value: 'python3', label: 'Python3' },
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

  const mainTiersForSelect = Array.from(new Set(tiers.map(tier => tier.name.split(' ')[0])))
    .map(mainTierName => {
      const foundTier = tiers.find(tier => tier.name.startsWith(mainTierName));
      return {
        name: mainTierName,
        icon: foundTier?.icon,
        color: foundTier?.color,
      };
    });

  const fetchProblemData = useCallback(async () => {
  if (!problemId) return;
  setIsLoading(true);
  try {
    const detail = await fetchAdminProblemDetail(parseInt(problemId));
    setProblemDetail({
      ...detail,
      title: detail.title || '',
      difficulty: detail.difficulty || '',
      category: detail.category || [],
      language: detail.language || [],
      is_approved: detail.is_approved ?? false,
      problem_prefix: detail.problem_prefix || '',
      testcase_prefix: detail.testcase_prefix || '',
    });

    if (detail.problem_url) {
      const response = await fetch(detail.problem_url);
      if (!response.ok) throw new Error('문제 본문 파일을 불러오지 못했습니다.');
      const bodyJson: ProblemBodyContent = await response.json();
      setProblemBodyContent(bodyJson);

      const initialImageMap: { [key: string]: { generatedImageId: string, dataURL: string } } = {};
      detail.image_urls.forEach(url => {
        const fullFilename = decodeURIComponent(url.substring(url.lastIndexOf('/') + 1).split('?')[0]);
        const placeholderId = fullFilename.split('.').slice(0, -1).join('.');
        if (placeholderId) {
          initialImageMap[placeholderId] = { generatedImageId: fullFilename, dataURL: url };
        }
      });
      setUploadedImages(initialImageMap);
    }
  } catch (error) {
    console.error('Failed to fetch problem details:', error);
    toast({ title: '문제 정보 불러오기 실패', description: '상세 정보 로딩에 실패했습니다.', variant: 'destructive' });
  } finally {
    setIsLoading(false);
  }
}, [problemId, toast]);

useEffect(() => {
  fetchProblemData();
}, [fetchProblemData]);

  const handleProblemDetailChange = (field: keyof AdminProblemDetailOut, value: any) => {
    setProblemDetail(prev => prev ? { ...prev, [field]: value } : null);
  };

  const handleProblemBodyContentChange = (field: keyof ProblemBodyContent, value: string) => {
    setProblemBodyContent(prev => prev ? { ...prev, [field]: value } : null);
  };

  const handleLanguageToggle = (language: string) => {
    setProblemDetail(prev => {
      if (!prev) return null;
      const updatedLanguages = prev.language.includes(language)
        ? prev.language.filter(l => l !== language)
        : [...prev.language, language];
      return { ...prev, language: updatedLanguages };
    });
  };

  const handleCategoryToggle = (category: string) => {
    setProblemDetail(prev => {
      if (!prev) return null;
      const updatedCategories = prev.category.includes(category)
        ? prev.category.filter(c => c !== category)
        : [...prev.category, category];
      return { ...prev, category: updatedCategories };
    });
  };

  const handleImageAction = (placeholderId: string, isReplace: boolean) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const originalFileName = file.name.split('.').slice(0, -1).join('.');
      const fileExtension = file.name.split('.').pop() || '';
      const normalizedFileName = originalFileName.normalize('NFC').replace(/[^a-zA-Z0-9_\-.가-힣]/g, '_');
      const timestamp = Date.now();
      
      const newPlaceholderId = `img_${timestamp}_${normalizedFileName}`;
      const newGeneratedId = `${newPlaceholderId}.${fileExtension}`;
      const imageDataUrl = e.target?.result as string;

      setUploadedImages(prev => {
        const newMap = { ...prev };
        if (isReplace) {
          delete newMap[placeholderId];
        }
        newMap[newPlaceholderId] = {
          file: new File([file], newGeneratedId, { type: file.type }),
          generatedImageId: newGeneratedId,
          dataURL: imageDataUrl
        };
        return newMap;
      });

      setProblemBodyContent(prev => {
        if (!prev) return null;
        const newDescription = prev.description.replace(`[IMAGE:${placeholderId}]`, `[IMAGE:${newPlaceholderId}]`);
        return { ...prev, description: newDescription };
      });
    };
    reader.readAsDataURL(file);
  };

  const handleImageRemove = (placeholderId: string) => {
    setUploadedImages(prev => {
      const newMap = { ...prev };
      delete newMap[placeholderId];
      return newMap;
    });

    setProblemBodyContent(prev => {
      if (!prev) return null;
      const escapedId = placeholderId.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      const newDescription = prev.description.replace(new RegExp(`\[IMAGE:${escapedId}\]`, 'g'), '');
      return { ...prev, description: newDescription };
    });
  };

  const addTestCase = (visibility: "public" | "hidden" = "public") => {
    setProblemBodyContent(prev => {
      if (!prev) return null;
      return { ...prev, test_cases: [...prev.test_cases, { input: '', output: '', visibility }] };
    });
  };

  const removeTestCase = (index: number) => {
    setProblemBodyContent(prev => {
      if (!prev) return null;
      return { ...prev, test_cases: prev.test_cases.filter((_, i) => i !== index) };
    });
  };

  const handleTestCaseChange = (index: number, field: 'input' | 'output' | 'description', value: string) => {
    setProblemBodyContent(prev => {
      if (!prev) return null;
      const updatedTestCases = [...prev.test_cases];
      const key = field as keyof typeof updatedTestCases[0];
      (updatedTestCases[index] as any)[key] = value;
      return { ...prev, test_cases: updatedTestCases };
    });
  };

  const handleSubmit = async () => {
    if (!problemDetail || !problemBodyContent || !problemId) {
      toast({ title: '업데이트 오류', description: '문제 데이터가 완전히 로드되지 않았습니다.', variant: 'destructive' });
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();

      // 1. problem_update (DB 정보)
      const problemUpdateData = {
        title: problemDetail.title,
        difficulty: problemDetail.difficulty,
        category: problemDetail.category,
        language: problemDetail.language,
        is_approved: problemDetail.is_approved,
        problem_prefix: problemDetail.problem_prefix,
        testcase_prefix: problemDetail.testcase_prefix,
      };
      console.log('Sending problem_update data:', problemUpdateData);
      formData.append('problem_update_json', JSON.stringify(problemUpdateData));

      // 2. problem_body_file (S3 본문 JSON)
      const problemBodyBlob = new Blob([JSON.stringify(problemBodyContent)], { type: 'application/json' });
      console.log('Appending problem_body_file:', problemBodyBlob);
      formData.append('problem_body_file', problemBodyBlob, 'body.json');

      
      // 3. image_files (새로운/수정된 이미지 파일들)
      Object.values(uploadedImages).forEach(imageData => {
        if (imageData.file) { // file 속성이 있는 경우 (새로 업로드되거나 교체된 이미지)
          console.log('Appending image_file:', imageData.file.name, 'with generated ID:', imageData.generatedImageId);
          formData.append('image_files', imageData.file, imageData.generatedImageId);
        }
      });

      await updateAdminProblem(parseInt(problemId), formData);
      toast({ title: '문제 수정 성공', description: '문제가 성공적으로 업데이트되었습니다.', variant: 'success' });
      navigate('/admin?tab=problems');
    } catch (error) {
      console.error('Failed to update problem:', error);
      toast({ title: '문제 수정 실패', description: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="min-h-screen cyber-grid flex items-center justify-center text-white">문제 정보를 불러오는 중...</div>;
  }

  if (!problemDetail || !problemBodyContent) {
    return <div className="min-h-screen cyber-grid flex items-center justify-center text-red-400">문제 정보를 찾을 수 없습니다.</div>;
  }

  return (
    <div className="min-h-screen cyber-grid">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center mb-8">
            <CyberButton variant="secondary" size="sm" onClick={() => navigate('/admin?tab=problems')} className="mr-4">
              <ArrowLeft className="h-4 w-4" />
            </CyberButton>
            <h1 className="text-3xl font-bold text-cyber-blue">문제 수정: {problemDetail.title}</h1>
          </div>

          <div className="space-y-6">
            <CyberCard className="p-6">
              <h2 className="text-xl font-bold text-white mb-4">문제 DB 정보</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-gray-300">제목</Label>
                  <Input id="title" value={problemDetail.title} onChange={(e) => handleProblemDetailChange('title', e.target.value)} className="bg-black/30 border-gray-600 text-white" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="difficulty" className="text-gray-300">난이도</Label>
                  <Select value={problemDetail.difficulty} onValueChange={(value) => handleProblemDetailChange('difficulty', value)}>
                    <SelectTrigger className="bg-black/30 border-gray-600 text-white">
                      <SelectValue placeholder="난이도 선택" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600">
                      {mainTiersForSelect.map((tier) => (
                        <SelectItem key={tier.name} value={tier.name.toLowerCase()}>
                          <div className="flex items-center space-x-2">
                            {tier.icon && <tier.icon className={`h-4 w-4 ${tier.color}`} />}
                            <span>{tier.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="is_approved" checked={problemDetail.is_approved} onCheckedChange={(checked) => handleProblemDetailChange('is_approved', !!checked)} className="border-gray-600 data-[state=checked]:bg-cyber-blue" />
                  <Label htmlFor="is_approved" className="text-gray-300">승인됨</Label>
                </div>
                <div>
                  <Label className="text-gray-300">프로그래밍 언어</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
                    {availableLanguages.map((lang) => (
                      <div key={lang.value} className="flex items-center space-x-2">
                        <Checkbox id={`lang-${lang.value}`} checked={problemDetail.language.includes(lang.value)} onCheckedChange={() => handleLanguageToggle(lang.value)} className="border-gray-600 data-[state=checked]:bg-cyber-blue" />
                        <Label htmlFor={`lang-${lang.value}`} className="text-gray-300 cursor-pointer">{lang.label}</Label>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <Label className="text-gray-300">알고리즘 카테고리</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 pt-2">
                    {availableCategories.map((cat) => (
                      <div key={cat.value} className="flex items-center space-x-2">
                        <Checkbox id={`cat-${cat.value}`} checked={problemDetail.category.includes(cat.value)} onCheckedChange={() => handleCategoryToggle(cat.value)} className="border-gray-600 data-[state=checked]:bg-cyber-blue" />
                        <Label htmlFor={`cat-${cat.value}`} className="text-gray-300 cursor-pointer">{cat.label}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CyberCard>

            <CyberCard className="p-6">
              <h2 className="text-xl font-bold text-white mb-4">문제 본문 및 테스트 케이스</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-gray-300">문제 설명</Label>
                  <Textarea id="description" value={problemBodyContent.description} onChange={(e) => handleProblemBodyContentChange('description', e.target.value)} placeholder="문제 설명을 입력하세요. [IMAGE:설명] 형태로 이미지 태그를 사용할 수 있습니다." className="bg-black/30 border-gray-600 text-white min-h-[200px]" />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-gray-300">본문 미리보기</Label>
                  <div className="p-4 border border-gray-700 rounded-md bg-black/20 min-h-[100px]">
                    <ProblemDescriptionRenderer
                      description={problemBodyContent.description}
                      imageMap={uploadedImages}
                      onImageUpload={handleImageAction}
                      onImageReplace={handleImageAction}
                      onImageRemove={handleImageRemove}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="input_format" className="text-gray-300">입력 형식</Label>
                  <Textarea id="input_format" value={problemBodyContent.input_format} onChange={(e) => handleProblemBodyContentChange('input_format', e.target.value)} placeholder="입력 형식을 설명하세요" className="bg-black/30 border-gray-600 text-white" rows={3} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="output_format" className="text-gray-300">출력 형식</Label>
                  <Textarea id="output_format" value={problemBodyContent.output_format} onChange={(e) => handleProblemBodyContentChange('output_format', e.target.value)} placeholder="출력 형식을 설명하세요" className="bg-black/30 border-gray-600 text-white" rows={3} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="constraints" className="text-gray-300">제한사항</Label>
                  <Textarea id="constraints" value={problemBodyContent.constraints} onChange={(e) => handleProblemBodyContentChange('constraints', e.target.value)} placeholder="제한사항을 입력하세요" className="bg-black/30 border-gray-600 text-white" rows={4} />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between mb-4">
                    <Label className="text-gray-300">테스트 케이스</Label>
                    <div className="flex space-x-2">
                      <CyberButton size="sm" onClick={() => addTestCase("public")}><Plus className="mr-2 h-4 w-4" />공개 추가</CyberButton>
                      <CyberButton size="sm" variant="secondary" onClick={() => addTestCase("hidden")}><Plus className="mr-2 h-4 w-4" />숨김 추가</CyberButton>
                    </div>
                  </div>
                  {problemBodyContent.test_cases.map((tc, index) => (
                    <div key={index} className="bg-black/20 p-3 rounded-lg mb-2 border border-gray-700">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className={`font-semibold ${tc.visibility === "public" ? "text-green-400" : "text-yellow-400"}`}>테스트 케이스 {index + 1} ({tc.visibility === "public" ? "공개" : "숨김"})</h3>
                        <CyberButton size="sm" variant="destructive" onClick={() => removeTestCase(index)}><Trash2 className="h-4 w-4" /></CyberButton>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-gray-300">입력</Label>
                          <Textarea value={tc.input} onChange={(e) => handleTestCaseChange(index, 'input', e.target.value)} placeholder="테스트 케이스 입력" className="bg-black/30 border-gray-600 text-white font-mono text-sm" rows={3} />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-gray-300">출력</Label>
                          <Textarea value={tc.output} onChange={(e) => handleTestCaseChange(index, 'output', e.target.value)} placeholder="테스트 케이스 출력" className="bg-black/30 border-gray-600 text-white font-mono text-sm" rows={3} />
                        </div>
                      </div>
                       <div className="space-y-2 mt-2">
                          <Label className="text-gray-300">설명 (선택사항)</Label>
                          <Textarea
                            value={tc.description || ''}
                            onChange={(e) => handleTestCaseChange(index, 'description', e.target.value)}
                            placeholder="테스트 케이스 설명"
                            className="bg-black/30 border-gray-600 text-white"
                            rows={2}
                          />
                        </div>
                    </div>
                  ))}
                </div>
              </div>
            </CyberCard>

            <div className="flex justify-end space-x-4">
              <CyberButton variant="secondary" onClick={() => navigate('/admin?tab=problems')}>취소</CyberButton>
              <CyberButton onClick={handleSubmit} disabled={isSubmitting}>
                <Save className="mr-2 h-4 w-4" />
                {isSubmitting ? '저장 중...' : '변경 사항 저장'}
              </CyberButton>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProblemDetailEdit;