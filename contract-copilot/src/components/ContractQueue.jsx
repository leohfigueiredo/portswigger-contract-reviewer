import React, { useState } from 'react';
import { FileText, AlertTriangle, Clock, Percent, ArrowRight, Plus, X } from 'lucide-react';

export default function ContractQueue({
  contracts,
  onSelectContract,
  onOpenUploadModal,
  onGenerateQueueReport
}) {
  const [activeFilter, setActiveFilter] = useState('all');

  // Compute metrics (always based on full list)
  const total = contracts.length;
  const highRisk = contracts.filter((c) => c.priority === 'High').length;
  const pending = contracts.filter((c) => c.status === 'Pending Review').length;
  const avgRisk = Math.round(
    contracts.reduce((sum, c) => sum + c.riskScore, 0) / (total || 1)
  );

  // Filtered list
  const filteredContracts = contracts.filter((c) => {
    if (activeFilter === 'high') return c.priority === 'High';
    if (activeFilter === 'pending') return c.status === 'Pending Review';
    if (activeFilter === 'highRiskScore') return c.riskScore > 50;
    return true; // 'all'
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', width: '100%' }}>
      {/* Metrics Row */}
      <div className="metrics-row">
        <div
          className={`glass-panel metric-card clickable-card ${activeFilter === 'all' ? 'active' : ''}`}
          onClick={() => setActiveFilter('all')}
        >
          <div className="metric-info">
            <span className="metric-label">Queue Backlog</span>
            <span className="metric-value">{total}</span>
          </div>
          <div className="metric-icon-box primary">
            <FileText size={22} />
          </div>
        </div>

        <div
          className={`glass-panel metric-card clickable-card ${activeFilter === 'high' ? 'active' : ''}`}
          onClick={() => setActiveFilter('high')}
        >
          <div className="metric-info">
            <span className="metric-label">High Priority Risks</span>
            <span className="metric-value">{highRisk}</span>
          </div>
          <div className="metric-icon-box danger">
            <AlertTriangle size={22} />
          </div>
        </div>

        <div
          className={`glass-panel metric-card clickable-card ${activeFilter === 'pending' ? 'active' : ''}`}
          onClick={() => setActiveFilter('pending')}
        >
          <div className="metric-info">
            <span className="metric-label">Awaiting Human Review</span>
            <span className="metric-value">{pending}</span>
          </div>
          <div className="metric-icon-box warning">
            <Clock size={22} />
          </div>
        </div>

        <div
          className={`glass-panel metric-card clickable-card ${activeFilter === 'highRiskScore' ? 'active' : ''}`}
          onClick={() => setActiveFilter('highRiskScore')}
        >
          <div className="metric-info">
            <span className="metric-label">High Risk Score (&gt;50)</span>
            <span className="metric-value">{avgRisk}%</span>
          </div>
          <div className="metric-icon-box success">
            <Percent size={22} />
          </div>
        </div>
      </div>

      {/* Contract List Table */}
      <div className="glass-panel section-card">
        <div className="section-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <div>
              <h2 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                Contract Review Queue
                {activeFilter !== 'all' && (
                  <span className="filter-badge" onClick={() => setActiveFilter('all')} title="Click to clear filter">
                    Showing: {activeFilter === 'high' ? 'High Priority' : activeFilter === 'pending' ? 'Pending Review' : 'High Risk (>50)'}
                    <X size={12} style={{ marginLeft: '6px' }} />
                  </span>
                )}
              </h2>
              <p className="page-subtitle">AI prioritizes agreements so you focus on high-risk clauses first.</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="btn btn-secondary" onClick={onGenerateQueueReport} style={{ borderColor: 'rgba(99, 102, 241, 0.3)' }}>
              <FileText size={16} style={{ color: 'var(--color-primary)' }} />
              Executive Queue Summary
            </button>
            <button className="btn btn-primary" onClick={onOpenUploadModal}>
              <Plus size={16} />
              Scan New Contract
            </button>
          </div>
        </div>

        <table className="contract-table">
          <thead>
            <tr>
              <th>Document Name</th>
              <th>Type</th>
              <th>Counterparty</th>
              <th>Date Ingested</th>
              <th>Priority</th>
              <th>Risk Score</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredContracts.map((contract) => (
              <tr key={contract.id}>
                <td>
                  <div className="contract-name-cell">
                    <FileText className="contract-icon" size={18} />
                    <span>{contract.name}</span>
                  </div>
                </td>
                <td>{contract.type}</td>
                <td>{contract.counterparty}</td>
                <td>{contract.date}</td>
                <td>
                  <span className={`badge-priority ${contract.priority.toLowerCase()}`}>
                    {contract.priority}
                  </span>
                </td>
                <td>
                  <div className="risk-score-wrapper">
                    <span className="risk-score-number">{contract.riskScore}</span>
                    <div className="risk-bar-container">
                      <div
                        className={`risk-bar-fill ${
                          contract.riskScore > 70
                            ? 'high'
                            : contract.riskScore > 30
                            ? 'medium'
                            : 'low'
                        }`}
                        style={{ width: `${contract.riskScore}%` }}
                      ></div>
                    </div>
                  </div>
                </td>
                <td>
                  <span
                    className={`badge-status ${
                      contract.status === 'Pending Review' ? 'pending' : 'reviewed'
                    }`}
                  >
                    {contract.status}
                  </span>
                </td>
                <td>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => onSelectContract(contract)}
                  >
                    Review
                    <ArrowRight size={12} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
