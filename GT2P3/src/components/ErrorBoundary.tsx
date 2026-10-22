import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
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
    console.error('Uncaught error in component tree:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  private handleGoHome = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen w-full flex items-center justify-center p-6 bg-[var(--bg-primary,#f8fafc)] text-[var(--text-primary,#0f172a)]">
          <div className="w-full max-w-md p-8 rounded-3xl border border-[var(--border-card,#e2e8f0)] bg-[var(--bg-card,#ffffff)] shadow-xl text-center space-y-6">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <AlertTriangle className="w-7 h-7" strokeWidth={2} />
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl font-serif font-bold text-[var(--text-primary,#0f172a)]">
                Something went wrong
              </h1>
              <p className="text-sm text-[var(--text-secondary,#64748b)]">
                An unexpected error occurred while loading this view.
              </p>
            </div>

            {this.state.error?.message && (
              <div className="p-3.5 rounded-xl bg-[var(--bg-secondary,#f1f5f9)] border border-[var(--border-card,#e2e8f0)] text-left font-mono text-xs text-red-600 dark:text-red-400 break-words max-h-32 overflow-y-auto">
                {this.state.error.message}
              </div>
            )}

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={this.handleReset}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[var(--accent-indigo,#4f46e5)] text-white text-xs font-semibold hover:opacity-90 transition cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reload Page</span>
              </button>

              <button
                type="button"
                onClick={this.handleGoHome}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[var(--border-card,#e2e8f0)] bg-[var(--bg-secondary,#f1f5f9)] text-xs font-semibold text-[var(--text-primary,#0f172a)] hover:bg-[var(--bg-card-hover,#e2e8f0)] transition cursor-pointer"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Go to Home</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
