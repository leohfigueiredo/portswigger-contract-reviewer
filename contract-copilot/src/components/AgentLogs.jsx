import React, { useEffect, useRef, useState } from 'react';
import { Terminal, Shield } from 'lucide-react';

export default function AgentLogs({ logItems, isAnalyzing }) {
  const [displayedLogs, setDisplayedLogs] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const consoleEndRef = useRef(null);

  useEffect(() => {
    // Reset displayed logs if input items change or isAnalyzing begins
    setDisplayedLogs([]);
    setCurrentIndex(0);
  }, [logItems]);

  useEffect(() => {
    if (logItems && currentIndex < logItems.length) {
      const currentLog = logItems[currentIndex];
      // Print logs with a realistic staggered delay to simulate agent pipeline execution
      const timer = setTimeout(() => {
        setDisplayedLogs((prev) => [...prev, currentLog]);
        setCurrentIndex((prev) => prev + 1);
      }, currentIndex === 0 ? 300 : 800); // Fast initial start, then 800ms between agent steps

      return () => clearTimeout(timer);
    }
  }, [logItems, currentIndex]);

  useEffect(() => {
    // Always auto-scroll console logs for visual polish
    consoleEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [displayedLogs]);

  return (
    <div className="agent-logs-panel">
      <div className="console-header">
        <div className="console-title">
          <Terminal size={14} className="brand-logo" />
          <span>AI Agent Execution Logs</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px' }}>
          {isAnalyzing || currentIndex < (logItems?.length || 0) ? (
            <span className="loading-dots" style={{ color: '#818CF8' }}>
              Processing Agent Pipeline<span>.</span><span>.</span><span>.</span>
            </span>
          ) : (
            <span style={{ color: 'var(--color-success)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Shield size={12} /> System Idle (Ready)
            </span>
          )}
        </div>
      </div>
      <div className="console-body">
        {displayedLogs.map((log, idx) => (
          <div key={idx} className={`console-line ${log.type}`}>
            <span className="console-prompt">&gt;</span>
            <span>{log.message}</span>
          </div>
        ))}
        {/* Placeholder if processing is active but first logs have not appeared */}
        {(isAnalyzing || currentIndex < (logItems?.length || 0)) && displayedLogs.length === 0 && (
          <div className="console-line info">
            <span className="console-prompt">&gt;</span>
            <span className="loading-dots">Spawning AI agent environment<span>.</span><span>.</span><span>.</span></span>
          </div>
        )}
        <div ref={consoleEndRef} />
      </div>
    </div>
  );
}
