import React, { useRef } from 'react';
import { X } from 'lucide-react';

/**
 * Markdown document upload field with file display and removal.
 */
export function DocumentField({ file, onFileSelect, onReset }) {
  const fileInputRef = useRef(null);

  return (
    <div className="flex flex-col gap-1.5 field-group">
      <label className="text-xs font-semibold uppercase tracking-wider text-text-muted">
        Document (.md)
      </label>
      {!file ? (
        <button
          className="bg-transparent border border-border text-text px-3 py-1.5 rounded-md text-xs font-medium cursor-pointer transition-all hover:bg-white hover:bg-opacity-5 hover:border-text-muted"
          onClick={() => fileInputRef.current?.click()}
          type="button"
        >
          Upload Markdown
        </button>
      ) : (
        <div className="bg-surface2 border border-border rounded-md px-3 py-2 flex items-center justify-between gap-2" aria-live="polite">
          <span className="text-xs font-medium text-text whitespace-nowrap overflow-hidden text-ellipsis">
            {file.name}
          </span>
          <button
            className="bg-none border-none text-text-muted cursor-pointer p-0.5 flex items-center justify-center rounded hover:text-danger hover:bg-danger-bg"
            onClick={onReset}
            aria-label="Remove current file"
            type="button"
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
  );
}
