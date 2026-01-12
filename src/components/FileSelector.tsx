import React, { useRef } from 'react';
// import './FileSelector.css'; // Removed for Tailwind migration

interface FileSelectorProps {
  onFileSelect: (file: File) => void;
  selectedFileName?: string | null;
}

export const FileSelector: React.FC<FileSelectorProps> = ({ onFileSelect, selectedFileName }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  return (
    <div className="flex flex-row items-center gap-4">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="audio/*,video/*"
        style={{ display: 'none' }}
      />

      <button
        className="bg-[#646cff] text-white px-4 py-2 rounded font-medium hover:bg-[#535bf2] transition-colors shadow-sm whitespace-nowrap"
        onClick={() => fileInputRef.current?.click()}
      >
        选择音频/视频文件
      </button>

      {selectedFileName && (
        <div className="text-[#646cff] font-medium text-base bg-[#e3f2fd] px-3 py-1.5 rounded-md">
          <span className="text-slate-500 mr-2 text-sm font-normal">听力材料：</span>
          <span>{selectedFileName}</span>
        </div>
      )}
    </div>
  );
};
