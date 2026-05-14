import React, { useState, useEffect, useRef } from 'react';
import { marked } from 'marked';
import { FileText, Download, Trash2, CheckSquare, Square, Loader2, Circle } from 'lucide-react';

// Components
import Sidebar from './components/Sidebar';
import FileDropzone from './components/FileDropzone';
import Editor from './components/Editor';
import InfoPage from './components/InfoPage';

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
  const [recentFiles, setRecentFiles] = useState([]);
  const [view, setView] = useState('app');
  const [syncStatus, setSyncStatus] = useState('not-synced');
  const syncTimeoutRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem('recentFiles');
    if (saved) {
      setRecentFiles(JSON.parse(saved));
    }
  }, []);

  const saveCurrentRecentState = (currentFile, currentProduct, currentVersion, currentLogo, currentItems) => {
    if (!currentFile || !currentProduct || !currentVersion || currentItems.length === 0) {
      setSyncStatus('not-synced');
      return;
    }

    if (syncTimeoutRef.current) {
      clearTimeout(syncTimeoutRef.current);
      syncTimeoutRef.current = null;
    }

    setSyncStatus('syncing');
    const key = `${currentProduct}-${currentVersion}`;
    setRecentFiles(prev => {
      const newEntry = {
        key,
        state: {
          file: currentFile,
          productName: currentProduct,
          version: currentVersion,
          logo: currentLogo,
          items: currentItems
        }
      };

      const found = prev.find(r => r.key === key);
      const newRecent = found
        ? prev.map(r => r.key === key ? newEntry : r)
        : [newEntry, ...prev];

      if (!found && newRecent.length > 5) {
        newRecent.pop();
      }

      localStorage.setItem('recentFiles', JSON.stringify(newRecent));

      syncTimeoutRef.current = window.setTimeout(() => {
        setSyncStatus('synced');
        syncTimeoutRef.current = null;
      }, 500);

      return newRecent;
    });
  };

  useEffect(() => {
    saveCurrentRecentState(file, productName, version, logo, items);
    return () => {
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }
    };
  }, [file, productName, version, logo, items]);

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
          selected: true
        });
      });
    } else {
      const paragraphs = tempDiv.querySelectorAll('p');
      paragraphs.forEach(p => {
        extractedItems.push({
          id: generateId(),
          content: p.innerHTML,
          selected: true
        });
      });
    }

    // Sort by ticket number ascending
    const extractTicketNumber = (content) => {
      const match = content.match(/(\w+)-(\d+)/);
      return match ? parseInt(match[2]) : 0;
    };
    extractedItems.sort((a, b) => {
      const numA = extractTicketNumber(a.content);
      const numB = extractTicketNumber(b.content);
      return numA - numB;
    });

    setItems(extractedItems);
    setIsProcessing(false);
  };

  const handleToggleItem = (id) => {
    setItems(prevItems => prevItems.map(item => 
      item.id === id ? { ...item, selected: !item.selected } : item
    ));
  };

  const handleToggleAll = () => {
    const allSelected = items.every(item => item.selected);
    setItems(prevItems => prevItems.map(item => ({ ...item, selected: !allSelected })));
  };

  const handleReset = () => {
    setFile(null);
    setItems([]);
    setProductName('');
    setVersion('');
    setSyncStatus('not-synced');
    setView('app');
  };

  const handleShowInfo = () => setView('info');
  const handleBackToApp = () => setView('app');
  const handleReturnHome = () => {
    setItems([]);
    setView('app');
  };

  const handleDownloadPdf = async () => {
    if (items.length === 0) return;
    setIsGeneratingPdf(true);

    try {
      const html = buildPdfHtml({ productName, version, items, logo: logo?.src });
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

  const loadRecent = (state) => {
    setFile(state.file);
    setProductName(state.productName);
    setVersion(state.version);
    setLogo(state.logo);
    setItems(state.items);
    setSyncStatus('synced');
  };

  const deleteRecent = (key) => {
    setRecentFiles(prev => {
      const newRecent = prev.filter(r => r.key !== key);
      localStorage.setItem('recentFiles', JSON.stringify(newRecent));
      return newRecent;
    });
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
        onShowInfo={handleShowInfo}
        onHomeClick={handleReturnHome}
      />

      <main className="main" role="main">
        {view === 'info' ? (
          <InfoPage onBack={handleBackToApp} />
        ) : (
          <>
            {items.length === 0 ? (
              <div className="empty-state">
            <div className="empty-icon"><FileText size={64} aria-hidden="true" /></div>
            <h1>Release Notes Creator</h1>
            <p>
              {!file 
                ? 'Upload a document in the sidebar to start editing your release notes.' 
                : 'Click "Process Document" in the sidebar to start editing.'}
            </p>
            {recentFiles.length > 0 && (
              <div className="recent-files">
                <h2>Recent Files</h2>
                {recentFiles.map(r => (
                  <div key={r.key} className="recent-file">
                    <span>{r.state.productName} - {r.state.version}</span>
                    <button onClick={() => loadRecent(r.state)}>Load</button>
                    <button onClick={() => deleteRecent(r.key)}>Delete</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="content-area">
            <header className="content-topbar">
              <div className="document-info">
                <span className="doc-label">Editing:</span>
                <span className="doc-name">{file.name}</span>
              </div>
              <div className="topbar-actions">
                <div className={'sync-status ' + syncStatus}>
                  {syncStatus === 'syncing' ? (
                    <Loader2 size={16} className="sync-icon" aria-hidden="true" />
                  ) : syncStatus === 'synced' ? (
                    <Circle size={12} className="sync-dot" aria-hidden="true" />
                  ) : null}
                  <span>{syncStatus === 'synced' ? 'In Sync' : syncStatus === 'Syncing' ? 'Syncing' : 'Not Synced'}</span>
                </div>
                <button 
                  className="btn-ghost" 
                  onClick={handleToggleAll}
                  aria-label="Toggle all items"
                >
                  {items.every(item => item.selected) ? <Square size={16} aria-hidden="true" /> : <CheckSquare size={16} aria-hidden="true" />}
                  <span className="btn-label">{items.every(item => item.selected) ? 'Uncheck All' : 'Check All'}</span>
                </button>
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
                  <span className="btn-label">{isGeneratingPdf ? 'Generating...' : 'Download'}</span>
                </button>
              </div>
            </header>

            <section className="preview-wrapper">
              <Editor
                items={items}
                onToggleItem={handleToggleItem}
                productName={productName}
                version={version}
                logo={logo}
              />
            </section>
          </div>
        )}
      </>
      )}
      </main>
    </div>
  );
}
