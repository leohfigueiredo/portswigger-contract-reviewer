import React, { useState } from 'react';
import { Shield, LayoutDashboard, FileText, Key, Eye, EyeOff, FileCode } from 'lucide-react';

export default function Sidebar({
  activeTab,
  setActiveTab,
  selectedModel,
  setSelectedModel,
  apiKey,
  setApiKey
}) {
  const [showKey, setShowKey] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Review Queue', icon: LayoutDashboard },
    { id: 'templates', label: 'Standard Templates', icon: FileCode },
  ];

  return (
    <aside className="sidebar">
      <div className="brand">
        <Shield className="brand-logo" size={32} />
        <span className="brand-name">Contract Copilot</span>
      </div>

      <nav style={{ flexGrow: 1 }}>
        <ul className="nav-links">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li
                key={item.id}
                className={`nav-item ${activeTab === item.id || (item.id === 'dashboard' && activeTab === 'review') ? 'active' : ''}`}
                onClick={() => setActiveTab(item.id)}
              >
                <Icon className="nav-item-icon" size={18} />
                <span>{item.label}</span>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="api-config-box">
        <div className="api-config-title" style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
          <Key size={12} />
          AI Engine Config
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <select
            className="form-select"
            style={{
              width: '100%',
              height: '34px',
              fontSize: '11px',
              padding: '0 8px',
              borderRadius: '8px',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid var(--border-light)',
              color: '#fff',
              outline: 'none',
              cursor: 'pointer'
            }}
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
          >
            <option value="gemini-2.5-flash">Google Gemini 2.5 Flash (Default)</option>
            <option value="gemini-2.5-pro">Google Gemini 2.5 Pro</option>
            <option value="claude-3.5-sonnet">Anthropic Claude 3.5 Sonnet</option>
            <option value="gpt-4o">OpenAI ChatGPT (GPT-4o)</option>
            <option value="azure-copilot">Microsoft Copilot (Azure)</option>
            <option value="github-copilot">GitHub Copilot (Simulated)</option>
            <option value="llama3">Local LLaMA 3 (Ollama)</option>
          </select>

          <div className="api-input-wrapper">
            <input
              type={showKey ? 'text' : 'password'}
              className="api-input"
              placeholder={
                selectedModel === 'llama3'
                  ? 'Ollama Host (default: 11434)'
                  : selectedModel.startsWith('gemini')
                  ? 'Gemini API Key...'
                  : selectedModel === 'gpt-4o'
                  ? 'OpenAI API Key (sk-...)'
                  : selectedModel === 'azure-copilot'
                  ? 'Azure Endpoint...'
                  : selectedModel === 'github-copilot'
                  ? 'Simulated Key (Optional)...'
                  : 'Anthropic Key (sk-ant-...)'
              }
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
            {selectedModel !== 'llama3' && selectedModel !== 'github-copilot' && (
              showKey ? (
                <EyeOff className="api-key-icon" size={14} onClick={() => setShowKey(false)} />
              ) : (
                <Eye className="api-key-icon" size={14} onClick={() => setShowKey(true)} />
              )
            )}
          </div>
          <span className={`mode-badge ${apiKey || selectedModel === 'llama3' ? 'live' : 'simulation'}`}>
            {apiKey || selectedModel === 'llama3' ? 'Live API Mode' : 'Simulation Mode'}
          </span>
        </div>
      </div>
    </aside>
  );
}
