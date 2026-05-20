import { formatReleaseTitle, formatGeneratedDate } from './titleFormatter';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Builds the PDF HTML structure with header, content, and styling.
 * Filters to include only selected items.
 */
export function buildPdfHtml({ productName, version, items, logo }) {
  const activeItemsHtml = items
    .filter(item => item.selected)
    .map(item => `<li>${item.content}</li>`)
    .join('');

  const title = formatReleaseTitle(productName, version);

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
          flex-direction: column;
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
          list-style-type: none;
          padding-left: 0;
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
          <p>Generated on ${formatGeneratedDate()}</p>
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

export async function generatePdf({ html, filename }) {
  const wrapper = document.createElement('div');
  wrapper.style.position = 'fixed';
  wrapper.style.top = '0';
  wrapper.style.left = '-10000px';
  wrapper.style.width = '190mm';
  wrapper.style.boxSizing = 'border-box';
  wrapper.style.opacity = '0';
  wrapper.style.pointerEvents = 'none';
  wrapper.style.zIndex = '-9999';
  wrapper.innerHTML = html;
  document.body.appendChild(wrapper);

  try {
    const content = wrapper.querySelector('body') || wrapper;
    const canvas = await html2canvas(content, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
      logging: false,
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgProps = pdf.getImageProperties(imgData);
    const imgWidth = pdfWidth;
    const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
    heightLeft -= pdfHeight;

    while (heightLeft > 0) {
      position -= pdfHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pdfHeight;
    }

    return pdf.output('blob');
  } finally {
    document.body.removeChild(wrapper);
  }
}
