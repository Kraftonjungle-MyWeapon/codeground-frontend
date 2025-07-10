import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import CyberCard from '@/components/CyberCard';
import CyberButton from '@/components/CyberButton';
import { ArrowLeft } from 'lucide-react';
import { ProblemBasicInfo } from './components/ProblemBasicInfo';
import { ProblemDescription } from './components/ProblemDescription';
import { ProblemExamples } from './components/ProblemExamples';
import { ProblemConstraintsAndTags } from './components/ProblemConstraintsAndTags';
import { ProblemSubmissionActions } from './components/ProblemSubmissionActions';

const CreateProblemPage = () => {
  const navigate = useNavigate();
  const [problemData, setProblemData] = useState({
    title: '',
    description: '',
    languages: [] as string[],
    categories: [] as string[],
    difficulty: '',
    timeLimit: 30,
    examples: [{ input: '', output: '', explanation: '' }],
    constraints: {
      timeLimit: { value: 1000, unit: 'ms' },
      memoryLimit: { value: 128, unit: 'MB' },
      custom: [] as Array<{ name: string; value: string; unit: string }>
    },
    tags: [] as string[]
  });

  const [newTag, setNewTag] = useState('');
  const [newConstraint, setNewConstraint] = useState({ name: '', value: '', unit: '' });

  const handleInputChange = (field: string, value: any) => {
    setProblemData(prev => ({
      ...prev,
      [field]: value
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

  const addTag = () => {
    if (newTag.trim() && !problemData.tags.includes(newTag.trim())) {
      setProblemData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setProblemData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const addCustomConstraint = () => {
    if (newConstraint.name.trim() && newConstraint.value.trim()) {
      setProblemData(prev => ({
        ...prev,
        constraints: {
          ...prev.constraints,
          custom: [...prev.constraints.custom, { ...newConstraint }]
        }
      }));
      setNewConstraint({ name: '', value: '', unit: '' });
    }
  };

  const removeCustomConstraint = (index: number) => {
    setProblemData(prev => ({
      ...prev,
      constraints: {
        ...prev.constraints,
        custom: prev.constraints.custom.filter((_, i) => i !== index)
      }
    }));
  };

  const handleConstraintChange = (type: 'timeLimit' | 'memoryLimit', field: 'value' | 'unit', value: string | number) => {
    setProblemData(prev => ({
      ...prev,
      constraints: {
        ...prev.constraints,
        [type]: {
          ...prev.constraints[type],
          [field]: value
        }
      }
    }));
  };

  const handleSubmit = () => {
    console.log('Problem data:', problemData);
    navigate('/home');
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
              onClick={() => navigate('/settings')}
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4" />
            </CyberButton>
            <h1 className="text-3xl font-bold text-cyber-blue">코딩테스트 문제 등록</h1>
          </div>

          <div className="space-y-6">
            <CyberCard className="p-6">
              <h2 className="text-xl font-bold text-white mb-4">기본 정보</h2>
              <ProblemBasicInfo
                problemData={problemData}
                handleInputChange={handleInputChange}
                handleLanguageToggle={handleLanguageToggle}
                handleCategoryToggle={handleCategoryToggle}
              />
            </CyberCard>

            <CyberCard className="p-6">
              <h2 className="text-xl font-bold text-white mb-4">문제 설명</h2>
              <ProblemDescription
                description={problemData.description}
                handleInputChange={handleInputChange}
              />
            </CyberCard>

            <CyberCard className="p-6">
              <ProblemExamples
                examples={problemData.examples}
                handleExampleChange={handleExampleChange}
                addExample={addExample}
                removeExample={removeExample}
              />
            </CyberCard>

            <CyberCard className="p-6">
              <h2 className="text-xl font-bold text-white mb-4">제약사항 및 추가 정보</h2>
              <ProblemConstraintsAndTags
                problemData={problemData}
                newConstraint={newConstraint}
                setNewConstraint={setNewConstraint}
                addCustomConstraint={addCustomConstraint}
                removeCustomConstraint={removeCustomConstraint}
                handleConstraintChange={handleConstraintChange}
                newTag={newTag}
                setNewTag={setNewTag}
                addTag={addTag}
                removeTag={removeTag}
              />
            </CyberCard>

            <ProblemSubmissionActions handleSubmit={handleSubmit} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreateProblemPage;