import React from 'react';
import { X, HomeIcon } from 'lucide-react';

export default function Sidebar({ 
  file, 
  onFileSelect,
  logo,
  onLogoSelect,
  productName, 
  setProductName, 
  version, 
  setVersion, 
  onReset, 
  onProcess, 
  isProcessing,
  showProcessButton,
  onShowInfo,
  onHomeClick
}) {
  const logoInputRef = React.useRef(null);
  const fileInputRef = React.useRef(null);
  return (
    <aside className="sidebar">
      <div className="sidebar-content">
        <div className="sidebar-header">
          <button type="button" className="sidebar-title-button" onClick={onHomeClick}>
            <h1 className="form-section-title"><HomeIcon size={18}/> Release Generator</h1>
          </button>
          <p className="section-desc">Prepare your document for PDF export.</p>
        </div>

        <div className="sidebar-form-fields">
          <div className="field-group">
            <label>Logo</label>
            <div className="logo-upload-wrapper">
              {!logo ? (
                <button 
                  className="btn-outline-sm-full" 
                  onClick={() => logoInputRef.current?.click()}
                >
                  Upload Logo
                </button>
              ) : (
                <div className="file-info-compact" aria-live="polite">
                  <span className="file-name-compact">{logo.name}</span>
                  <button 
                    className="btn-icon-xs" 
                    onClick={() => onLogoSelect(null)}
                    aria-label="Remove logo"
                  >
                    <X size={14} aria-hidden="true" />
                  </button>
                </div>
              )}
              <input 
                type="file" 
                ref={logoInputRef} 
                onChange={(e) => e.target.files[0] && onLogoSelect(e.target.files[0])} 
                accept="image/*" 
                hidden 
              />
            </div>
          </div>

          <div className="field-group">
            <label htmlFor="productName">Product Name</label>
            <input 
              id="productName"
              type="text" 
              placeholder="e.g. My App"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
            />
          </div>
          
          <div className="field-group">
            <label htmlFor="version">Version</label>
            <input 
              id="version"
              type="text" 
              placeholder="e.g. 1.2.3.4"
              value={version}
              onChange={(e) => setVersion(e.target.value)}
            />
          </div>

          <div className="field-group">
            <label>Document (.md)</label>
            {!file ? (
              <button 
                className="btn-outline-sm" 
                onClick={() => fileInputRef.current?.click()}
              >
                Upload Markdown
              </button>
            ) : (
              <div className="file-info-compact" aria-live="polite">
                <span className="file-name-compact">{file.name}</span>
                <button 
                  className="btn-icon-xs" 
                  onClick={onReset}
                  aria-label="Remove current file"
                >
                  <X size={14} aria-hidden="true" />
                </button>
              </div>
            )}
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={(e) => e.target.files[0] && onFileSelect(e.target.files[0])} 
              accept=".md" 
              hidden 
            />
          </div>
        </div>
      </div>

      <div className="sidebar-actions">
        <button 
          className="btn-secondary" 
          type="button"
          onClick={onShowInfo}
        >
          About / How to use
        </button>
        <button 
          className="btn-primary" 
          disabled={!file || !showProcessButton || isProcessing} 
          onClick={onProcess}
        >
          {isProcessing ? 'Processing...' : 'Process Document'}
        </button>
      </div>
    </aside>
  );
}
