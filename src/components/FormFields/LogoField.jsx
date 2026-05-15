import React, { useRef } from 'react';
import { X } from 'lucide-react';

/**
 * Logo upload form field with preview.
 * Handles logo file selection and removal.
 */
export function LogoField({ logo, onLogoSelect }) {
  const logoInputRef = useRef(null);

  return (
    <div className="flex flex-col gap-1.5 field-group">
      <label className="text-xs font-semibold uppercase tracking-wider text-text-muted">
        Logo
      </label>
      <div className="w-full">
        {!logo ? (
          <button
            className="w-full bg-transparent border border-border text-text px-3 py-1.5 rounded-md text-xs font-medium cursor-pointer transition-all hover:bg-white hover:bg-opacity-5 hover:border-text-muted"
            onClick={() => logoInputRef.current?.click()}
            type="button"
          >
            Upload Logo
          </button>
        ) : (
          <div className="bg-surface2 border border-border rounded-md px-3 py-2 flex items-center justify-between gap-2 " aria-live="polite">
            <span className="text-xs font-medium text-text whitespace-nowrap overflow-hidden text-ellipsis">
              {logo.name}
            </span>
            <button
              className="bg-none border-none text-text-muted cursor-pointer p-0.5 flex items-center justify-center rounded hover:text-danger hover:bg-danger-bg"
              onClick={() => onLogoSelect(null)}
              aria-label="Remove logo"
              type="button"
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
  );
}
