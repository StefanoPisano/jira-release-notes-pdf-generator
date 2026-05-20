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
      <meta charset="UTF-8" />
      <title>${title}</title>
      <style>
        *, *::before, *::after { box-sizing: border-box; }
        html, body { margin: 0; padding: 0; }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          font-size: 12pt;
          line-height: 1.5;
          color: #111;
          background: #ffffff;
          width: 210mm;
          padding: 0;
        }
        .pdf-page {
          width: 210mm;
          padding: 20mm;
          margin: 0 auto;
          background: #ffffff;
          color: #111;
        }
        .pdf-header {
          text-align: center;
          margin-bottom: 20px;
          border-bottom: 1px solid #555;
          padding:20px 0;
        }
        .logo {
          max-width: 120px;
          max-height: 60px;
          object-fit: contain;
          margin: 0 auto 12px;
          display: block;
        }
        .title {
          font-size: 22pt;
          margin: 0 0 6px;
          color: #111;
        }
        .subtitle {
          font-size: 10pt;
          color: #555;
          margin: 0;
        }
        .ticket-list {
          list-style: none;
          padding-left: 0;
          margin: 0;
        }
        .ticket-list li {
          margin-bottom: 10px;
          padding-left: 0;
          color: #111;
        }
        .ticket-list li p {
          margin: 0;
        }
        a {
          color: #1d4ed8;
          text-decoration: underline;
        }
      </style>
    </head>
    <body>
      <div class="pdf-page">
        <div class="pdf-header">
          ${logo ? `<img src="${logo}" class="logo" alt="Logo" />` : ''}
          <h1 class="title">${title}</h1>
          <p class="subtitle">Generated on ${formatGeneratedDate()}</p>
        </div>
        <ul class="ticket-list">
          ${activeItemsHtml || '<li>No items included in this release.</li>'}
        </ul>
      </div>
    </body>
    </html>
  `;
}

export async function generatePdf({ html, filename }) {
  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.top = '0';
  iframe.style.left = '-10000px';
  iframe.style.width = '190mm';
  iframe.style.height = 'auto';
  iframe.style.opacity = '0';
  iframe.style.pointerEvents = 'none';
  iframe.style.zIndex = '-9999';
  iframe.setAttribute('aria-hidden', 'true');
  document.body.appendChild(iframe);

  const doc = iframe.contentDocument || iframe.contentWindow.document;
  doc.open();
  doc.write(html);
  doc.close();

  await new Promise((resolve) => {
    if (doc.readyState === 'complete') {
      resolve();
      return;
    }
    iframe.onload = () => resolve();
  });

  const body = doc.body;
  body.style.margin = '0';
  body.style.backgroundColor = '#ffffff';
  body.style.width = '210mm';

  const page = doc.querySelector('.pdf-page') || body;
  const images = Array.from(body.querySelectorAll('img'));
  if (images.length > 0) {
    await Promise.all(images.map((img) => {
      if (img.complete) return Promise.resolve();
      return new Promise((resolve) => {
        img.onload = img.onerror = () => resolve();
      });
    }));
  }

  try {
    const canvas = await html2canvas(page, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
      logging: false,
      windowWidth: page.scrollWidth,
      windowHeight: page.scrollHeight,
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgProps = pdf.getImageProperties(imgData);
    const imgWidth = pdfWidth;
    const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

    const pageCount = Math.max(1, Math.ceil((imgHeight - 1) / pdfHeight));
    let heightLeft = imgHeight;
    let position = 0;
    let pageIndex = 1;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
    pdf.setFontSize(10);
    pdf.setTextColor(100);
    pdf.text(`Page ${pageIndex} of ${pageCount}`, pdfWidth / 2, pdfHeight - 10, { align: 'center' });
    heightLeft -= pdfHeight;

    while (heightLeft > 1) {
      pageIndex += 1;
      position -= pdfHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
      pdf.text(`Page ${pageIndex} of ${pageCount}`, pdfWidth / 2, pdfHeight - 10, { align: 'center' });
      heightLeft -= pdfHeight;
    }

    return pdf.output('blob');
  } finally {
    document.body.removeChild(iframe);
  }
}
