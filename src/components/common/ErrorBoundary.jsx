import { Component } from "react";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";

// After a new deploy, old lazy-loaded chunks disappear and the import fails.
// A full reload fetches the new build, which fixes it.
const isChunkLoadError = (error) =>
  /Failed to fetch dynamically imported module|Importing a module script failed|Loading chunk/i.test(
    error?.message || ""
  );

/**
 * Catches render errors anywhere below it and shows a friendly fallback
 * instead of a blank white screen. Pass `resetKey` (e.g. the pathname) so
 * navigating to another page clears the error automatically.
 */
class ErrorBoundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    // Hook an error tracker (e.g. Sentry) in here when you add one.
    console.error("Uncaught UI error:", error, info.componentStack);
  }

  componentDidUpdate(prevProps) {
    if (this.state.error && prevProps.resetKey !== this.props.resetKey) {
      this.setState({ error: null });
    }
  }

  handleRetry = () => {
    if (isChunkLoadError(this.state.error)) {
      window.location.reload();
      return;
    }
    this.setState({ error: null });
  };

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;

    const chunkError = isChunkLoadError(error);

    return (
      <div className="flex min-h-[60vh] items-center justify-center px-6 py-16">
        <div className="max-w-md text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rose-50 text-rose-500">
            <AlertTriangle size={28} />
          </div>
          <h1 className="mt-6 text-2xl font-bold text-neutral-900">
            {chunkError ? "A new version is available" : "Something went wrong"}
          </h1>
          <p className="mt-3 leading-7 text-neutral-500">
            {chunkError
              ? "We've updated the store. Reload the page to get the latest version."
              : "An unexpected error occurred while showing this page. Please try again."}
          </p>

          {import.meta.env.DEV && !chunkError && (
            <pre className="mt-4 max-h-40 overflow-auto rounded-lg bg-neutral-100 p-3 text-left text-xs text-rose-700">
              {error.message}
            </pre>
          )}

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={this.handleRetry}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-neutral-900 px-6 font-semibold text-white transition-colors hover:bg-neutral-800"
            >
              <RotateCcw size={18} />
              {chunkError ? "Reload page" : "Try again"}
            </button>
            <a
              href="/"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-neutral-300 px-6 font-semibold text-neutral-800 transition-colors hover:bg-neutral-50"
            >
              <Home size={18} />
              Go to home
            </a>
          </div>
        </div>
      </div>
    );
  }
}

export default ErrorBoundary;
