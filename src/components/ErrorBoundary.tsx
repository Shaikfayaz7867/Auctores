import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
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
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
          <h1 style={{ color: '#8B0000' }}>Something went wrong</h1>
          <pre style={{ background: '#f5f5f5', padding: '1rem', marginTop: '1rem', overflow: 'auto' }}>
            {this.state.error?.message}
          </pre>
          <p style={{ marginTop: '1rem' }}>Check the browser console for more details.</p>
        </div>
      );
    }

    return this.props.children;
  }
}
