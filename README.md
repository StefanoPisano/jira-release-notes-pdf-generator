# Jira Release Notes PDF Generator

## Goal
The goal of this project is to provide a simple web application that allows users to:
1. Upload a markdown (`.md`) file containing Jira release notes.
2. Interactively remove specific tickets or sections from the notes.
3. Generate a professional A4 PDF file with a custom logo, header, and footer.

## Technology Stack
- **Frontend**: React (Vite)
- **Backend**: Node.js/Express
- **PDF Generation**: Puppeteer
- **Icons**: Lucide React
- **Markdown Parsing**: Marked

## AI Experimentation
This project was developed as an experiment in **AI-assisted coding** and **context prompt engineering**. The entire codebase, including logic and styling, was built by an AI agent (Antigravity) collaborating with a human user, demonstrating the power of highly contextualized prompts and agentic workflows in software development.
This is part of a series of experiments to test the capabilities of AI in software development.

## How to Run

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Servers
This will start both the Vite dev server (frontend) and the Express server (backend).
```bash
npm run dev:all
```
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3333`

### 3. Usage
1. Open the application in your browser.
2. In the sidebar, upload your company logo and the Jira release notes `.md` file.
3. Ensure the Product Name and Version are correctly detected or enter them manually.
4. Click **Process Document**.
5. Use the trash icons to remove any tickets you don't want in the final PDF.
6. Click **Download PDF** to export.
