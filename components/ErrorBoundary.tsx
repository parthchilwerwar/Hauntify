"use client"

import { Component, ReactNode } from "react"

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error("ErrorBoundary caught:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="flex items-center justify-center h-full bg-black text-white p-8">
            <div className="max-w-md text-center">
              <h2 className="text-2xl font-bold text-orange-500 mb-4">Something went wrong</h2>
              <p className="text-gray-300 mb-4">{this.state.error?.message || "An unexpected error occurred"}</p>
              <button
                onClick={() => window.location.reload()}
                className="bg-orange-500 text-black px-6 py-2 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
              >
                Reload Page
              </button>
            </div>
          </div>
        )
      )
    }

    return this.props.children
  }
}
