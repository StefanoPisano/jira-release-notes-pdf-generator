import React, { useRef } from 'react';
import { Upload } from 'lucide-react';

export default function FileDropzone({ onFileSelect }) {
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add('dragover');
  };

  const handleDragLeave = (e) => {
    e.currentTarget.classList.remove('dragover');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('dragover');
    
    if (e.dataTransfer.files.length === 0) return;
    onFileSelect(e.dataTransfer.files[0]);
  };

  return (
    <div 
      className="upload-zone" 
      onClick={() => fileInputRef.current?.click()}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      role="button"
      aria-label="Upload file"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
    >
      <div className="upload-icon"><Upload size={32} aria-hidden="true" /></div>
      <div className="upload-text">
        <strong>Click to upload</strong> or drag and drop
        <span>HTML or Markdown Files</span>
      </div>
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={(e) => e.target.files[0] && onFileSelect(e.target.files[0])} 
        accept=".html,.md" 
        hidden 
      />
    </div>
  );
}
