import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '40px', maxWidth: '600px', margin: '100px auto', background: '#161C2D', border: '1px solid #EF4444', borderRadius: '12px', color: '#fff', textAlign: 'center', fontFamily: 'sans-serif' }}>
          <h2 style={{ color: '#EF4444', marginBottom: '16px' }}>Application Render Error</h2>
          <p style={{ color: '#9CA3AF', marginBottom: '24px', fontSize: '14px', lineHeight: '1.5' }}>
            An uncaught React error occurred. This is usually caused by the browser serving cached, out-of-date Javascript chunks.
          </p>
          <div style={{ background: '#0B0F19', padding: '16px', borderRadius: '8px', fontFamily: 'monospace', fontSize: '12px', textAlign: 'left', overflowX: 'auto', marginBottom: '24px', border: '1px solid rgba(255,255,255,0.05)', color: '#FCA5A5' }}>
            {this.state.error?.stack || this.state.error?.toString()}
          </div>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <button
              onClick={() => {
                localStorage.clear();
                sessionStorage.clear();
                // Force reload bypassing cache
                window.location.reload(true);
              }}
              style={{ padding: '10px 20px', background: '#6366F1', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}
            >
              Clear Cache & Hard Reload
            </button>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.href = '/';
              }}
              style={{ padding: '10px 20px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', cursor: 'pointer' }}
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
