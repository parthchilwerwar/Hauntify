/**
 * Paragraph detection for voice generation
 * Detects when a complete paragraph is ready (120-200 words, ideally 150-180)
 */

export interface ParagraphDetectionResult {
  isComplete: boolean
  paragraph: string
  wordCount: number
  remaining: string
}

/**
 * Detect if buffer contains a complete paragraph (under 180 words, ideally 140-170)
 */
export function detectParagraph(buffer: string): ParagraphDetectionResult {
  // Keep the exact text including timeline markers
  // Timeline markers will be filtered out when sending to voice API
  const cleanBuffer = buffer.trim()
  
  // Check for double newline (paragraph break) or timeline marker (end of paragraph)
  const hasDoubleNewline = /\n\s*\n/.test(cleanBuffer)
  const hasTimelineMarker = /##TIMELINE##/.test(cleanBuffer)
  
  // If we have a timeline marker, extract everything before it as a complete paragraph
  if (hasTimelineMarker) {
    const parts = cleanBuffer.split(/##TIMELINE##/)
    const paragraph = parts[0].trim()
    const remaining = cleanBuffer.substring(paragraph.length)
    
    // Count words (excluding timeline markers)
    const wordCount = paragraph.split(/\s+/).filter((w) => w.length > 0).length
    
    return {
      isComplete: true,
      paragraph,
      wordCount,
      remaining,
    }
  }
  
  // If we have a double newline, split there
  if (hasDoubleNewline) {
    const parts = cleanBuffer.split(/\n\s*\n/)
    const paragraph = parts[0].trim()
    const remaining = parts.slice(1).join("\n\n")
    
    const wordCount = paragraph.split(/\s+/).filter((w) => w.length > 0).length
    
    // Only consider it complete if it has enough words
    if (wordCount >= 100) {
      return {
        isComplete: true,
        paragraph,
        wordCount,
        remaining,
      }
    }
  }
  
  // Otherwise, check word count and sentence boundaries
  const sentences = cleanBuffer.split(/([.!?])\s+/)
  let currentParagraph = ""
  let wordCount = 0
  let lastPunctuation = ""

  for (let i = 0; i < sentences.length; i++) {
    const part = sentences[i]
    if (!part) continue

    // Check if this is punctuation
    if (/^[.!?]$/.test(part)) {
      lastPunctuation = part
      currentParagraph += part
      continue
    }

    const words = part.split(/\s+/).filter((w) => w.length > 0)
    const newWordCount = wordCount + words.length

    // If adding this would exceed 180 words and we have at least 100, stop
    if (newWordCount > 180 && wordCount >= 100) {
      break
    }

    currentParagraph += (wordCount > 0 && !lastPunctuation ? " " : "") + part
    wordCount = newWordCount
    lastPunctuation = ""

    // If we're between 100-180 words and at a sentence boundary, consider it complete
    if (wordCount >= 100 && wordCount <= 180 && /[.!?]$/.test(currentParagraph.trim())) {
      const remaining = cleanBuffer.substring(currentParagraph.length).trim()
      return {
        isComplete: true,
        paragraph: currentParagraph.trim(),
        wordCount,
        remaining,
      }
    }
  }

  // Not complete yet
  return {
    isComplete: false,
    paragraph: currentParagraph.trim(),
    wordCount,
    remaining: "",
  }
}

/**
 * Extract complete paragraphs from streaming text
 */
export class ParagraphExtractor {
  private buffer: string = ""
  private paragraphs: string[] = []

  /**
   * Add text to buffer and extract complete paragraphs
   */
  addText(text: string): string[] {
    this.buffer += text
    const newParagraphs: string[] = []

    while (this.buffer.length > 0) {
      const result = detectParagraph(this.buffer)

      if (result.isComplete && result.paragraph) {
        console.log(`📝 Complete paragraph detected (${result.wordCount} words)`)
        newParagraphs.push(result.paragraph)
        this.paragraphs.push(result.paragraph)
        this.buffer = result.remaining
      } else {
        // Not enough text yet
        break
      }
    }

    return newParagraphs
  }

  /**
   * Get all extracted paragraphs
   */
  getParagraphs(): string[] {
    return [...this.paragraphs]
  }

  /**
   * Get current buffer
   */
  getBuffer(): string {
    return this.buffer
  }

  /**
   * Flush remaining buffer as final paragraph
   */
  flush(): string | null {
    if (this.buffer.trim().length > 0) {
      const final = this.buffer.trim()
      this.paragraphs.push(final)
      this.buffer = ""
      return final
    }
    return null
  }

  /**
   * Reset extractor
   */
  reset(): void {
    this.buffer = ""
    this.paragraphs = []
  }
}
