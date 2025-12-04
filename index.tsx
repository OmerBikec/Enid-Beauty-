import React, { Component, ReactNode, ErrorInfo } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

interface ErrorBoundaryProps {
  children?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

// Basit Hata Sınırı (Error Boundary) Bileşeni
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
    error: null
  };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uygulama Hatası:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="h-screen w-screen flex flex-col items-center justify-center bg-slate-900 text-white p-6 text-center">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-2">Bir Sorun Oluştu</h1>
          <p className="text-slate-400 mb-6 max-w-md">
            Uygulama başlatılırken kritik bir hata meydana geldi. Bu genellikle bağlantı sorunlarından kaynaklanır.
          </p>
          <div className="bg-slate-800 p-4 rounded-lg text-xs text-left font-mono text-red-300 mb-6 w-full max-w-md overflow-auto">
             {this.state.error?.message || "Bilinmeyen Hata"}
          </div>
          <button 
            onClick={() => window.location.reload()} 
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-xl font-bold transition-colors"
          >
            Sayfayı Yenile
          </button>
        </div>
      );
    }

    return (this.props as any).children;
  }
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);