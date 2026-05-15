import React from 'react';
import { HomeIcon } from 'lucide-react';
import { LogoField } from './FormFields/LogoField';
import { MetadataFields } from './FormFields/MetadataFields';
import { DocumentField } from './FormFields/DocumentField';
import { SidebarActions } from './SidebarActions';
import { SidebarFooter } from './SidebarFooter';

/**
 * Sidebar component for document input and configuration.
 * Displays form fields for logo, product name, version, and document upload.
 */
export default function Sidebar({
  file,
  onFileSelect,
  logo,
  onLogoSelect,
  productName,
  setProductName,
  version,
  setVersion,
  onReset,
  onProcess,
  isProcessing,
  showProcessButton,
  onShowInfo,
  onHomeClick
}) {
  return (
    <aside className="w-full md:w-80 md:min-w-[320px] bg-surface border-b border-border md:border-b-0 md:border-r flex flex-col h-auto md:h-screen overflow-hidden">
      <div className="flex-1 overflow-y-auto p-6">
        <div className="mb-6">
          <button type="button" className="w-full text-left cursor-pointer hover:underline sidebar-title-button" onClick={onHomeClick}>
            <h1 className="text-2xl font-bold text-text mb-1 -tracking-widest flex items-center gap-2">
              <HomeIcon size={18} /> Release Generator
            </h1>
          </button>
          <p className="text-sm text-text-muted leading-6">
            Prepare your document for PDF export.
          </p>
        </div>

        <div className="mt-6 flex flex-col gap-4">
          <LogoField logo={logo} onLogoSelect={onLogoSelect} />

          <MetadataFields
            productName={productName}
            setProductName={setProductName}
            version={version}
            setVersion={setVersion}
          />

          <DocumentField
            file={file}
            onFileSelect={onFileSelect}
            onReset={onReset}
          />
        </div>
      </div>

      <SidebarActions
        showProcessButton={showProcessButton}
        isProcessing={isProcessing}
        onProcess={onProcess}
        onShowInfo={onShowInfo}
      />

      <SidebarFooter />
    </aside>
  );
}
