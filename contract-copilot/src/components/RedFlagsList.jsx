import React from 'react';
import { AlertCircle, AlertTriangle, ShieldCheck, CornerDownRight, CheckCircle2 } from 'lucide-react';

export default function RedFlagsList({ redFlags, summary, priority, riskScore, onApplySuggestion }) {
  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'Critical':
        return <AlertCircle size={18} style={{ color: 'var(--color-danger)' }} />;
      case 'Warning':
        return <AlertTriangle size={18} style={{ color: 'var(--color-warning)' }} />;
      default:
        return <AlertTriangle size={18} style={{ color: '#818CF8' }} />;
    }
  };

  return (
    <div className="inspector-pane">
      {/* Summary Card */}
      <div className="glass-panel section-card">
        <h3 className="section-title">AI Analysis Summary</h3>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '8px' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span className="metric-label" style={{ fontSize: '10px' }}>Risk Priority</span>
            <span className={`badge-priority ${priority.toLowerCase()}`} style={{ marginTop: '4px' }}>
              {priority} Risk ({riskScore}/100)
            </span>
          </div>
        </div>
        <p className="flag-description" style={{ fontSize: '13px', lineHeight: '1.5' }}>
          {summary || 'Review in progress... Logs will populate shortly.'}
        </p>
      </div>

      {/* Red Flags Container */}
      <div className="red-flags-container">
        <h3 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>Identified Issues ({redFlags.length})</span>
        </h3>

        {redFlags.length === 0 ? (
          <div className="glass-panel red-flag-card Low" style={{ borderLeftColor: 'var(--color-success)', background: 'var(--color-success-bg)' }}>
            <div className="flag-header">
              <span className="flag-category-badge" style={{ color: 'var(--color-success)' }}>Verification Clean</span>
            </div>
            <div className="card-title-row">
              <ShieldCheck size={18} style={{ color: 'var(--color-success)' }} />
              <span className="flag-title">Template Aligned</span>
            </div>
            <p className="flag-description">
              No deviations or legal flags were detected. This document matches the company’s standard boilerplate with 100% compliant governing law and indemnification terms.
            </p>
          </div>
        ) : (
          redFlags.map((flag, idx) => (
            <div key={idx} className={`glass-panel red-flag-card ${flag.severity}`}>
              <div className="flag-header">
                <span className={`flag-category-badge ${flag.severity}`}>{flag.severity}</span>
                <span style={{ fontSize: '11px', color: 'var(--color-text-dark)', fontWeight: '600' }}>
                  {flag.category}
                </span>
              </div>

              <div className="card-title-row">
                {getSeverityIcon(flag.severity)}
                <span className="flag-title">{flag.title}</span>
              </div>

              <p className="flag-description">{flag.description}</p>

              {flag.clause && (
                <div className="form-group">
                  <span className="amend-label">Contract Clause:</span>
                  <div className="flag-clause-box">{flag.clause}</div>
                </div>
              )}

              {flag.suggestedAmend && (
                <div className="amend-box">
                  <span className="amend-label" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <CornerDownRight size={10} />
                    Suggested AI Redraft:
                  </span>
                  <div className="amend-text">{flag.suggestedAmend}</div>
                  
                  {/* Action button to auto-replace the clause in the text area */}
                  {flag.suggestedAmend.indexOf('[DELETE') === -1 && flag.suggestedAmend.indexOf('[REJECT') === -1 && (
                    <button
                      className="btn btn-secondary btn-sm"
                      style={{ marginTop: '4px', borderColor: 'rgba(16, 185, 129, 0.3)', color: 'var(--color-success)', alignSelf: 'flex-end', background: 'rgba(16, 185, 129, 0.04)' }}
                      onClick={() => onApplySuggestion(flag)}
                    >
                      <CheckCircle2 size={12} />
                      Apply Redraft
                    </button>
                  )}
                  {flag.suggestedAmend.indexOf('[DELETE') !== -1 && (
                    <button
                      className="btn btn-secondary btn-sm"
                      style={{ marginTop: '4px', borderColor: 'rgba(239, 68, 68, 0.3)', color: 'var(--color-danger)', alignSelf: 'flex-end', background: 'rgba(239, 68, 68, 0.04)' }}
                      onClick={() => onApplySuggestion(flag)}
                    >
                      Delete Clause
                    </button>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
