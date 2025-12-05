/**
 * Error handling and recovery utilities
 */

export interface ErrorReport {
  type: string
  severity: "critical" | "major" | "minor"
  message: string
  timestamp: number
  context?: Record<string, any>
  stack?: string
}

class ErrorHandler {
  private static errors: ErrorReport[] = []
  private static maxErrors = 50 // Keep last 50 errors in memory

  /**
   * Log and track an error
   */
  static logError(
    type: string,
    message: string,
    severity: "critical" | "major" | "minor" = "minor",
    context?: Record<string, any>,
    error?: Error
  ): ErrorReport {
    const report: ErrorReport = {
      type,
      severity,
      message,
      timestamp: Date.now(),
      context,
      stack: error?.stack,
    }

    this.errors.push(report)

    // Keep array size manageable
    if (this.errors.length > this.maxErrors) {
      this.errors.shift()
    }

    // Console output based on severity
    const prefix = {
      critical: "🔴",
      major: "🟠",
      minor: "🟡",
    }[severity]

    console.error(
      `${prefix} [${type}] ${message}`,
      context ? JSON.stringify(context, null, 2) : ""
    )

    return report
  }

  /**
   * Log a warning without throwing
   */
  static logWarning(
    type: string,
    message: string,
    context?: Record<string, any>
  ): void {
    console.warn(`⚠️ [${type}] ${message}`, context || "")
  }

  /**
   * Get all errors from session
   */
  static getErrors(): ErrorReport[] {
    return [...this.errors]
  }

  /**
   * Get errors by severity
   */
  static getErrorsBySeverity(
    severity: "critical" | "major" | "minor"
  ): ErrorReport[] {
    return this.errors.filter((e) => e.severity === severity)
  }

  /**
   * Clear error history
   */
  static clearErrors(): void {
    this.errors = []
  }

  /**
   * Get error statistics
   */
  static getStats() {
    return {
      total: this.errors.length,
      critical: this.errors.filter((e) => e.severity === "critical").length,
      major: this.errors.filter((e) => e.severity === "major").length,
      minor: this.errors.filter((e) => e.severity === "minor").length,
    }
  }
}

/**
 * Safe wrapper for async operations
 */
export async function safeAsync<T>(
  fn: () => Promise<T>,
  errorType: string,
  fallback: T
): Promise<T> {
  try {
    return await fn()
  } catch (error) {
    ErrorHandler.logError(
      errorType,
      error instanceof Error ? error.message : String(error),
      "major",
      {},
      error instanceof Error ? error : undefined
    )
    return fallback
  }
}

/**
 * Safe wrapper for sync operations
 */
export function safeSync<T>(
  fn: () => T,
  errorType: string,
  fallback: T
): T {
  try {
    return fn()
  } catch (error) {
    ErrorHandler.logError(
      errorType,
      error instanceof Error ? error.message : String(error),
      "major",
      {},
      error instanceof Error ? error : undefined
    )
    return fallback
  }
}

export default ErrorHandler
