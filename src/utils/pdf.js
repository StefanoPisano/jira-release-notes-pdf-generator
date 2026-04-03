/**
 * Generates the HTML for the PDF based on provided items and metadata.
 */
export function buildPdfHtml({ productName, version, items, logo }) {
  const activeItemsHtml = items
    .filter(item => !item.deleted)
    .map(item => `<li>${item.content}</li>`)
    .join('');

  const title = `Release Notes - ${productName ? productName + ' - ' : ''}${version || 'v1.0.0.0'}`;

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>${title}</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          font-size: 11pt;
          line-height: 1.5;
          color: black;
          background: white;
          margin: 0;
          padding: 0;
        }
        .pdf-header {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-bottom: 30px;
          border-bottom: 2px solid #eee;
          padding-bottom: 20px;
        }
        .logo {
          max-width: 100px;
          max-height: 60px;
          object-fit: contain;
        }
        .header-text h1 {
          font-size: 18pt;
          margin: 0;
          color: #333;
        }
        .header-text p {
          font-size: 10pt;
          color: #666;
          margin: 5px 0 0 0;
        }
        ul {
          padding-left: 1.2rem;
          margin-top: 0;
        }
        li {
          margin-bottom: 0.8rem;
        }
        a {
          color: blue;
          text-decoration: underline;
        }
        strong {
          font-weight: bold;
        }
      </style>
    </head>
    <body>
      <div class="pdf-header">
        ${logo ? `<img src="${logo}" class="logo" alt="Logo" />` : ''}
        <div class="header-text">
          <h1>${title}</h1>
          <p>Generated on ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
        </div>
      </div>
      <main>
        <ul>
          ${activeItemsHtml || '<li>No items included in this release.</li>'}
        </ul>
      </main>
    </body>
    </html>
  `;
}

export async function generatePdf(payload) {
  const res = await fetch('/api/generate-pdf', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || 'PDF Generation failed');
  }

  return res.blob();
}
