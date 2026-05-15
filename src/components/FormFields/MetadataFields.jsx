import React from 'react';

/**
 * Product name and version input fields.
 */
export function MetadataFields({ productName, setProductName, version, setVersion }) {
  return (
    <>
      <div className="flex flex-col gap-1.5 field-group">
        <label htmlFor="productName" className="text-xs font-semibold uppercase tracking-wider text-text-muted">
          Product Name
        </label>
        <input
          id="productName"
          type="text"
          placeholder="e.g. My App"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          className="bg-surface border border-border rounded-md px-3 py-2 text-sm text-text outline-none transition-colors focus:border-accent"
        />
      </div>

      <div className="flex flex-col gap-1.5 field-group">
        <label htmlFor="version" className="text-xs font-semibold uppercase tracking-wider text-text-muted">
          Version
        </label>
        <input
          id="version"
          type="text"
          placeholder="e.g. 1.2.3.4"
          value={version}
          onChange={(e) => setVersion(e.target.value)}
          className="bg-surface border border-border rounded-md px-3 py-2 text-sm text-text outline-none transition-colors focus:border-accent"
        />
      </div>
    </>
  );
}
