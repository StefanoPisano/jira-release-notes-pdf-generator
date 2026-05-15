import React from 'react';
import { formatReleaseTitle, formatGeneratedDate } from '../utils/titleFormatter';

/**
 * Interactive editor component displaying release notes items.
 * Allows users to toggle items for inclusion in the final PDF.
 */
export default function Editor({ items, onToggleItem, productName, version, logo }) {
  const logoSrc = logo && typeof logo === 'object' ? logo.src : logo;
  const title = formatReleaseTitle(productName, version);
  const currentDate = formatGeneratedDate();

  if (items.length === 0) {
    return (
      <div className="w-full min-h-full bg-surface rounded-md p-8 text-white">
        <p className="text-text-muted">No content found in document.</p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-full bg-surface rounded-md p-8 text-white" role="region" aria-label="Interactive release notes editor">
      <div className="flex flex-col items-center gap-5 mb-7 border-b-2 border-gray-600 pb-5">
        {logoSrc && <img src={logoSrc} className="max-w-xs max-h-16 object-contain" alt="Logo" />}
        <div className="text-center">
          <h1 className="text-lg font-bold m-0 text-white">{title}</h1>
          <p className="text-xs text-gray-300 mt-1 m-0">Generated on {currentDate}</p>
        </div>
      </div>
      <ul className="list-disc pl-5 m-0 text-white space-y-2">
        {items.map(item => (
          <li key={item.id} className={`flex items-start gap-3 p-2 rounded-md transition-all cursor-pointer mb-1 ${!item.selected ? 'opacity-40' : 'hover:bg-blue-900 hover:bg-opacity-10'}`}>
            <label className="flex items-start gap-2 w-full">
              <input
                type="checkbox"
                className="flex-shrink-0 mt-0.5 cursor-pointer w-4 h-4"
                checked={item.selected}
                onChange={() => onToggleItem(item.id)}
                style={{ accentColor: 'var(--accent)' }}
              />
              <div className="flex-1 text-white">
                <div className="text-sm leading-6 text-white inline" dangerouslySetInnerHTML={{ __html: item.content }} />
              </div>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}
