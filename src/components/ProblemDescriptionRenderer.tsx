import React from 'react';
import { Image as ImageIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ProblemDescriptionRendererProps {
  description: string;
  imageMap: { [placeholderId: string]: { file: File, generatedImageId: string, dataURL: string } };
  onImageUpload: (placeholderId: string) => (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const ProblemDescriptionRenderer: React.FC<ProblemDescriptionRendererProps> = ({ description, imageMap, onImageUpload }) => {
  const renderContent = () => {
    // [IMAGE:X] 패턴을 찾아 분리합니다.
    const parts = description.split(/(\[IMAGE:[^\]]+\])/g);

    return parts.map((part, index) => {
      if (part.startsWith('[IMAGE:') && part.endsWith(']')) {
        const placeholderId = part.substring(7, part.length - 1); // [IMAGE:X]에서 X 추출
        const imageData = imageMap[placeholderId];

        if (imageData) {
          // 이미지가 업로드된 경우 img 태그 렌더링
          return (
            <img
              key={index}
              src={imageData.dataURL}
              alt={`Problem Image ${placeholderId}`}
              className="max-w-full h-auto my-2 border border-gray-600 rounded"
            />
          );
        } else {
          // 이미지가 없는 경우 업로드 버튼 렌더링
          return (
            <div key={index} className="inline-block my-2 p-4 border border-dashed border-gray-500 rounded bg-gray-800 text-center">
              <Label htmlFor={`image-upload-${placeholderId}`} className="cursor-pointer block text-gray-400 hover:text-cyber-blue transition-colors">
                <div className="flex flex-col items-center justify-center">
                  <ImageIcon className="h-8 w-8 mb-2" />
                  <span>이미지 {placeholderId} 업로드</span>
                  <span className="text-xs text-gray-500">(클릭하여 업로드)</span>
                </div>
                <Input
                  id={`image-upload-${placeholderId}`}
                  type="file"
                  accept="image/*"
                  onChange={onImageUpload(placeholderId)}
                  className="hidden"
                />
              </Label>
            </div>
          );
        }
      }
      return <span key={index}>{part}</span>;
    });
  };

  return <div className="whitespace-pre-wrap">{renderContent()}</div>;
};

export default ProblemDescriptionRenderer;
