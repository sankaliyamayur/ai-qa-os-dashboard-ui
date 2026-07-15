import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div className="p-md bg-status-error/10 text-status-error border border-status-error/20 rounded-md">
          <h4 className="font-semibold mb-xs">Widget Error</h4>
          <p className="text-sm">Something went wrong in this section.</p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="mt-sm text-xs bg-status-error text-white px-sm py-xs rounded hover:opacity-90"
          >
            Retry
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
