import { useState } from 'react';
import { marked } from 'marked';
import { generateId } from '../utils/helpers';

/**
 * Custom hook for processing markdown documents.
 * Handles parsing markdown content and extracting items.
 */
export function useDocumentProcessor() {
  const [items, setItems] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const extractTicketNumber = (content) => {
    const match = content.match(/(\w+)-(\d+)/);
    return match ? parseInt(match[2]) : 0;
  };

  const processDocument = (fileContent) => {
    setIsProcessing(true);

    try {
      const htmlMarkup = marked.parse(fileContent);
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = htmlMarkup;

      const extractedItems = [];

      // Strategy: Look for <li> elements first (lists), then fall back to <p>
      const listItems = tempDiv.querySelectorAll('li');
      if (listItems.length > 0) {
        listItems.forEach(li => {
          extractedItems.push({
            id: generateId(),
            content: li.innerHTML,
            selected: true
          });
        });
      } else {
        const paragraphs = tempDiv.querySelectorAll('p');
        paragraphs.forEach(p => {
          extractedItems.push({
            id: generateId(),
            content: p.innerHTML,
            selected: true
          });
        });
      }

      // Sort by ticket number ascending
      extractedItems.sort((a, b) => {
        const numA = extractTicketNumber(a.content);
        const numB = extractTicketNumber(b.content);
        return numA - numB;
      });

      setItems(extractedItems);
    } finally {
      setIsProcessing(false);
    }
  };

  const toggleItem = (id) => {
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, selected: !item.selected } : item
      )
    );
  };

  const toggleAllItems = () => {
    const allSelected = items.every(item => item.selected);
    setItems(prevItems =>
      prevItems.map(item => ({ ...item, selected: !allSelected }))
    );
  };

  const resetItems = () => {
    setItems([]);
  };

  return {
    items,
    setItems,
    isProcessing,
    processDocument,
    toggleItem,
    toggleAllItems,
    resetItems
  };
}
