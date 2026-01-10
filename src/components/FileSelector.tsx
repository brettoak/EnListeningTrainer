import React, { useRef } from 'react';
import './FileSelector.css';

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
    <div className="file-selector">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="audio/*,video/*"
        style={{ display: 'none' }}
      />
      
      <button 
        className="btn-primary"
        onClick={() => fileInputRef.current?.click()}
      >
        Select Audio/Video File
      </button>
      
      {selectedFileName && (
        <div className="file-name">
          Listening Material: <span>{selectedFileName}</span>
        </div>
      )}
    </div>
  );
};
