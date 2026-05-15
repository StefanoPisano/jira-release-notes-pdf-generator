import React from 'react';

/**
 * Sidebar action buttons (About and Process Document).
 */
export function SidebarActions({
  showProcessButton,
  isProcessing,
  onProcess,
  onShowInfo
}) {
  return (
    <div className="px-6 pb-6 pt-4 border-t border-border bg-surface space-y-3">
        <button
            className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-accent text-white rounded-lg font-semibold cursor-pointer transition-all hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed"
            disabled={!showProcessButton || isProcessing}
            onClick={onProcess}
        >
            {isProcessing ? 'Processing...' : 'Process Document'}
        </button>
      <button
        className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 bg-transparent border border-border text-text rounded-lg font-semibold cursor-pointer transition-all hover:bg-white hover:bg-opacity-5 mb-3"
        type="button"
        onClick={onShowInfo}
      >
        About / How to use
      </button>
    </div>
  );
}
