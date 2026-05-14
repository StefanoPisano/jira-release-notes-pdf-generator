import React from 'react';

export default function Editor({ items, onToggleItem, productName, version, logo }) {
  const logoSrc = logo && typeof logo === 'object' ? logo.src : logo;
  const title = `Release Notes - ${productName ? productName + ' - ' : ''}${version || 'v1.0.0.0'}`;
  const currentDate = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

  if (items.length === 0) {
    return (
      <div className="preview-container">
        <p className="empty-message">No content found in document.</p>
      </div>
    );
  }

  return (
    <div className="preview-container" role="region" aria-label="Interactive release notes editor">
      <div className="pdf-header-preview">
        {logoSrc && <img src={logoSrc} className="logo-preview" alt="Logo" />}
        <div className="header-text-preview">
          <h1>{title}</h1>
          <p>Generated on {currentDate}</p>
        </div>
      </div>
      <ul className="preview-items">
        {items.map(item => (
          <li key={item.id} className={`removable-item ${!item.selected ? 'unselected-item' : ''}`}>
            <label>
              <input 
                type="checkbox" 
                className="item-checkbox"
                checked={item.selected} 
                onChange={() => onToggleItem(item.id)}
              />
              <div className="item-content">
                <div dangerouslySetInnerHTML={{ __html: item.content }} />
              </div>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}
