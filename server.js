const express = require('express');
const axios = require('axios');
const puppeteer = require('puppeteer');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'dist')));


// ─── POST /api/generate-pdf ───────────────────────────────────────────────────
// Body: { html: string, filename: string }
app.post('/api/generate-pdf', async (req, res) => {
  const { html, filename } = req.body;
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      displayHeaderFooter: true,
      headerTemplate: `
        <div style="font-size: 10px; width: 100%; border-bottom: 1px solid #ccc; margin: 0 1in; padding-bottom: 5px; display: flex; justify-content: space-between; color: #666;">
          <span class="title"></span>
          <span class="date"></span>
        </div>
      `,
      footerTemplate: `
        <div style="font-size: 10px; width: 100%; text-align: center; color: #999; margin-top: 5px;">
          Page <span class="pageNumber"></span> of <span class="totalPages"></span>
        </div>
      `,
      margin: {
        top: '1in',
        right: '1in',
        bottom: '1in',
        left: '1in'
      }
    });
    await browser.close();

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${filename || 'release-notes'}.pdf"`,
      'Content-Length': pdf.length,
    });
    res.send(pdf);
  } catch (err) {
    if (browser) await browser.close();
    res.status(500).json({ ok: false, error: err.message });
  }
});

// ─── Serve frontend ───────────────────────────────────────────────────────────
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 3333;
app.listen(PORT, () => {
  console.log(`✅  Jira Release Notes server running at http://localhost:${PORT}`);
});
