import { Upload, User } from "lucide-react";
import { useState, useEffect } from "react";

interface ProfileImageUploadProps {
  file: File | null;
  onChange: (file: File | null) => void;
}

const ProfileImageUpload = ({ file, onChange }: ProfileImageUploadProps) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl(null);
    }
  }, [file]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] || null;
    onChange(selected);
  };

  return (
    <div className="space-y-2 text-center">
      <div className="w-20 h-20 bg-gradient-to-r from-cyber-blue to-cyber-purple rounded-full mx-auto flex items-center justify-center overflow-hidden border-2 border-cyber-blue">
        {previewUrl ? (
          <img src={previewUrl} alt="Profile Preview" className="w-full h-full object-cover" />
        ) : (
          <User className="h-10 w-10 text-white" />
        )}
      </div>
      <label
        htmlFor="profileImage"
        className="block text-sm font-medium text-gray-300"
      >
        프로필 이미지
      </label>
      <div className="flex items-center justify-center">
        <label htmlFor="profileImage" className="cursor-pointer">
          <div className="flex items-center space-x-2 px-4 py-2 bg-black/30 border border-gray-600 rounded-lg hover:border-cyber-blue/40 transition-colors">
            <Upload className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-300">이미지 업로드</span>
          </div>
        </label>
        <input
          id="profileImage"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
        />
      </div>
      {file && (
        <p className="text-xs text-green-400">선택된 파일: {file.name}</p>
      )}
    </div>
  );
};

export default ProfileImageUpload;