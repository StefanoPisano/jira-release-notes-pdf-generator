import React from 'react';
import { X } from 'lucide-react';

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
  showProcessButton
}) {
  const logoInputRef = React.useRef(null);
  const fileInputRef = React.useRef(null);
  return (
    <aside className="sidebar">
      <div className="sidebar-content">
        <div className="sidebar-header">
          <h1 className="form-section-title">Release Generator</h1>
          <p className="section-desc">Prepare your document for PDF export.</p>
        </div>

        {file && (
          <div className="file-info" aria-live="polite">
            <div className="file-details">
              <span className="file-name">{file.name}</span>
              <span className="file-size">{file.size}</span>
            </div>
            <button 
              className="btn-icon" 
              onClick={onReset}
              aria-label="Remove current file"
            >
              <X size={16} aria-hidden="true" />
            </button>
          </div>
        )}

        <div className="sidebar-form-fields">
          <div className="field-group">
            <label>Logo</label>
            <div className="logo-upload-wrapper">
              {logo ? (
                <div className="logo-preview-container">
                  <img src={logo} alt="Logo preview" className="logo-preview" />
                  <button className="btn-remove-logo" onClick={() => onLogoSelect(null)} aria-label="Remove logo">
                    <X size={12} />
                  </button>
                </div>
              ) : (
                <button 
                  className="btn-outline-sm" 
                  onClick={() => logoInputRef.current?.click()}
                >
                  Upload Logo
                </button>
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
