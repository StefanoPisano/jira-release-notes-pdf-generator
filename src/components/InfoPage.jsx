import React from 'react';
import { ArrowLeft } from 'lucide-react';

export default function InfoPage({ onBack }) {
  return (
    <div className="info-page">
      <button className="btn-link" onClick={onBack}>
        <ArrowLeft size={16} aria-hidden="true" /> Back
      </button>

      <div className="info-content">
        <h1>About this Release Notes PDF Generator</h1>

        <section>
          <h2>Purpose</h2>
          <p>
            This tool helps you import a markdown release notes file, select the content
            you want to include, and generate a polished PDF export with metadata such
            as product name, version, logo and generated date.
          </p>
        </section>

        <section>
          <h2>How to prepare your Markdown file</h2>
          <p>
            The source markdown file should include a title line with the product name and version.
            The app will extract this metadata and use it in the preview and PDF export.
          </p>
          <pre>
{`# Release notes - My Product - 1.2.3.4

- ABC-123: Fixed login issue
- XYZ-456: Improved performance
- DEF-789: Updated dependencies
`}
          </pre>
          <p>
            The file may also contain regular paragraphs instead of a list. In that case, each
            paragraph will be imported as an item.
          </p>
          <p>
            If you use Jira releases, you can copy the release description or generated release notes
            directly from Jira and save them as markdown. Make sure to keep the first heading in this
            format so the app can detect the product and version.
          </p>
          <p>
            For example, from Jira's release notes page or the release summary you can copy the ticket
            list and paste it into a `.md` file like the sample above.
          </p>
        </section>

        <section>
          <h2>How to use the app</h2>
          <ol>
            <li>Upload your Markdown file using the sidebar.</li>
            <li>Set or confirm the product name and version.</li>
            <li>Click <strong>Process Document</strong> to parse the content.</li>
            <li>Select or deselect items before generating the PDF.</li>
            <li>Download the final PDF with the button in the preview area.</li>
          </ol>
        </section>

        <section>
          <h2>Notes</h2>
          <ul>
            <li>Files are remembered only after you click <strong>Process Document</strong>.</li>
            <li>If you import a file with the same product name and version as an existing recent file, it will replace the previous entry.</li>
            <li>The file preview uses a dark style so you can see how the final content will appear.</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
