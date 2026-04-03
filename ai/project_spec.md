# Project Specification

## Objective
Simple web application that, given a markdown file, allows the user to remove elements from it and finally generate a pdf file with the release notes that can be easily shared via email.

## Technology stack
- Frontend: React
- PDF: Puppeteer

## Workflow
1. The user uploads a document:
   - Only `.md` files are allowed.
   - The user can also upload a logo for the pdf but it should not be mandatory.
2. The application parses the document and displays it interactively, allowing the user to remove elements.
3. The final PDF must preserve:
   - The ticket link
   - The ticket description
   - Basic formatting (bold, line breaks)
   - No need to differentiate betwen Changes, Problems, etc. All tickets should be displayed in the same way.
4. The user can export the final document as a PDF.
5. The version should be retrieved from the uploaded document,  which can be found as a title in the following format: `Release notes - BPS Development - 12.5.3.9`, the version is `12.5.3.9` and the product is `BPS Development`

