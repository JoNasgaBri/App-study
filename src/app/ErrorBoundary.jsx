import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    if (import.meta.env.DEV) {
      console.error('Erro não tratado na interface:', error);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center px-6 bg-stone-50 text-stone-900">
          <div className="max-w-md w-full border border-stone-200 bg-white rounded-2xl p-6 text-center">
            <h1 className="text-xl font-semibold mb-2">Ocorreu um erro inesperado</h1>
            <p className="text-sm text-stone-500 mb-5">Atualize a página para tentar novamente.</p>
            <button onClick={() => window.location.reload()} className="px-4 py-2 rounded-lg bg-stone-900 text-white text-sm font-medium hover:bg-stone-700 transition-colors">
              Recarregar
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
