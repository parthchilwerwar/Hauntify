/**
 * Stage 2: GPT Quality Gate (via Groq API)
 * Reviews Groq-generated stories and enhances them if needed
 * Uses gpt-oss-120b model available on Groq platform
 */

const GROQ_API_BASE = "https://api.groq.com/openai/v1"
const GPT_MODEL = "openai/gpt-oss-120b" // GPT model available on Groq

const QUALITY_GATE_PROMPT = `You are a horror story quality control expert. Your job is to review horror stories and determine if they are scary enough.

REVIEW CRITERIA:
1. **Atmosphere**: Does it create a sense of dread and unease?
2. **Tension**: Does it build suspense effectively?
3. **Visceral Impact**: Does it evoke fear, discomfort, or chills?
4. **Pacing**: Is the story well-paced with a strong buildup?
5. **Imagery**: Are the descriptions vivid and unsettling?
6. **Ending**: Does it leave a haunting impression?

SCORING:
- Rate the story's scariness on a scale of 1-10
- If score is 7 or above: PASS the story as-is
- If score is below 7: ENHANCE the story

ABSOLUTE RULES - NEVER BREAK THESE:
1. Enhanced story MUST be SHORTER or SAME LENGTH as original (NEVER longer)
2. If original is 250 words, enhanced MUST be ≤ 250 words
3. If original has 2 paragraphs, enhanced MUST have ≤ 2 paragraphs
4. Maximum word count: 300 words (count every single word!)
5. Maximum paragraphs: 2 (count them!)

ENHANCEMENT STRATEGY:
STEP 1: Count words in original story
STEP 2: DELETE weak/filler words ("very", "really", "just", "that", etc.)
STEP 3: REPLACE remaining words with stronger horror words (1-to-1 replacement)
STEP 4: Add [sound effect tags] WITHOUT increasing word count
STEP 5: Remove unnecessary sentences if needed to stay under word limit
STEP 6: Final word count MUST be ≤ original word count

DO THIS (Examples):
✅ "The dark room was scary" → "The suffocating darkness [whispers] consumed all light"
✅ "He walked slowly" → "He crept through shadows"
✅ "It was very frightening" → "Terror gripped his throat" (removed "very", replaced weak words)
✅ Remove entire filler sentences if needed to stay under limit

DO NOT DO THIS:
❌ Adding new sentences
❌ Adding new paragraphs
❌ Expanding descriptions
❌ Adding backstory
❌ Making the story longer in ANY way
❌ Exceeding original word count

WORD REPLACEMENT RULES:
- "walked" → "crept"
- "dark" → "suffocating"
- "scary" → "nightmarish"
- "looked" → "stared with hollow eyes"
- "room" → "chamber"
- "died" → "was consumed"
- Remove ALL filler words: "very", "really", "just", "quite", "rather", "that"

CUTTING STRATEGY IF TOO LONG:
1. Remove filler sentences
2. Merge short sentences: "He ran. He was scared." → "He fled in terror."
3. Delete redundant descriptions
4. Keep ONLY the most impactful horror elements

IMPORTANT:
- Timeline markers (##TIMELINE##) stay exactly as is
- Opening format: "In the year [YEAR], in [Location]..." must stay
- Final enhanced story MUST be shorter or equal length to original
- Count words before responding - if > original, CUT MORE

Respond in this JSON format:
{
  "score": <1-10>,
  "passed": <true if score >= 7, false otherwise>,
  "enhancedStory": "<enhanced story - MUST be ≤ original word count>",
  "enhancements": ["list of what you did: replaced X words, removed Y filler words, etc."]
}`

export interface QualityCheckResult {
  score: number
  passed: boolean
  enhancedStory: string
  enhancements: string[]
}


export async function checkAndEnhanceStory(
  story: string,
  apiKey: string,
  signal?: AbortSignal
): Promise<QualityCheckResult> {
  console.log("🔍 Stage 2: Quality Gate - Checking story scariness...")

  // Count words in original
  const originalWordCount = story.trim().split(/\s+/).length
  console.log(`📝 Original story: ${originalWordCount} words`)

  try {
    const response = await fetch(`${GROQ_API_BASE}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: GPT_MODEL,
        messages: [
          { role: "system", content: QUALITY_GATE_PROMPT },
          {
            role: "user",
            content: `ORIGINAL WORD COUNT: ${originalWordCount} words

Your enhanced story MUST be ≤ ${originalWordCount} words (shorter or equal).

Review and enhance this horror story if needed:

${story}

Remember: Enhanced version must be SHORTER or SAME length. Remove filler words, replace weak words with strong ones. Do NOT add length.`,
          },
        ],
        temperature: 0.3, // Lower temp for consistent quality checks
        max_tokens: 800, // Limit output length
      }),
      signal,
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Groq API error: ${response.status} ${error}`)
    }

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content

    if (!content) {
      throw new Error("No content in Groq response")
    }

    // Try to extract JSON from the response (might be wrapped in markdown)
    let jsonContent = content.trim()
    
    // Remove markdown code blocks if present
    if (jsonContent.startsWith("```json")) {
      jsonContent = jsonContent.replace(/```json\s*/g, "").replace(/```\s*$/g, "")
    } else if (jsonContent.startsWith("```")) {
      jsonContent = jsonContent.replace(/```\s*/g, "").replace(/```\s*$/g, "")
    }

    let result: QualityCheckResult
    
    try {
      result = JSON.parse(jsonContent)
    } catch (parseError) {
      console.error("Failed to parse JSON response:", jsonContent)
      // Fallback: return original story if parsing fails
      return {
        score: 7,
        passed: true,
        enhancedStory: story,
        enhancements: ["JSON parse failed, using original story"],
      }
    }

    // Enforce word count limit (must be ≤ original or max 300)
    let enhancedWords = result.enhancedStory.trim().split(/\s+/)
    const enhancedWordCount = enhancedWords.length
    
    // Count paragraphs (split by double newlines or single newlines)
    const paragraphCount = result.enhancedStory.trim().split(/\n\n+/).filter(p => p.trim().length > 0).length
    
    // If enhanced is longer than original OR > 300 words, reject it
    if (enhancedWordCount > originalWordCount || enhancedWordCount > 300) {
      console.log(`⚠️ Enhanced too long! Original: ${originalWordCount} words, Enhanced: ${enhancedWordCount} words`)
      console.log(`   Using original story instead...`)
      result.enhancedStory = story
      result.enhancements = ["Enhancement made story longer - rejected, using original"]
    } else if (paragraphCount > 2) {
      console.log(`⚠️ Too many paragraphs (${paragraphCount}), using original...`)
      result.enhancedStory = story
      result.enhancements = ["Too many paragraphs - rejected, using original"]
    } else {
      console.log(`📏 Original: ${originalWordCount} words → Enhanced: ${enhancedWordCount} words (${enhancedWordCount <= originalWordCount ? '✓ SHORTER' : '✗ LONGER'})`)
      console.log(`   Paragraphs: ${paragraphCount} ✓`)
    }

    console.log(`📊 Quality Score: ${result.score}/10 - ${result.passed ? "✅ PASSED" : "❌ ENHANCING"}`)
    if (result.enhancements.length > 0) {
      console.log(`🔧 ${result.enhancements.join(", ")}`)
    }

    return result
  } catch (error: any) {
    console.error("❌ Quality gate error:", error.message)
    // Fallback: return original story if quality check fails
    return {
      score: 7,
      passed: true,
      enhancedStory: story,
      enhancements: ["Quality check failed, using original story"],
    }
  }
}


export async function* enhanceStoryStream(
  story: string,
  apiKey: string,
  signal?: AbortSignal
): AsyncGenerator<string> {
  const result = await checkAndEnhanceStory(story, apiKey, signal)

  const words = result.enhancedStory.split(" ")

  for (let i = 0; i < words.length; i++) {
    const token = i === words.length - 1 ? words[i] : words[i] + " "
    yield JSON.stringify({ type: "token", data: token }) + "\n"

    // Small delay to make streaming feel natural
    await new Promise((resolve) => setTimeout(resolve, 50))
  }

  // Emit quality metadata (optional, for debugging)
  yield JSON.stringify({
    type: "quality_report",
    data: {
      score: result.score,
      passed: result.passed,
      enhancements: result.enhancements,
    },
  }) + "\n"
}
