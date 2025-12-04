import React, { Component, ReactNode, ErrorInfo } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');

if (!rootElement) {
  console.error("Root element missing!");
}

interface ErrorBoundaryProps {
  children?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

// Hata Sınırı (Error Boundary) Bileşeni
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uygulama Hatası:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="h-screen w-screen flex flex-col items-center justify-center bg-slate-50 text-slate-800 p-6 text-center">
          <div className="w-20 h-20 bg-pink-50 rounded-full flex items-center justify-center mb-6 shadow-sm border border-pink-100">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-3xl font-black mb-3 text-slate-900">Bir Sorun Oluştu</h1>
          <p className="text-slate-500 mb-8 max-w-md font-medium leading-relaxed">
            Uygulama yüklenirken beklenmedik bir hata meydana geldi. Sayfayı yenilemeyi deneyin.
          </p>
          <div className="bg-white p-6 rounded-2xl text-xs text-left font-mono text-red-500 mb-8 w-full max-w-lg overflow-auto border border-red-100 shadow-sm max-h-48">
             {this.state.error?.message || "Bilinmeyen Hata"}
          </div>
          <button 
            onClick={() => window.location.reload()} 
            className="px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold transition-all shadow-xl hover:-translate-y-1"
          >
            Sayfayı Yenile
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

if (rootElement) {
    try {
        const root = ReactDOM.createRoot(rootElement);
        root.render(
          <React.StrictMode>
            <ErrorBoundary>
              <App />
            </ErrorBoundary>
          </React.StrictMode>
        );
    } catch (e) {
        console.error("Root Render Hatası:", e);
        rootElement.innerHTML = `<div style="padding: 20px; font-family: sans-serif; color: red;"><h3>Kritik Başlangıç Hatası</h3><pre>${e}</pre></div>`;
    }
}