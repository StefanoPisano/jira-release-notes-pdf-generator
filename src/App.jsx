import React, { useState, useEffect } from 'react';
import {
  FileText,
  Download,
  Trash2,
  CheckSquare,
  Square,
  Loader2,
  Circle
} from 'lucide-react';

// Components
import Sidebar from './components/Sidebar';
import Editor from './components/Editor';
import InfoPage from './components/InfoPage';

// Custom hooks
import { useFileHandler } from './hooks/useFileHandler';
import { useDocumentProcessor } from './hooks/useDocumentProcessor';
import { useRecentFiles } from './hooks/useRecentFiles';

// Utilities
import { buildPdfHtml, generatePdf } from './utils/pdf';
import { formatReleaseTitle } from './utils/titleFormatter';

/**
 * Main application component.
 * Orchestrates document processing, PDF generation, and state management.
 */
export default function App() {
  // File and logo handling
  const {
    file,
    setFile,
    logo,
    setLogo,
    handleFileSelect,
    handleLogoSelect,
    resetFile
  } = useFileHandler();

  // Document processing
  const {
    items,
    setItems,
    isProcessing,
    processDocument,
    toggleItem,
    toggleAllItems,
    resetItems
  } = useDocumentProcessor();

  // Recent files management
  const { recentFiles, syncStatus, saveState, deleteRecent } = useRecentFiles();

  // UI state
  const [view, setView] = useState('app');
  const [productName, setProductName] = useState('');
  const [version, setVersion] = useState('');
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  // Auto-save state to localStorage when any dependency changes
  useEffect(() => {
    saveState(file, productName, version, logo, items);
  }, [file, productName, version, logo, items, saveState]);

  const handleFileSelectWrapper = (selectedFile) => {
    handleFileSelect(selectedFile, ({ extractedProduct, extractedVersion }) => {
      if (extractedProduct) setProductName(extractedProduct);
      if (extractedVersion) setVersion(extractedVersion);
    });
  };

  const handleProcess = () => {
    if (!file) return;
    processDocument(file.content);
  };

  const handleDownloadPdf = async () => {
    if (items.length === 0) return;
    setIsGeneratingPdf(true);

    try {
      const html = buildPdfHtml({
        productName,
        version,
        items,
        logo: logo?.src
      });
      const filename = `Release Notes - ${
        productName ? productName + ' - ' : ''
      }${version || 'Version'}`;

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

  const handleReset = () => {
    resetFile();
    resetItems();
    setProductName('');
    setVersion('');
    setView('app');
  };

  const handleLoadRecent = (state) => {
    setFile(state.file);
    setProductName(state.productName);
    setVersion(state.version);
    setLogo(state.logo);
    setItems(state.items);
  };

  const handleReturnHome = () => {
    resetItems();
    setView('app');
  };

  const handleShowInfo = () => setView('info');
  const handleBackToApp = () => setView('app');
  const handleHomeClick = () => setView('app');

  return (
    <div className="flex w-full h-screen">
      <Sidebar
        file={file}
        onFileSelect={handleFileSelectWrapper}
        logo={logo}
        onLogoSelect={handleLogoSelect}
        productName={productName}
        setProductName={setProductName}
        version={version}
        setVersion={setVersion}
        onReset={handleReset}
        onProcess={handleProcess}
        isProcessing={isProcessing}
        showProcessButton={!!file && items.length === 0}
        onShowInfo={handleShowInfo}
        onHomeClick={handleHomeClick}
      />

      <main className="flex-1 h-screen overflow-hidden flex flex-col" role="main">
        {view === 'info' ? (
          <InfoPage onBack={handleBackToApp} />
        ) : (
          <>
            {items.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-10 text-text-muted gap-4">
                <div className="text-6xl mb-2">
                  <FileText size={64} aria-hidden="true" />
                </div>
                <h1 className="text-2xl font-black text-text -tracking-widest">
                  Release Notes Creator
                </h1>
                <p className="text-base max-w-sm leading-6">
                  {!file
                    ? 'Upload a document in the sidebar to start editing your release notes.'
                    : 'Click "Process Document" in the sidebar to start editing.'}
                </p>
                {recentFiles.length > 0 && (
                  <div className="mt-8 text-left max-w-sm w-full">
                    <h2 className="text-lg font-semibold text-text mb-4">
                      Recent Files
                    </h2>
                    {recentFiles.map(r => (
                      <div key={r.key} className="flex items-center justify-between p-3 bg-surface border border-border rounded-md mb-2">
                        <span className="flex-1 text-sm text-text">
                          {r.state.productName} - {r.state.version}
                        </span>
                        <button onClick={() => handleLoadRecent(r.state)} className="ml-2 px-3 py-1.5 text-xs border border-border bg-bg text-text rounded cursor-pointer hover:bg-surface">
                          Load
                        </button>
                        <button onClick={() => deleteRecent(r.key)} className="ml-2 px-3 py-1.5 text-xs border border-border bg-bg text-text rounded cursor-pointer hover:bg-surface">
                          Delete
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex-1 flex flex-col overflow-hidden">
                <header className="px-8 py-4 border-b border-border flex items-center justify-between bg-surface z-10">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold uppercase text-text-muted tracking-wider">
                      Editing:
                    </span>
                    <span className="text-base font-semibold text-accent-light">
                      {file.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={`inline-flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs font-semibold border border-transparent whitespace-nowrap sync-status ${syncStatus}`}>
                      {syncStatus === 'syncing' ? (
                        <Loader2
                          size={16}
                          className="animate-spin"
                          aria-hidden="true"
                        />
                      ) : syncStatus === 'synced' ? (
                        <Circle
                          size={12}
                          className="animate-pulse fill-current"
                          aria-hidden="true"
                        />
                      ) : null}
                      <span className="capitalize">
                        {syncStatus === 'synced'
                          ? 'In Sync'
                          : syncStatus === 'syncing'
                          ? 'Syncing'
                          : 'Not Synced'}
                      </span>
                    </div>
                    <button
                      className="flex items-center gap-1.5  bg-opacity-5 border border-border text-text text-xs font-medium px-4 py-2 rounded-lg transition-all hover:bg-opacity-10 hover:border-text-muted whitespace-nowrap"
                      onClick={toggleAllItems}
                      aria-label="Toggle all items"
                    >
                      {items.every(item => item.selected) ? (
                        <Square size={16} aria-hidden="true" />
                      ) : (
                        <CheckSquare size={16} aria-hidden="true" />
                      )}
                      <span>
                        {items.every(item => item.selected)
                          ? 'Uncheck All'
                          : 'Check All'}
                      </span>
                    </button>
                    <button
                      className="flex items-center gap-1.5 bg-opacity-5 border border-border text-text text-xs font-medium px-4 py-2 rounded-lg transition-all hover:bg-opacity-10 hover:border-text-muted whitespace-nowrap"
                      onClick={handleReset}
                      aria-label="Close editor and reset"
                    >
                      <Trash2 size={16} aria-hidden="true" />
                      <span>Reset</span>
                    </button>
                    <button
                      className="w-auto flex items-center justify-center gap-2 px-5 py-3 bg-accent text-white rounded-lg font-semibold cursor-pointer transition-all hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed"
                      onClick={handleDownloadPdf}
                      disabled={isGeneratingPdf}
                    >
                      <Download size={16} aria-hidden="true" />
                      <span>
                        {isGeneratingPdf ? 'Generating...' : 'Download'}
                      </span>
                    </button>
                  </div>
                </header>

                <section className="bg-surface flex-1 overflow-y-auto p-6">
                  <Editor
                    items={items}
                    onToggleItem={toggleItem}
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
