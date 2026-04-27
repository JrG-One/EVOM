import React from "react";
import { AlertCircle } from "lucide-react";

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center bg-gray-50">
          <AlertCircle className="w-16 h-16 mb-4 text-red-500" />
          <h1 className="mb-2 text-2xl font-bold text-gray-800">Something went wrong</h1>
          <p className="mb-6 text-gray-600">The application encountered an unexpected error.</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
