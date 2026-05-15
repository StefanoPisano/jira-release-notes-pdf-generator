import { useState } from 'react';
import { extractMetadata } from '../utils/metadataExtractor';
import { formatBytes } from '../utils/helpers';

/**
 * Custom hook for handling file uploads and reading.
 */
export function useFileHandler() {
  const [file, setFile] = useState(null);
  const [logo, setLogo] = useState(null);

  const handleFileSelect = (selectedFile, onMetadataExtracted) => {
    const isMd = selectedFile.name.endsWith('.md');

    if (!isMd) {
      alert('Please upload a .md file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target.result;
      const { extractedProduct, extractedVersion } = extractMetadata(content);

      setFile({
        name: selectedFile.name,
        size: formatBytes(selectedFile.size),
        content: content
      });

      onMetadataExtracted({ extractedProduct, extractedVersion });
    };
    reader.readAsText(selectedFile);
  };

  const handleLogoSelect = (selectedFile) => {
    if (!selectedFile) {
      setLogo(null);
      return;
    }

    if (!selectedFile.type.startsWith('image/')) {
      alert('Please upload an image file for the logo.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setLogo({ src: e.target.result, name: selectedFile.name });
    };
    reader.readAsDataURL(selectedFile);
  };

  const resetFile = () => {
    setFile(null);
  };

  return {
    file,
    setFile,
    logo,
    setLogo,
    handleFileSelect,
    handleLogoSelect,
    resetFile
  };
}
