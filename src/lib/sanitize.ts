/**
 * Simple HTML sanitization to prevent XSS attacks
 * Strips all HTML tags and dangerous characters
 */

/**
 * Strip HTML tags and dangerous characters from user input
 */
export function sanitizeInput(input: string): string {
  if (!input) return ""
  
  // Remove HTML tags
  let sanitized = input.replace(/<[^>]*>/g, "")
  
  // Remove script-like patterns
  sanitized = sanitized.replace(/javascript:/gi, "")
  sanitized = sanitized.replace(/on\w+\s*=/gi, "")
  
  // Trim and normalize whitespace
  sanitized = sanitized.trim()
  
  return sanitized
}

/**
 * Escape HTML entities for safe display
 */
export function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  }
  
  return text.replace(/[&<>"']/g, (char) => map[char] || char)
}
