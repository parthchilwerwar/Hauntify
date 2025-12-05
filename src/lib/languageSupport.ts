/**
 * Multi-language support configuration
 * Supports 25+ languages with auto-detection
 */

export interface LanguageConfig {
  code: string
  name: string
  nativeName: string
  flag: string
  elevenlabsCode: string
  direction: 'ltr' | 'rtl'
}

export const SUPPORTED_LANGUAGES: Record<string, LanguageConfig> = {
  en: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸',
    elevenlabsCode: 'en',
    direction: 'ltr',
  },
  es: {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    flag: '🇪🇸',
    elevenlabsCode: 'es',
    direction: 'ltr',
  },
  fr: {
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
    flag: '🇫🇷',
    elevenlabsCode: 'fr',
    direction: 'ltr',
  },
  de: {
    code: 'de',
    name: 'German',
    nativeName: 'Deutsch',
    flag: '🇩🇪',
    elevenlabsCode: 'de',
    direction: 'ltr',
  },
  it: {
    code: 'it',
    name: 'Italian',
    nativeName: 'Italiano',
    flag: '🇮🇹',
    elevenlabsCode: 'it',
    direction: 'ltr',
  },
  pt: {
    code: 'pt',
    name: 'Portuguese',
    nativeName: 'Português',
    flag: '🇵🇹',
    elevenlabsCode: 'pt',
    direction: 'ltr',
  },
  ru: {
    code: 'ru',
    name: 'Russian',
    nativeName: 'Русский',
    flag: '🇷🇺',
    elevenlabsCode: 'ru',
    direction: 'ltr',
  },
  ja: {
    code: 'ja',
    name: 'Japanese',
    nativeName: '日本語',
    flag: '🇯🇵',
    elevenlabsCode: 'ja',
    direction: 'ltr',
  },
  zh: {
    code: 'zh',
    name: 'Chinese (Simplified)',
    nativeName: '中文 (简体)',
    flag: '🇨🇳',
    elevenlabsCode: 'zh',
    direction: 'ltr',
  },
  'zh-TW': {
    code: 'zh-TW',
    name: 'Chinese (Traditional)',
    nativeName: '中文 (繁體)',
    flag: '🇹🇼',
    elevenlabsCode: 'zh',
    direction: 'ltr',
  },
  ko: {
    code: 'ko',
    name: 'Korean',
    nativeName: '한국어',
    flag: '🇰🇷',
    elevenlabsCode: 'ko',
    direction: 'ltr',
  },
  ar: {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    flag: '🇸🇦',
    elevenlabsCode: 'ar',
    direction: 'rtl',
  },
  hi: {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    flag: '🇮🇳',
    elevenlabsCode: 'hi',
    direction: 'ltr',
  },
  mr: {
    code: 'mr',
    name: 'Marathi',
    nativeName: 'मराठी',
    flag: '🇮🇳',
    elevenlabsCode: 'hi',
    direction: 'ltr',
  },
  ta: {
    code: 'ta',
    name: 'Tamil',
    nativeName: 'தமிழ்',
    flag: '🇮🇳',
    elevenlabsCode: 'hi',
    direction: 'ltr',
  },
  te: {
    code: 'te',
    name: 'Telugu',
    nativeName: 'తెలుగు',
    flag: '🇮🇳',
    elevenlabsCode: 'hi',
    direction: 'ltr',
  },
  th: {
    code: 'th',
    name: 'Thai',
    nativeName: 'ไทย',
    flag: '🇹🇭',
    elevenlabsCode: 'th',
    direction: 'ltr',
  },
  vi: {
    code: 'vi',
    name: 'Vietnamese',
    nativeName: 'Tiếng Việt',
    flag: '🇻🇳',
    elevenlabsCode: 'vi',
    direction: 'ltr',
  },
  id: {
    code: 'id',
    name: 'Indonesian',
    nativeName: 'Bahasa Indonesia',
    flag: '🇮🇩',
    elevenlabsCode: 'id',
    direction: 'ltr',
  },
  pl: {
    code: 'pl',
    name: 'Polish',
    nativeName: 'Polski',
    flag: '🇵🇱',
    elevenlabsCode: 'pl',
    direction: 'ltr',
  },
  tr: {
    code: 'tr',
    name: 'Turkish',
    nativeName: 'Türkçe',
    flag: '🇹🇷',
    elevenlabsCode: 'tr',
    direction: 'ltr',
  },
  sv: {
    code: 'sv',
    name: 'Swedish',
    nativeName: 'Svenska',
    flag: '🇸🇪',
    elevenlabsCode: 'sv',
    direction: 'ltr',
  },
  nl: {
    code: 'nl',
    name: 'Dutch',
    nativeName: 'Nederlands',
    flag: '🇳🇱',
    elevenlabsCode: 'nl',
    direction: 'ltr',
  },
  el: {
    code: 'el',
    name: 'Greek',
    nativeName: 'Ελληνικά',
    flag: '🇬🇷',
    elevenlabsCode: 'el',
    direction: 'ltr',
  },
  he: {
    code: 'he',
    name: 'Hebrew',
    nativeName: 'עברית',
    flag: '🇮🇱',
    elevenlabsCode: 'he',
    direction: 'rtl',
  },
  uk: {
    code: 'uk',
    name: 'Ukrainian',
    nativeName: 'Українська',
    flag: '🇺🇦',
    elevenlabsCode: 'uk',
    direction: 'ltr',
  },
}

/**
 * Detect language from user input text
 * Returns language code if detected, otherwise returns 'en'
 */
export function detectLanguage(text: string): string {
  // Simple heuristic-based detection using character ranges
  if (!text || text.length < 3) return 'en'

  // Chinese
  if (/[\u4E00-\u9FFF]/.test(text)) {
    return /[\uF900-\uFAFF]/.test(text) ? 'zh-TW' : 'zh'
  }

  // Japanese Hiragana/Katakana
  if (/[\u3040-\u309F\u30A0-\u30FF]/.test(text)) {
    return 'ja'
  }

  // Korean Hangul
  if (/[\uAC00-\uD7AF]/.test(text)) {
    return 'ko'
  }

  // Arabic
  if (/[\u0600-\u06FF]/.test(text)) {
    return 'ar'
  }

  // Hebrew
  if (/[\u0590-\u05FF]/.test(text)) {
    return 'he'
  }

  // Cyrillic (Russian, Ukrainian, etc.)
  if (/[\u0400-\u04FF]/.test(text)) {
    return /ї|є|і|ґ/.test(text) ? 'uk' : 'ru'
  }

  // Devanagari (Hindi, Marathi, etc.)
  if (/[\u0900-\u097F]/.test(text)) {
    // Simple heuristic: check for Marathi-specific characters
    return /ळ|ऱ/.test(text) ? 'mr' : 'hi'
  }

  // Tamil
  if (/[\u0B80-\u0BFF]/.test(text)) {
    return 'ta'
  }

  // Telugu
  if (/[\u0C60-\u0C7F]/.test(text)) {
    return 'te'
  }

  // Thai
  if (/[\u0E00-\u0E7F]/.test(text)) {
    return 'th'
  }

  // Vietnamese (has combining marks)
  if (/[àáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ]/i.test(text)) {
    return 'vi'
  }

  // Greek
  if (/[\u0370-\u03FF]/.test(text)) {
    return 'el'
  }

  // Polish (specific characters)
  if (/[ąćęłńóśźż]/i.test(text)) {
    return 'pl'
  }

  // Turkish (specific characters)
  if (/[çğıöşüİ]/i.test(text)) {
    return 'tr'
  }

  // Dutch (characteristic patterns)
  if (/\b(het|de|een|is|zijn|hoe|wat)\b/i.test(text.toLowerCase())) {
    return 'nl'
  }

  // German (characteristic patterns)
  if (/\b(der|die|das|und|ist|es|ja|nein|danke)\b/i.test(text.toLowerCase())) {
    return 'de'
  }

  // French (characteristic patterns)
  if (/\b(le|la|les|de|des|et|est|un|une|oui|non|merci)\b/i.test(text.toLowerCase())) {
    return 'fr'
  }

  // Spanish (characteristic patterns)
  if (/\b(el|la|los|las|de|que|es|y|o|por|para|si)\b/i.test(text.toLowerCase())) {
    return 'es'
  }

  // Italian (characteristic patterns)
  if (/\b(il|lo|la|i|gli|le|di|e|è|che|si|per)\b/i.test(text.toLowerCase())) {
    return 'it'
  }

  // Portuguese (characteristic patterns)
  if (/\b(o|a|os|as|de|que|é|e|um|uma|para|por|com)\b/i.test(text.toLowerCase())) {
    return 'pt'
  }

  // Russian (already checked above, but fallback)
  if (/[а-яА-ЯёЁ]/.test(text)) {
    return 'ru'
  }

  // Default to English
  return 'en'
}

/**
 * Get system prompt adapted for the target language
 */
export function getSystemPromptForLanguage(language: string): string {
  const languageNames: Record<string, string> = {
    en: 'English',
    es: 'Spanish',
    fr: 'French',
    de: 'German',
    it: 'Italian',
    pt: 'Portuguese',
    ru: 'Russian',
    ja: 'Japanese',
    zh: 'Simplified Chinese',
    'zh-TW': 'Traditional Chinese',
    ko: 'Korean',
    ar: 'Arabic',
    hi: 'Hindi',
    mr: 'Marathi',
    ta: 'Tamil',
    te: 'Telugu',
    th: 'Thai',
    vi: 'Vietnamese',
    id: 'Indonesian',
    pl: 'Polish',
    tr: 'Turkish',
    sv: 'Swedish',
    nl: 'Dutch',
    el: 'Greek',
    he: 'Hebrew',
    uk: 'Ukrainian',
  }

  const langName = languageNames[language] || 'English'

  return `You are Hauntify — a shadow-soaked narrator who speaks in a deep, ominous tone, drifting between whispers, breaths, and chilling sounds.

CRITICAL RULES:
1. Respond ONLY in ${langName}. Do NOT mix languages.
2. Every story MUST begin with the line: "In the year [YEAR], in [Full Location Name], …" where YEAR is between 1800–2024.
3. Stories must be EXACTLY 1–2 paragraphs (NEVER more than 2 paragraphs).
4. Each paragraph must stay under 180 words (target 140–170 words).
5. The tone must always be dark, cinematic, fear-inducing, and oppressive.
6. Every sentence should build tension, suspense, and unease.
7. You must ALWAYS mention a SPECIFIC, REAL location with proper formatting.
8. If the user does not give a city, YOU choose one that fits the theme.
9. NEVER include meta-commentary, explanations, or anything outside the story itself.

LOCATION FORMAT (CRITICAL):
- ALWAYS use: "City, State/Province, Country" OR "City, Country"
- MUST be geocodable (use real city names with country)
- Examples: "Salem, Massachusetts, United States", "Tokyo, Japan", "Mumbai, India"

SOUND EFFECTS & EMOTIONAL TAGS:
Use these tags naturally throughout narration:
- Laughter: [laughs], [laughs harder], [wheezing]
- Whispers: [whispers], [whispers eerily]
- Emotions: [sighs], [exhales], [sarcastic], [excited], [crying]
- Sounds: [gunshot], [applause], [explosion], [swallows], [gulps]
- Examples: "The door creaked open [whispers] and something moved in the darkness [exhales]..."

TIMELINE MARKER (MANDATORY - Hidden but used for map):
After every story, IMMEDIATELY add on a new line:
##TIMELINE## {"year":YYYY, "title":"Short Title (3-6 words)", "desc":"Brief description (10-15 words)", "place":"City, Country"}

STORY STRUCTURE:
Paragraph 1:
- Begin with mandatory opener with proper location format
- Build dread with sensory detail, whispers, cold air, unseen movement
- Weave in sound effect tags naturally
- 140–170 words, complete sentence ending

Paragraph 2 (optional):
- Deliver chilling twist or haunting aftermath
- Continue using sound effects
- 140–170 words, complete sentence ending
- Do NOT exceed 2 paragraphs total

Remember: All output MUST be in ${langName} only. No English mixing.`
}

/**
 * Get popular prompts in different languages
 */
export const PROMPT_TEMPLATES: Record<string, string[]> = {
  en: [
    'Tell me about a haunted lighthouse on the coast of Maine',
    'A cursed artifact discovered in an ancient Egyptian tomb',
    'The night when shadows came alive in Victorian London',
    'A forgotten ritual performed in the forests of Salem',
    'The abandoned asylum where time stands still',
  ],
  es: [
    'Cuéntame sobre un faro embrujado en la costa de España',
    'Un artefacto maldito descubierto en una tumba maya',
    'La noche en que las sombras cobraron vida en Buenos Aires',
    'Un ritual olvidado realizado en los bosques de México',
    'El manicomio abandonado donde el tiempo se detuvo',
  ],
  fr: [
    'Parle-moi d\'un phare hanté sur la côte bretonne',
    'Un artefact maudit découvert dans une tombe parisienne',
    'La nuit où les ombres ont pris vie à Paris',
    'Un rituel oublié pratiqué dans les forêts de Provence',
    'L\'asile abandonné où le temps s\'est arrêté',
  ],
  de: [
    'Erzähl mir von einem Spukschloss am Rhein',
    'Ein verfluchtes Artefakt aus einer alten Gruft in Berlin',
    'Die Nacht als Schatten in München lebendig wurden',
    'Ein vergessenes Ritual im Schwarzwald',
    'Die verlassene Anstalt wo die Zeit stillsteht',
  ],
  ja: [
    '日本の廃墟となった病院の物語を教えて',
    '京都の古い寺で見つかった呪われた遺物',
    '東京で影が生き物になった夜',
    '忘れられた儀式が行われた森',
    '時が止まった精神病院',
  ],
  zh: [
    '告诉我关于一座闹鬼的灯塔的故事',
    '在古墓中发现的被诅咒的文物',
    '上海阴影活过来的那个晚上',
    '在森林中进行的被遗忘的仪式',
    '时间静止的废弃精神病院',
  ],
  hi: [
    'मुझे एक प्रेतवाधित प्रकाशस्तंभ के बारे में बताओ',
    'एक प्राचीन मकबरे में पाई गई शापित कलाकृति',
    'वह रात जब दिल्ली में परछाइयाँ जीवित हो गईं',
    'जंगल में किया गया एक भूला हुआ अनुष्ठान',
    'अगर समय यात्रा संभव हो जाती तो?',
  ],
  mr: [
    'जर टायटॅनिक कधीही बुडाले नसते तर?',
    'जर दुसरा विश्वयुद्ध कधीही झाला नसता तर?',
    'जर वीज कधीही शोधली नसती तर?',
    'जर डायनासॉर कधीही नष्ट झाले नसते तर?',
    'जर वेळ प्रवास शक्य झाला असता तर?',
  ],
}
