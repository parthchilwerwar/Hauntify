/**
 * Instrumentation for error tracking and monitoring
 * 
 * To enable Sentry:
 * 1. Install: npm install @sentry/nextjs
 * 2. Run: npx @sentry/wizard@latest -i nextjs
 * 3. Add SENTRY_DSN to .env.local
 * 4. Uncomment the code below
 */

/*
import * as Sentry from "@sentry/nextjs"

export function initSentry() {
  if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
    Sentry.init({
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
      environment: process.env.NODE_ENV,
      tracesSampleRate: 0.1,
      
      // Don't log sensitive data
      beforeSend(event) {
        // Remove API keys from error messages
        if (event.message) {
          event.message = event.message.replace(/GROQ_API_KEY=\S+/g, "GROQ_API_KEY=[REDACTED]")
        }
        return event
      },
    })
  }
}

export function captureError(error: Error, context?: Record<string, any>) {
  console.error("Error:", error, context)
  
  if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
    Sentry.captureException(error, {
      extra: context,
    })
  }
}

export function captureMessage(message: string, level: "info" | "warning" | "error" = "info") {
  console.log(`[${level}]`, message)
  
  if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
    Sentry.captureMessage(message, level)
  }
}
*/

// Placeholder exports when Sentry is disabled
export function initSentry() {
  // Sentry disabled by default
}

export function captureError(error: Error, context?: Record<string, any>) {
  console.error("Error:", error, context)
}

export function captureMessage(message: string, level: "info" | "warning" | "error" = "info") {
  console.log(`[${level}]`, message)
}
