/**
 * Extracts product name and version from markdown content.
 * Looks for title in format: "Release notes - [Product] - [Version]"
 */
export function extractMetadata(content) {
  let extractedProduct = '';
  let extractedVersion = '';

  // Match markdown h1 or HTML h1 tag
  const h1Match = content.match(/#\s+(.+)|<h1>(.+?)<\/h1>/i);
  if (h1Match) {
    const h1Content = h1Match[1] || h1Match[2];

    // Match "Release notes - [Product] - [Version]"
    const match = h1Content.match(
      /Release\s+notes\s+-\s+(.+?)\s+-\s+(\d+\.\d+\.\d+\.\d+)/i
    );
    if (match) {
      extractedProduct = match[1].trim();
      extractedVersion = match[2].trim();
    } else {
      // Fallback for simple version number
      const versionMatch = h1Content.match(/(\d+\.\d+\.\d+\.\d+)/);
      if (versionMatch) extractedVersion = versionMatch[1];
    }
  }

  return { extractedProduct, extractedVersion };
}
