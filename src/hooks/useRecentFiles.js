import { useState, useEffect, useRef, useCallback } from 'react';

const RECENT_FILES_KEY = 'recentFiles';
const MAX_RECENT_FILES = 5;

/**
 * Custom hook for managing recent files in localStorage.
 */
export function useRecentFiles() {
  const [recentFiles, setRecentFiles] = useState([]);
  const [syncStatus, setSyncStatus] = useState('not-synced');
  const syncTimeoutRef = useRef(null);

  // Load recent files from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(RECENT_FILES_KEY);
    if (saved) {
      try {
        setRecentFiles(JSON.parse(saved));
      } catch (err) {
        console.error('Failed to parse recent files:', err);
      }
    }
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }
    };
  }, []);

  const saveState = useCallback((currentFile, currentProduct, currentVersion, currentLogo, currentItems) => {
    // Don't save if incomplete
    if (!currentFile || !currentProduct || !currentVersion || currentItems.length === 0) {
      setSyncStatus('not-synced');
      return;
    }

    if (syncTimeoutRef.current) {
      clearTimeout(syncTimeoutRef.current);
      syncTimeoutRef.current = null;
    }

    setSyncStatus('syncing');
    const key = `${currentProduct}-${currentVersion}`;

    setRecentFiles(prev => {
      const newEntry = {
        key,
        state: {
          file: currentFile,
          productName: currentProduct,
          version: currentVersion,
          logo: currentLogo,
          items: currentItems
        }
      };

      const found = prev.find(r => r.key === key);
      const newRecent = found
        ? prev.map(r => (r.key === key ? newEntry : r))
        : [newEntry, ...prev];

      if (!found && newRecent.length > MAX_RECENT_FILES) {
        newRecent.pop();
      }

      localStorage.setItem(RECENT_FILES_KEY, JSON.stringify(newRecent));

      syncTimeoutRef.current = window.setTimeout(() => {
        setSyncStatus('synced');
        syncTimeoutRef.current = null;
      }, 500);

      return newRecent;
    });
  }, []);

  const deleteRecent = (key) => {
    setRecentFiles(prev => {
      const newRecent = prev.filter(r => r.key !== key);
      localStorage.setItem(RECENT_FILES_KEY, JSON.stringify(newRecent));
      return newRecent;
    });
  };

  return {
    recentFiles,
    syncStatus,
    saveState,
    deleteRecent
  };
}
