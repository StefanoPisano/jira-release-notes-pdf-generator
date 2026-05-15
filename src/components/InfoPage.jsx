import React from 'react';
import { ArrowLeft } from 'lucide-react';

/**
 * Information page displaying app usage guide and documentation.
 */
export default function InfoPage({ onBack }) {
  return (
    <div className="flex-1 flex flex-col overflow-y-auto p-8">
      <button className="inline-flex items-center gap-2 border-none bg-transparent text-accent-light text-sm cursor-pointer mb-5 hover:underline" onClick={onBack}>
        <ArrowLeft size={16} aria-hidden="true" /> Back
      </button>

      <div className="bg-surface border border-border rounded-lg p-8 text-text">
        <h1 className="text-text mb-6">About this Release Notes PDF Generator</h1>

        <section className="mb-8">
          <h2 className="text-text mb-4">Purpose</h2>
          <p className="text-text-muted leading-8 mb-4">
            This tool helps you import a markdown release notes file, select the content
            you want to include, and generate a polished PDF export with metadata such
            as product name, version, logo and generated date.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-text mb-4">How to prepare your Markdown file</h2>
          <p className="text-text-muted leading-8 mb-4">
            The source markdown file should include a title line with the product name and version.
            The app will extract this metadata and use it in the preview and PDF export.
          </p>
          <pre className="bg-opacity-5 border border-border rounded-lg p-4 overflow-x-auto text-text mb-4">
{`# Release notes - My Product - 1.2.3.4

- ABC-123: Fixed login issue
- XYZ-456: Improved performance
- DEF-789: Updated dependencies
`}
          </pre>
          <p className="text-text-muted leading-8 mb-4">
            The file may also contain regular paragraphs instead of a list. In that case, each
            paragraph will be imported as an item.
          </p>
          <p className="text-text-muted leading-8 mb-4">
            If you use Jira releases, you can copy the release description or generated release notes
            directly from Jira and save them as markdown. Make sure to keep the first heading in this
            format so the app can detect the product and version.
          </p>
          <p className="text-text-muted leading-8 mb-4">
            For example, from Jira's release notes page or the release summary you can copy the ticket
            list and paste it into a `.md` file like the sample above.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-text mb-4">How to use the app</h2>
          <ol className="pl-5 text-text-muted leading-8 mb-4">
            <li className="mb-2.5">Upload your Markdown file using the sidebar.</li>
            <li className="mb-2.5">Set or confirm the product name and version.</li>
            <li className="mb-2.5">Click <strong className="text-text">Process Document</strong> to parse the content.</li>
            <li className="mb-2.5">Select or deselect items before generating the PDF.</li>
            <li className="mb-2.5">Download the final PDF with the button in the preview area.</li>
          </ol>
        </section>

        <section>
          <h2 className="text-text mb-4">Notes</h2>
          <ul className="pl-5 text-text-muted leading-8">
            <li className="mb-2.5">Files are remembered only after you click <strong className="text-text">Process Document</strong>.</li>
            <li className="mb-2.5">If you import a file with the same product name and version as an existing recent file, it will replace the previous entry.</li>
            <li className="mb-2.5">The file preview uses a dark style so you can see how the final content will appear.</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
