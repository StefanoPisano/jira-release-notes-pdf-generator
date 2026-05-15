import React from 'react';

/**
 * Sidebar footer with credits and license information.
 */
export function SidebarFooter() {
  return (
    <footer className="px-6 py-4 bg-surface border-t border-border text-center text-xs text-text-muted">
      <div className="max-w-xl mx-0">
        Built with React & Vite – v1.0.0 – Created by{' '}
        <a
          href="https://stefanopisano.github.io"
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent font-semibold no-underline hover:underline"
        >
          Stefano Pisano
        </a>{' '}
        © {new Date().getFullYear()}
        <br />
        Licensed under{' '}
        <a
          href="https://opensource.org/licenses/MIT"
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent font-semibold no-underline hover:underline"
        >
          MIT License
        </a>
      </div>
    </footer>
  );
}
