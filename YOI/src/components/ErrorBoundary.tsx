import React, { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Silent error handling - don't spam console to prevent Figma devtools errors
    // Only log critical errors once
    if (error.message && !error.message.includes('blob:') && !error.message.includes('webpack')) {
      // Store error info silently without console spam
      sessionStorage.setItem('lastError', JSON.stringify({
        message: error.message,
        stack: error.stack?.substring(0, 200),
        timestamp: Date.now()
      }));
    }
  }

  render() {
    if (this.state.hasError) {
      // Return fallback UI or null to continue rendering
      return this.props.fallback || null;
    }

    return this.props.children;
  }
}
