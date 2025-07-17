import React from 'react';
import { Image as ImageIcon, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import CyberButton from './CyberButton';

interface ProblemDescriptionRendererProps {
  description: string;
  imageMap: { [placeholderId: string]: { file?: File, generatedImageId: string, dataURL: string } };
  onImageUpload: (placeholderId: string, isReplace: boolean) => (event: React.ChangeEvent<HTMLInputElement>) => void;
  onImageReplace: (placeholderId: string, isReplace: boolean) => (event: React.ChangeEvent<HTMLInputElement>) => void;
  onImageRemove: (placeholderId: string) => void;
}

const ProblemDescriptionRenderer: React.FC<ProblemDescriptionRendererProps> = ({ description, imageMap, onImageUpload, onImageReplace, onImageRemove }) => {
  const renderContent = () => {
    const parts = description.split(/(\[IMAGE:[^\]]+\])/g);

    return parts.map((part, index) => {
      if (part.startsWith('[IMAGE:') && part.endsWith(']')) {
        const placeholderId = part.substring(7, part.length - 1);
        const imageData = imageMap[placeholderId];

        if (imageData) {
          return (
            <div key={index} className="relative group inline-block my-2 align-middle">
              <img
                src={imageData.dataURL}
                alt={`Problem Image ${placeholderId}`}
                className="max-w-full h-auto border border-gray-600 rounded"
              />
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center gap-x-2 opacity-0 group-hover:opacity-100 transition-opacity rounded">
                <Label htmlFor={`replace-image-${placeholderId}`} className="cursor-pointer text-white bg-cyber-blue/80 px-3 py-1 rounded-md text-sm hover:bg-cyber-blue">
                  변경
                  <Input
                    id={`replace-image-${placeholderId}`}
                    type="file"
                    accept="image/*"
                    onChange={onImageReplace(placeholderId, true)}
                    className="hidden"
                  />
                </Label>
                <CyberButton
                  variant="destructive"
                  size="sm"
                  onClick={() => onImageRemove(placeholderId)}
                  className="px-3 py-1 h-auto"
                >
                  <X className="h-4 w-4" />
                </CyberButton>
              </div>
            </div>
          );
        } else {
          return (
            <div key={index} className="inline-block my-2 p-4 border border-dashed border-gray-500 rounded bg-gray-800 text-center">
              <Label htmlFor={`image-upload-${placeholderId}`} className="cursor-pointer block text-gray-400 hover:text-cyber-blue transition-colors">
                <div className="flex flex-col items-center justify-center">
                  <ImageIcon className="h-8 w-8 mb-2" />
                  <span>이미지 {placeholderId} 업로드</span>
                </div>
                <Input
                  id={`image-upload-${placeholderId}`}
                  type="file"
                  accept="image/*"
                  onChange={onImageUpload(placeholderId, false)}
                  className="hidden"
                />
              </Label>
            </div>
          );
        }
      }
      // 줄바꿈 문자를 <br /> 태그로 변환하여 렌더링합니다.
      return <span key={index}>{part.split('\n').map((line, i) => <React.Fragment key={i}>{line}{i !== part.split('\n').length - 1 && <br />}</React.Fragment>)}</span>;
    });
  };

  return <div className="whitespace-pre-wrap leading-relaxed">{renderContent()}</div>;
};

export default ProblemDescriptionRenderer;

