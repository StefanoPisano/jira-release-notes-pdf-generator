import React, { useState, useEffect } from 'react';
import { marked } from 'marked';
import { FileText, Download, Trash2 } from 'lucide-react';

// Components
import Sidebar from './components/Sidebar';
import FileDropzone from './components/FileDropzone';
import Editor from './components/Editor';

// Utilities
import { formatBytes, generateId } from './utils/helpers';
import { buildPdfHtml, generatePdf } from './utils/pdf';

export default function App() {
  // State
  const [file, setFile] = useState(null);
  const [productName, setProductName] = useState('');
  const [version, setVersion] = useState('');
  const [logo, setLogo] = useState(null);
  const [items, setItems] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const handleFileSelect = (selectedFile) => {
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

      if (extractedProduct) setProductName(extractedProduct);
      if (extractedVersion) setVersion(extractedVersion);
    };
    reader.readAsText(selectedFile);
  };

  const handleLogoSelect = (selectedFile) => {
    if (!selectedFile.type.startsWith('image/')) {
      alert('Please upload an image file for the logo.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setLogo(e.target.result);
    };
    reader.readAsDataURL(selectedFile);
  };

  const extractMetadata = (content) => {
    let extractedProduct = '';
    let extractedVersion = '';

    // Targeted regex for: Release notes - BPS Development - 12.5.3.9
    // Extract from <h1> or # markdown title
    const h1Match = content.match(/#\s+(.+)|<h1>(.+?)<\/h1>/i);
    if (h1Match) {
      const h1Content = h1Match[1] || h1Match[2];
      
      // Match "Release notes - [Product] - [Version]"
      const match = h1Content.match(/Release\s+notes\s+-\s+(.+?)\s+-\s+(\d+\.\d+\.\d+\.\d+)/i);
      if (match) {
        extractedProduct = match[1].trim();
        extractedVersion = match[2].trim();
      } else {
        // Fallback for simple version
        const versionMatch = h1Content.match(/(\d+\.\d+\.\d+\.\d+)/);
        if (versionMatch) extractedVersion = versionMatch[1];
      }
    }

    return { extractedProduct, extractedVersion };
  };

  const handleProcess = () => {
    if (!file) return;
    setIsProcessing(true);

    const htmlMarkup = marked.parse(file.content);

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlMarkup;
    
    // Instead of just <p>, let's look for <li> tags or top-level elements that are not headers
    const extractedItems = [];
    
    // Strategy: 
    // 1. Find all <li> elements as they usually represent tickets in release notes.
    // 2. If no <li> found, fall back to <p> elements that are not headings.
    
    const listItems = tempDiv.querySelectorAll('li');
    if (listItems.length > 0) {
      listItems.forEach(li => {
        extractedItems.push({
          id: generateId(),
          content: li.innerHTML,
          deleted: false
        });
      });
    } else {
      const paragraphs = tempDiv.querySelectorAll('p');
      paragraphs.forEach(p => {
        extractedItems.push({
          id: generateId(),
          content: p.innerHTML,
          deleted: false
        });
      });
    }

    setItems(extractedItems);
    setIsProcessing(false);
  };

  const handleToggleItem = (id) => {
    setItems(prevItems => prevItems.map(item => 
      item.id === id ? { ...item, deleted: !item.deleted } : item
    ));
  };

  const handleReset = () => {
    setFile(null);
    setItems([]);
    setProductName('');
    setVersion('');
  };

  const handleDownloadPdf = async () => {
    if (items.length === 0) return;
    setIsGeneratingPdf(true);

    try {
      const html = buildPdfHtml({ productName, version, items, logo });
      const filename = `Release Notes - ${productName ? productName + ' - ' : ''}${version || 'Version'}`;

      const blob = await generatePdf({ html, filename });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `${filename}.pdf`;
      link.click();
      
      URL.revokeObjectURL(url);
    } catch (err) {
      alert(`Error generating PDF: ${err.message}`);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="app-layout">
      <Sidebar 
        file={file}
        onFileSelect={handleFileSelect}
        logo={logo}
        onLogoSelect={handleLogoSelect}
        productName={productName}
        setProductName={setProductName}
        version={version}
        setVersion={setVersion}
        onReset={handleReset}
        onProcess={handleProcess}
        isProcessing={isProcessing}
        showProcessButton={items.length === 0}
      />

      <main className="main" role="main">
        {items.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon"><FileText size={64} aria-hidden="true" /></div>
            <h1>Release Notes Creator</h1>
            <p>
              {!file 
                ? 'Upload a document in the sidebar to start editing your release notes.' 
                : 'Click "Process Document" in the sidebar to start editing.'}
            </p>
          </div>
        ) : (
          <div className="content-area">
            <header className="content-topbar">
              <div className="document-info">
                <span className="doc-label">Editing:</span>
                <span className="doc-name">{file.name}</span>
              </div>
              <div className="topbar-actions">
                <button 
                  className="btn-ghost" 
                  onClick={handleReset}
                  aria-label="Close editor and reset"
                >
                  <Trash2 size={16} aria-hidden="true" /> 
                  <span className="btn-label">Reset</span>
                </button>
                <button 
                  className="btn-primary" 
                  onClick={handleDownloadPdf}
                  disabled={isGeneratingPdf}
                >
                  <Download size={16} aria-hidden="true" /> 
                  <span className="btn-label">{isGeneratingPdf ? 'Generating...' : 'Download PDF'}</span>
                </button>
              </div>
            </header>

            <section className="preview-wrapper">
              <Editor items={items} onToggleItem={handleToggleItem} />
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
