/* ─── State ───────────────────────────────────────────────────────────────── */
let currentFileContent = null;
let currentFileName = null;

/* ─── DOM refs ────────────────────────────────────────────────────────────── */
const uploadZone     = document.getElementById('uploadZone');
const fileInput      = document.getElementById('fileInput');
const fileInfo       = document.getElementById('fileInfo');
const fileNameEl     = document.getElementById('fileName');
const fileSizeEl     = document.getElementById('fileSize');
const removeFileBtn  = document.getElementById('removeFileBtn');
const processBtn     = document.getElementById('processBtn');

const emptyState     = document.getElementById('emptyState');
const contentArea    = document.getElementById('contentArea');
const previewCont    = document.getElementById('previewContainer');
const currentFileNameEl = document.getElementById('currentFileName');

const clearPreviewBtn = document.getElementById('clearPreviewBtn');
const downloadPdfBtn  = document.getElementById('downloadPdfBtn');

/* ─── Upload Handling ────────────────────────────────────────────────────── */

uploadZone.addEventListener('click', () => fileInput.click());

fileInput.addEventListener('change', (e) => {
  if (e.target.files.length) handleFile(e.target.files[0]);
});

uploadZone.addEventListener('dragover', (e) => {
  e.preventDefault();
  uploadZone.classList.add('dragover');
});

uploadZone.addEventListener('dragleave', () => {
  uploadZone.classList.remove('dragover');
});

uploadZone.addEventListener('drop', (e) => {
  e.preventDefault();
  uploadZone.classList.remove('dragover');
  if (e.dataTransfer.files.length) handleFile(e.dataTransfer.files[0]);
});

function handleFile(file) {
  const isHtml = file.name.endsWith('.html');
  const isMd   = file.name.endsWith('.md');

  if (!isHtml && !isMd) {
    alert('Please upload an .html or .md file.');
    return;
  }

  currentFileName = file.name;
  const reader = new FileReader();
  reader.onload = (e) => {
    currentFileContent = e.target.result;
    showFileDetails(file);
  };
  reader.readAsText(file);
}

function showFileDetails(file) {
  fileNameEl.textContent = file.name;
  fileSizeEl.textContent = formatBytes(file.size);
  fileInfo.classList.remove('hidden');
  uploadZone.classList.add('hidden');
  processBtn.disabled = false;
}

removeFileBtn.addEventListener('click', () => {
  resetUploader();
});

function resetUploader() {
  currentFileContent = null;
  currentFileName = null;
  fileInput.value = '';
  fileInfo.classList.add('hidden');
  uploadZone.classList.remove('hidden');
  processBtn.disabled = true;
}

/* ─── Processing & Interaction ───────────────────────────────────────────── */

processBtn.addEventListener('click', () => {
  if (!currentFileContent) return;

  let htmlMarkup = '';
  if (currentFileName.endsWith('.md')) {
    htmlMarkup = marked.parse(currentFileContent);
  } else {
    htmlMarkup = currentFileContent;
  }

  renderInteractive(htmlMarkup);
  
  currentFileNameEl.textContent = currentFileName;
  emptyState.classList.add('hidden');
  contentArea.classList.remove('hidden');
  downloadPdfBtn.disabled = false;
});

function renderInteractive(html) {
  // Use a temporary div to parse and manipulate
  const temp = document.createElement('div');
  temp.innerHTML = html;

  // Find all <p> elements and make them interactive
  const paragraphs = temp.querySelectorAll('p');
  paragraphs.forEach(p => {
    const wrapper = document.createElement('div');
    wrapper.className = 'removable-item';
    
    // Create delete button
    const delBtn = document.createElement('button');
    delBtn.className = 'delete-btn';
    delBtn.innerHTML = '✕';
    delBtn.title = 'Remove item';
    delBtn.onclick = (e) => {
      e.stopPropagation();
      wrapper.remove();
      checkEmpty();
    };

    // Replace <p> with our wrapped version
    p.parentNode.replaceChild(wrapper, p);
    wrapper.appendChild(delBtn);
    wrapper.appendChild(p);
  });

  previewCont.innerHTML = '';
  previewCont.appendChild(temp);
}

function checkEmpty() {
  if (previewCont.innerText.trim() === '') {
    previewCont.innerHTML = '<p style="color:#7A869A;text-align:center;padding:40px 0;">All items removed.</p>';
  }
}

clearPreviewBtn.addEventListener('click', () => {
  contentArea.classList.add('hidden');
  emptyState.classList.remove('hidden');
  resetUploader();
});

/* ─── PDF Export ─────────────────────────────────────────────────────────── */

downloadPdfBtn.addEventListener('click', async () => {
  setLoading(true);
  try {
    // Clone the preview and clean it up for the PDF
    const clone = previewCont.cloneNode(true);
    const deleteButtons = clone.querySelectorAll('.delete-btn');
    deleteButtons.forEach(btn => btn.remove());
    
    // Also remove the wrapper styling if necessary, but just removing the buttons 
    // is usually enough if we want to keep the structure.
    
    const finalHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; font-size: 13px; line-height: 1.6; color: #172B4D; padding: 40px; }
          a { color: #0052CC; text-decoration: none; }
          p { margin-bottom: 12px; }
          /* Preserve basic formatting */
          strong { font-weight: 700; }
        </style>
      </head>
      <body>
        ${clone.innerHTML}
      </body>
      </html>
    `;

    const filename = currentFileName.replace(/\.(html|md)$/, '') + '-release-notes';

    const res = await fetch('/api/generate-pdf', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ html: finalHtml, filename }),
    });

    if (!res.ok) throw new Error('PDF Generation failed');

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  } catch (err) {
    alert('Error: ' + err.message);
  } finally {
    setLoading(false);
  }
});

/* ─── Helpers ─────────────────────────────────────────────────────────────── */

function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

function setLoading(on) {
  downloadPdfBtn.disabled = on;
  downloadPdfBtn.querySelector('.btn-label').textContent = on ? 'Generating PDF...' : '⬇ Download PDF';
}
