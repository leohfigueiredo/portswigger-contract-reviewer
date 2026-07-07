import React, { useState, useEffect } from 'react';
import { ArrowLeft, Play, Check, X, RefreshCw, FileText } from 'lucide-react';
import RedFlagsList from './RedFlagsList';
import AgentLogs from './AgentLogs';
import { ndaTemplate, orderFormTemplate } from '../data/templates';

export default function ReviewPanel({
  contract,
  onBack,
  onUpdateContractText,
  onApprove,
  onReject,
  onReAnalyze,
  onGenerateReport,
  isAnalyzing,
  logs
}) {
  const [activeEditorTab, setActiveEditorTab] = useState('editor');
  const [localText, setLocalText] = useState(contract.text);
  const [showLaser, setShowLaser] = useState(false);

  // Sync with prop when contract changes
  useEffect(() => {
    setLocalText(contract.text);
  }, [contract.text]);

  // Handle OCR laser scanning animation duration
  useEffect(() => {
    if (isAnalyzing) {
      setShowLaser(true);
      const timer = setTimeout(() => setShowLaser(false), 2400); // Animation runs for 2.4s
      return () => clearTimeout(timer);
    } else {
      setShowLaser(false);
    }
  }, [isAnalyzing]);

  const handleTextChange = (e) => {
    setLocalText(e.target.value);
    onUpdateContractText(contract.id, e.target.value);
  };

  const applyAmend = (flag) => {
    let updated = localText;
    if (flag.suggestedAmend.startsWith('[DELETE CLAUSE]')) {
      // Remove target clause
      updated = localText.replace(flag.clause, '');
    } else if (flag.suggestedAmend.startsWith('[REJECT CONTRACT]')) {
      alert("This contract cannot be repaired. Please reject it directly.");
      return;
    } else {
      // Replace target clause with suggestion text
      updated = localText.replace(flag.clause, flag.suggestedAmend);
    }
    
    setLocalText(updated);
    onUpdateContractText(contract.id, updated);
  };

  // Quick line-by-line diffing implementation
  const getDiff = () => {
    const templateText = contract.type === 'NDA' ? ndaTemplate : orderFormTemplate;
    const templateLines = templateText.split('\n');
    const currentLines = localText.split('\n');
    const diff = [];
    
    let tIdx = 0;
    let cIdx = 0;
    
    while (tIdx < templateLines.length || cIdx < currentLines.length) {
      const tLine = templateLines[tIdx] || '';
      const cLine = currentLines[cIdx] || '';
      
      if (tLine.trim() === cLine.trim()) {
        diff.push({ type: 'unchanged', text: cLine });
        tIdx++;
        cIdx++;
      } else {
        const nextMatchInCurrent = currentLines.slice(cIdx).findIndex(line => line.trim() === tLine.trim());
        const nextMatchInTemplate = templateLines.slice(tIdx).findIndex(line => line.trim() === cLine.trim());
        
        if (nextMatchInCurrent !== -1 && (nextMatchInTemplate === -1 || nextMatchInCurrent < nextMatchInTemplate)) {
          for (let i = 0; i < nextMatchInCurrent; i++) {
            diff.push({ type: 'added', text: currentLines[cIdx + i] });
          }
          cIdx += nextMatchInCurrent;
        } else if (nextMatchInTemplate !== -1 && (nextMatchInCurrent === -1 || nextMatchInTemplate <= nextMatchInCurrent)) {
          for (let i = 0; i < nextMatchInTemplate; i++) {
            diff.push({ type: 'removed', text: templateLines[tIdx + i] });
          }
          tIdx += nextMatchInTemplate;
        } else {
          if (tIdx < templateLines.length) {
            diff.push({ type: 'removed', text: tLine });
            tIdx++;
          }
          if (cIdx < currentLines.length) {
            diff.push({ type: 'added', text: cLine });
            cIdx++;
          }
        }
      }
    }
    return diff;
  };

  const diffResult = getDiff();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', height: '100%', overflow: 'hidden' }}>
      {/* Top Workspace Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button className="btn btn-secondary btn-sm" onClick={onBack}>
            <ArrowLeft size={14} /> Back to Queue
          </button>
          <div>
            <h2 className="page-title" style={{ fontSize: '20px' }}>{contract.name}</h2>
            <p className="page-subtitle" style={{ fontSize: '12px' }}>Review Workspace</p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn btn-secondary" onClick={onGenerateReport} style={{ borderColor: 'rgba(99, 102, 241, 0.3)' }}>
            <FileText size={14} style={{ color: 'var(--color-primary)' }} />
            Executive Report
          </button>
          <button className="btn btn-secondary" onClick={() => onReAnalyze(contract.id, localText)} disabled={isAnalyzing}>
            <RefreshCw size={14} className={isAnalyzing ? 'animate-spin' : ''} />
            Re-Analyze
          </button>
          <button className="btn btn-danger" onClick={onReject}>
            <X size={14} /> Reject Contract
          </button>
          <button className="btn btn-primary" onClick={onApprove}>
            <Check size={14} /> Approve & Sign
          </button>
        </div>
      </div>

      {/* Main Split Layout */}
      <div className="workspace-layout">
        {/* Left Side: Editor/Comparison Panel */}
        <div className="glass-panel editor-pane">
          <div className="editor-header">
            <div className="editor-tabs">
              <div
                className={`editor-tab ${activeEditorTab === 'editor' ? 'active' : ''}`}
                onClick={() => setActiveEditorTab('editor')}
              >
                Contract Editor
              </div>
              <div
                className={`editor-tab ${activeEditorTab === 'diff' ? 'active' : ''}`}
                onClick={() => setActiveEditorTab('diff')}
              >
                Template Diff
              </div>
            </div>
            <span style={{ fontSize: '11px', color: 'var(--color-text-dark)', fontWeight: '600' }}>
              TYPE: {contract.type === 'NDA' ? 'Mutual NDA Boilerplate' : 'Customer Order Form'}
            </span>
          </div>

          <div className="editor-body">
            {/* Show Scanning Laser Overlay during AI OCR analysis */}
            {showLaser && (
              <div className="scanning-container">
                <div className="laser-line"></div>
                <div className="scanner-overlay"></div>
              </div>
            )}

            {activeEditorTab === 'editor' ? (
              <textarea
                className="editor-textarea"
                value={localText}
                onChange={handleTextChange}
                disabled={isAnalyzing}
              />
            ) : (
              <div className="diff-container">
                {diffResult.map((line, index) => (
                  <div key={index} className={`diff-line ${line.type}`}>
                    {line.type === 'added' ? '+ ' : line.type === 'removed' ? '- ' : '  '}
                    {line.text}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Bottom Fixed Console Logs */}
          <AgentLogs logItems={logs} isAnalyzing={isAnalyzing} />
        </div>

        {/* Right Side: Risk & Flags Inspector */}
        <RedFlagsList
          redFlags={contract.preAnalyzed.redFlags}
          summary={contract.preAnalyzed.summary}
          priority={contract.priority}
          riskScore={contract.riskScore}
          onApplySuggestion={applyAmend}
        />
      </div>
    </div>
  );
}
