/**
 * Formats the release notes title for display and PDF.
 * Format: "Release Notes - [Product] - [Version]"
 */
export function formatReleaseTitle(productName, version) {
  const product = productName ? productName + ' - ' : '';
  const ver = version || 'v1.0.0.0';
  return `Release Notes - ${product}${ver}`;
}

/**
 * Formats current date as: "Generated on [day] [month] [year]"
 * Example: "Generated on 15 May 2026"
 */
export function formatGeneratedDate() {
  return new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}
