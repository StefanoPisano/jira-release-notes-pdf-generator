import React from 'react';
import { X } from 'lucide-react';

export default function Editor({ items, onToggleItem }) {
  if (items.length === 0) {
    return (
      <div className="preview-container">
        <p className="empty-message">No content found in document.</p>
      </div>
    );
  }

  return (
    <div className="preview-container" role="region" aria-label="Interactive release notes editor">
      {items.map(item => (
        <div 
          key={item.id} 
          className={`removable-item ${item.deleted ? 'hidden-item' : ''}`}
          aria-hidden={item.deleted}
        >
          {!item.deleted && (
            <button 
              className="delete-btn" 
              onClick={() => onToggleItem(item.id)}
              aria-label="Remove item"
            >
              <X size={12} aria-hidden="true" />
            </button>
          )}

          {item.deleted ? (
            <div 
              className="deleted-placeholder" 
              onClick={() => onToggleItem(item.id)}
              role="button"
              aria-label="Restore item"
            >
              Item removed (Click to restore)
            </div>
          ) : (
            <p dangerouslySetInnerHTML={{ __html: item.content }} />
          )}
        </div>
      ))}
    </div>
  );
}
