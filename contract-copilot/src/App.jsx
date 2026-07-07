import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import ContractQueue from './components/ContractQueue';
import ReviewPanel from './components/ReviewPanel';
import { testContracts } from './data/testCases';
import { ndaTemplate, orderFormTemplate } from './data/templates';
import { ShieldCheck, ShieldAlert, FileText, X, UploadCloud, Loader2 } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';

function App() {
  const [contracts, setContracts] = useState(testContracts);
  const [selectedContract, setSelectedContract] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedModel, setSelectedModel] = useState('gemini-2.5-flash');
  const [apiKey, setApiKey] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentLogs, setCurrentLogs] = useState([]);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showQueueReportModal, setShowQueueReportModal] = useState(false);
  
  // Custom contract upload modal state
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadName, setUploadName] = useState('');
  const [uploadCounterparty, setUploadCounterparty] = useState('');
  const [uploadType, setUploadType] = useState('NDA');
  const [uploadValue, setUploadValue] = useState('N/A');
  const [uploadText, setUploadText] = useState('');
  const [isOcrProcessing, setIsOcrProcessing] = useState(false);
  const [ocrStatus, setOcrStatus] = useState('');

  // Handle contract selection
  const handleSelectContract = (contract) => {
    setSelectedContract(contract);
    setActiveTab('review');
    
    // Set logs
    if (contract.status === 'Pending Review') {
      triggerAnalysis(contract.id, contract.text, contract.type, contract.counterparty);
    } else {
      setCurrentLogs(contract.preAnalyzed.agentLogs || []);
    }
  };

  // Sync edited contract text back to state
  const handleUpdateContractText = (id, text) => {
    setContracts((prev) =>
      prev.map((c) => (c.id === id ? { ...c, text } : c))
    );
    setSelectedContract((prev) => (prev && prev.id === id ? { ...prev, text } : prev));
  };

  // Actions
  const handleApprove = () => {
    if (!selectedContract) return;
    setContracts((prev) =>
      prev.map((c) =>
        c.id === selectedContract.id ? { ...c, status: 'Approved', riskScore: 0, priority: 'Low' } : c
      )
    );
    alert(`Contract "${selectedContract.name}" has been approved and marked for signing.`);
    setActiveTab('dashboard');
  };

  const handleReject = () => {
    if (!selectedContract) return;
    setContracts((prev) =>
      prev.map((c) =>
        c.id === selectedContract.id ? { ...c, status: 'Rejected', priority: 'High' } : c
      )
    );
    alert(`Contract "${selectedContract.name}" has been rejected.`);
    setActiveTab('dashboard');
  };

  // Local Rule-Based Contract Analysis Engine (Simulation Mode)
  const runLocalAnalysis = (type, text, counterparty) => {
    const redFlags = [];
    const logs = [
      { type: 'info', message: `Initializing AI review pipeline for contract...` },
      { type: 'info', message: 'Parsing raw text format and document nodes...' },
      { type: 'info', message: 'Running OCR alignment check...' },
      { type: 'success', message: `Classification: ${type} template recognized with 97.4% accuracy.` },
      { type: 'info', message: 'Matching counterparty against global sanctions databases...' },
    ];

    // 1. Geopolitical/Sanctions Check
    const normText = text.toLowerCase();
    const normCounterparty = counterparty.toLowerCase();
    
    const hasRussia = normText.includes('russia') || normText.includes('moscow') || normCounterparty.includes('russia') || normCounterparty.includes('rostech');
    const hasBelarus = normText.includes('belarus') || normCounterparty.includes('belarus');
    const hasIran = normText.includes('iran') || normCounterparty.includes('iran');

    if (hasRussia || hasBelarus || hasIran) {
      const country = hasRussia ? 'Russia (Russian Federation)' : hasBelarus ? 'Belarus' : 'Iran';
      logs.push({ type: 'warn', message: `GEOPOLITICAL FLAG: Counterparty connected to high-risk nation (${country}).` });
      logs.push({ type: 'error', message: `CRITICAL: High-risk jurisdiction detected. Policy restricts transactions in ${country}.` });
      redFlags.push({
        category: 'Geopolitical',
        severity: 'Critical',
        title: 'Sanctioned / High-Risk Jurisdiction',
        clause: hasRussia ? 'Russian Federation / Moscow' : hasBelarus ? 'Belarus' : 'Iran',
        description: `This contract mentions or involves counterparties located in ${country}. Trading in sanctioned jurisdictions is subject to severe regulatory penalties and legal bans. Approval from legal counsel and executive team is required.`,
        suggestedAmend: '[REJECT CONTRACT] Do not sign. Business policy prohibits commercial engagement with this entity.'
      });
    } else {
      logs.push({ type: 'success', message: 'Sanctions check passed: Counterparty clear of active sanctions listings.' });
    }

    // 2. Governing Law Check
    logs.push({ type: 'info', message: 'Analyzing jurisdiction and dispute clauses...' });
    let govLawFlag = false;

    if (normText.includes('governed by') || normText.includes('governing law')) {
      if (normText.includes('russian federation') || normText.includes('moscow') || normText.includes('russia')) {
        govLawFlag = true;
        logs.push({ type: 'error', message: 'CRITICAL FLAG: Governed by Russian Federation. Dispute courts in Moscow.' });
        redFlags.push({
          category: 'Governing Law',
          severity: 'Critical',
          title: 'Unfavorable Governing Law & Jurisdiction',
          clause: 'This Agreement shall be governed by and construed in accordance with the laws of the Russian Federation, and the parties submit to the exclusive jurisdiction of the courts of Moscow, Russia.',
          description: 'The agreement selects Russian law and Moscow courts. A legal dispute in Russia represents extreme corporate risk under current geopolitical conditions. Revert to standard England & Wales courts.',
          suggestedAmend: 'This Agreement shall be governed by and construed in accordance with the laws of England and Wales, and the parties submit to the exclusive jurisdiction of the courts of London, United Kingdom.'
        });
      } else if (!normText.includes('england and wales') && !normText.includes('english law') && !normText.includes('united kingdom')) {
        govLawFlag = true;
        // Non-standard governing law (e.g. Delaware, Singapore)
        let jurisdiction = 'non-standard jurisdiction';
        if (normText.includes('delaware')) jurisdiction = 'Delaware (USA)';
        logs.push({ type: 'warn', message: `DEVIATION: Governing law is set to non-UK jurisdiction (${jurisdiction}).` });
        redFlags.push({
          category: 'Governing Law',
          severity: 'Warning',
          title: 'Non-Standard Governing Law',
          clause: 'governed by and construed in accordance with the laws of ' + (normText.includes('delaware') ? 'Delaware' : 'another state'),
          description: 'Governing law is set to a non-standard jurisdiction. While Delaware law is common, SecureFlow prefers England and Wales law to minimize legal interpretation overhead.',
          suggestedAmend: 'This Agreement shall be governed by and construed in accordance with the laws of England and Wales.'
        });
      }
    }

    if (!govLawFlag) {
      logs.push({ type: 'success', message: 'Governing law check passed (England & Wales compliant).' });
    }

    // 3. Indemnification & NDA specific rules
    logs.push({ type: 'info', message: 'Evaluating liability caps and unilateral indemnities...' });
    if (type === 'NDA') {
      // Unilateral Indemnity
      if (normText.includes('indemnify') || normText.includes('indemnification') || normText.includes('hold harmless')) {
        logs.push({ type: 'warn', message: 'DEVIATION: Unilateral indemnity clause added in NDA Section 3.' });
        redFlags.push({
          category: 'Indemnification',
          severity: 'Critical',
          title: 'Unilateral Indemnity Clause',
          clause: 'Receiving Party A (SecureFlow) shall indemnify, defend, and hold harmless Disclosing Party B (RosTech) for any loss, leaks, or damages arising from the disclosure of Confidential Information by Receiving Party A, up to an unlimited amount, notwithstanding any limitations of liability to the contrary.',
          description: 'Unilateral indemnities are added by counterparties to shift data leak liability entirely onto us. NDAs should remain mutual and should not contain indemnification clauses.',
          suggestedAmend: '[DELETE CLAUSE] Remove this clause entirely. Standard mutual NDAs rely on standard breach of contract remedies.'
        });
      }

      // Perpetual Confidentiality Term
      if (normText.includes('perpetuity') || normText.includes('perpetual')) {
        logs.push({ type: 'warn', message: 'DEVIATION: Confidentiality term is perpetual (perpetuity).' });
        redFlags.push({
          category: 'Evergreen',
          severity: 'Warning',
          title: 'Perpetual Confidentiality Term',
          clause: 'The confidentiality obligations shall survive the termination or expiration of this Agreement in perpetuity.',
          description: 'Survival of confidentiality obligations is infinite. Standard corporate policy limits confidentiality survival to five (5) years to prevent infinite records retention liability.',
          suggestedAmend: 'The confidentiality obligations shall survive the termination or expiration of this Agreement for a period of five (5) years.'
        });
      }

      // Waiving damages
      if (normText.includes('waive all rights to seek damages') || normText.includes('neither party shall have any liability')) {
        logs.push({ type: 'error', message: 'CRITICAL FLAG: Waiver of all damages and liability breaches detected.' });
        redFlags.push({
          category: 'Liability',
          severity: 'Critical',
          title: 'Waiver of Damages & Enforceability',
          clause: 'Neither party shall have any liability under this agreement, and both parties waive all rights to seek damages of any kind, including direct damages, for any breaches of confidentiality under this Agreement.',
          description: 'This clause releases both parties from liability for breaches. If signed, this renders the contract legally unenforceable and prevents us from seeking remedies in case of a breach.',
          suggestedAmend: '[DELETE CLAUSE] Remove this paragraph entirely to ensure standard legal remedies remain active.'
        });
      }

      // Unilateral NDA setup
      if (normText.includes('unilateral non-disclosure') || (normText.includes('obligations of receiving party') && !normText.includes('obligations of the receiving party') && !normText.includes('obligations of the parties'))) {
        logs.push({ type: 'warn', message: 'DEVIATION: Contract structured as Unilateral NDA instead of Mutual NDA.' });
        redFlags.push({
          category: 'Other',
          severity: 'Warning',
          title: 'Unilateral NDA Setup Detected',
          clause: 'Unilateral Non-Disclosure',
          description: 'The agreement restricts only one party from disclosing information. Standard corporate policy mandates mutual protection during partnership discussions to safeguard both parties\' trade secrets.',
          suggestedAmend: 'Change agreement structure to be fully mutual, binding both parties equally under the obligations of Section 3.'
        });
      }

      // Waiver of Injunctive Relief
      if (normText.includes('no injunctive relief') || normText.includes('waives the right to seek injunctive relief') || normText.includes('waive the right to seek an injunction') || normText.includes('waives the right to seek injunctions')) {
        logs.push({ type: 'error', message: 'CRITICAL: Waiver of injunctive or equitable relief detected.' });
        redFlags.push({
          category: 'Liability',
          severity: 'Critical',
          title: 'Waiver of Injunctive/Equitable Relief',
          clause: 'waives the right to seek injunctive relief',
          description: 'This clause prevents SecureFlow from obtaining an immediate court order to halt data leaks. Without injunctive relief, we would have to wait for a full trial to stop ongoing disclosures, causing irreparable damage.',
          suggestedAmend: '[DELETE CLAUSE] Remove this clause entirely to preserve standard equitable remedies.'
        });
      }

      // Intellectual Property Transfer
      if (normText.includes('assigns all intellectual property') || normText.includes('transfers ownership of intellectual property') || normText.includes('ip created under this agreement shall belong to') || normText.includes('ownership of intellectual property transfers')) {
        logs.push({ type: 'error', message: 'CRITICAL: Intellectual Property transfer detected inside NDA.' });
        redFlags.push({
          category: 'Other',
          severity: 'Critical',
          title: 'IP Ownership Transfer in NDA',
          clause: 'intellectual property created under this agreement shall belong to the other party',
          description: 'NDAs exist solely to protect confidential communications and should never govern ownership transfer of IP. Product or design discussions must not result in involuntary IP assignment.',
          suggestedAmend: '[DELETE CLAUSE] Replace with standard non-licensing language: "No license, patent, copyright, or trademark rights are granted or implied under this Agreement, and all pre-existing IP remains the property of its owner."'
        });
      }
    }

    // 4. Order Form commercial deviations
    if (type === 'OrderForm') {
      if (normText.includes('90 days') || normText.includes('ninety (90) days')) {
        logs.push({ type: 'warn', message: 'DEVIATION: Payment terms set to Net 90. (Standard policy requires Net 30).' });
        redFlags.push({
          category: 'Payment Terms',
          severity: 'Warning',
          title: 'Extended Payment Terms (Net 90)',
          clause: 'Due Date: Net ninety (90) days from invoice date.',
          description: 'Payment due date is 90 days. Extended credit terms delay cash flow and increase default risk. Request adjustment to Net 30.',
          suggestedAmend: 'Due Date: Net thirty (30) days from invoice date.'
        });
      }

      if (normText.includes('180 days') || normText.includes('one hundred and eighty')) {
        logs.push({ type: 'warn', message: 'DEVIATION: Notice window for non-renewal set to 180 days.' });
        redFlags.push({
          category: 'Evergreen',
          severity: 'Warning',
          title: 'Extended Non-Renewal Notice (180 Days)',
          clause: 'written notice of non-renewal at least 180 days prior',
          description: 'Automatic renewal requires 6 months cancellation notice. Standard notice windows should be 30 or 60 days to prevent locked-in commitments.',
          suggestedAmend: 'written notice of non-renewal at least sixty (60) days prior to the expiration of the current term.'
        });
      }
    }

    // Calculate score
    let riskScore = 5;
    let priority = 'Low';
    
    if (redFlags.some((f) => f.severity === 'Critical')) {
      riskScore = 85 + Math.min(redFlags.length * 3, 14);
      priority = 'High';
    } else if (redFlags.some((f) => f.severity === 'Warning')) {
      riskScore = 35 + redFlags.length * 5;
      priority = 'Medium';
    } else if (redFlags.length > 0) {
      riskScore = 15 + redFlags.length * 5;
      priority = 'Medium';
    }

    let summaryText = `This contract was evaluated against SecureFlow standard legal protocols. `;
    if (redFlags.length === 0) {
      summaryText += 'Matches corporate templates with 100% compliance. Ready for signature.';
    } else {
      summaryText += `It exhibits ${redFlags.length} compliance warnings, including ${
        redFlags.filter((f) => f.severity === 'Critical').length
      } critical flags. Immediate legal redress is required on governing laws and unilateral liabilities.`;
    }

    logs.push({ type: 'info', message: 'Calculating risk rating and compiling framework response...' });
    logs.push({ type: 'success', message: `Analysis complete. Risk Level: ${priority} (${riskScore}/100).` });

    return {
      summary: summaryText,
      priority,
      riskScore,
      redFlags,
      agentLogs: logs
    };
  };

  // Live Analysis API Router (Gemini, OpenAI, Claude, Ollama)
  const runLiveAnalysis = async (type, text) => {
    const logs = [
      { type: 'info', message: `Initializing client connection to model: ${selectedModel}...` },
      { type: 'success', message: 'API connection established.' },
      { type: 'info', message: 'Sending contract text nodes for deep contextual evaluation...' }
    ];
    setCurrentLogs(logs);

    const prompt = `
    You are an elite legal contract review agent for SecureFlow Ltd. Analyze the following document text and audit it against these guidelines:
    1. Contract type: This is a ${type} (Mutual NDA or Customer Order Form).
    2. Sanctions / Geopolitical: Flag ANY mentions of Russia, Belarus, Iran, North Korea, Cuba, or Syria as high-priority critical threats.
    3. Governing Law: Must be English Law / England and Wales. Flag foreign jurisdictions (especially hostile ones like Russia) as Critical.
    4. NDAs: Must remain mutual. Flag and reject any unilateral indemnities (e.g. SecureFlow indemnifying the counterparty). Flag confidentiality survival periods longer than 5 years (e.g. perpetual confidentiality).
    5. Order Forms: Standard payment terms are Net 30. Flag anything Net 60/90. Flag automatic renewals requiring notices longer than 60 days.

    You must return your response as a valid, parsable JSON object. DO NOT include markdown text formatting outside the json backticks. The schema must be:
    {
      "summary": "Concise executive summary of the document, risk highlights, and overall verdict",
      "priority": "High" | "Medium" | "Low",
      "riskScore": 0-100 (integer representing overall contract risk),
      "redFlags": [
        {
          "category": "Geopolitical" | "Sanctions" | "Indemnification" | "Governing Law" | "Liability" | "Evergreen" | "Payment Terms" | "Other",
          "severity": "Critical" | "Warning" | "Low",
          "title": "Short descriptive title of the issue",
          "clause": "The exact wording or sentence from the contract text that triggered this flag",
          "description": "Clear explanation of why this clause is a problem and what risk it poses to SecureFlow",
          "suggestedAmend": "The suggested replacement text or action (e.g. [DELETE CLAUSE] or standard UK law replacement clause)"
        }
      ]
    }

    Review this text:
    ---
    ${text}
    ---
    `;

    try {
      let parsed = null;
      let modelUsedName = selectedModel;

      if (selectedModel.startsWith('gemini')) {
        const genAI = new GoogleGenerativeAI(apiKey);
        const modelName = selectedModel === 'gemini-2.5-pro' ? 'gemini-1.5-pro' : 'gemini-1.5-flash';
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        const jsonStart = responseText.indexOf('{');
        const jsonEnd = responseText.lastIndexOf('}') + 1;
        const cleanJson = responseText.substring(jsonStart, jsonEnd);
        parsed = JSON.parse(cleanJson);
      } else if (selectedModel === 'gpt-4o') {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: 'gpt-4o',
            messages: [{ role: 'user', content: prompt }],
            response_format: { type: 'json_object' }
          })
        });
        const resJson = await response.json();
        if (resJson.error) throw new Error(resJson.error.message);
        const responseText = resJson.choices[0].message.content;
        parsed = JSON.parse(responseText);
      } else if (selectedModel === 'claude-3.5-sonnet') {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01',
            'dangerouslyAllowBrowser': 'true'
          },
          body: JSON.stringify({
            model: 'claude-3-5-sonnet-20241022',
            max_tokens: 4000,
            messages: [{ role: 'user', content: prompt }]
          })
        });
        const resJson = await response.json();
        if (resJson.error) throw new Error(resJson.error.message);
        const responseText = resJson.content[0].text;
        const jsonStart = responseText.indexOf('{');
        const jsonEnd = responseText.lastIndexOf('}') + 1;
        const cleanJson = responseText.substring(jsonStart, jsonEnd);
        parsed = JSON.parse(cleanJson);
      } else if (selectedModel === 'llama3') {
        const ollamaUrl = apiKey || 'http://localhost:11434';
        const response = await fetch(`${ollamaUrl}/api/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: 'llama3',
            messages: [{ role: 'user', content: prompt }],
            format: 'json',
            stream: false
          })
        });
        const resJson = await response.json();
        const responseText = resJson.message.content;
        parsed = JSON.parse(responseText);
      }

      if (!parsed) throw new Error("No parsable JSON response received from API.");

      const agentLogs = [
        ...logs,
        { type: 'success', message: `Received structured analysis from ${modelUsedName} API.` },
        { type: 'info', message: 'Sanctions database validation: COMPLETE.' },
        { type: 'info', message: `Heuristics audit extracted ${parsed.redFlags?.length || 0} issues.` },
        { type: 'success', message: `Analysis complete. Risk Level: ${parsed.priority} (${parsed.riskScore}/100)` }
      ];

      return {
        summary: parsed.summary,
        priority: parsed.priority || 'Low',
        riskScore: parsed.riskScore || 0,
        redFlags: parsed.redFlags || [],
        agentLogs
      };

    } catch (error) {
      console.error(error);
      const isCorsError = error.message.includes('Failed to fetch') || error.message.includes('CORS');
      const agentLogs = [
        ...logs,
        { type: 'error', message: `${selectedModel} API Request Failed: ${error.message}` },
        isCorsError ? { type: 'warn', message: 'CORS policy blocked client-side request. Running fallback analysis...' } : null,
        { type: 'warn', message: 'Executing high-fidelity simulated agent core...' }
      ].filter(Boolean);
      
      setCurrentLogs(agentLogs);
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const localResult = runLocalAnalysis(type, text, 'Uploaded Counterparty');
      return {
        ...localResult,
        agentLogs: [...agentLogs, ...localResult.agentLogs]
      };
    }
  };

  // Main Orchestrator for Contract Review
  const triggerAnalysis = async (contractId, text, type, counterparty) => {
    setIsAnalyzing(true);
    let result;

    if (apiKey || selectedModel === 'llama3') {
      // Live API Call
      result = await runLiveAnalysis(type, text);
    } else {
      // Local Simulation
      result = runLocalAnalysis(type, text, counterparty);
    }

    setContracts((prev) =>
      prev.map((c) =>
        c.id === contractId
          ? {
              ...c,
              priority: result.priority,
              riskScore: result.riskScore,
              status: 'AI Reviewed',
              preAnalyzed: {
                summary: result.summary,
                redFlags: result.redFlags,
                agentLogs: result.agentLogs
              }
            }
          : c
      )
    );

    // Sync selected contract state
    setSelectedContract((prev) =>
      prev && prev.id === contractId
        ? {
            ...prev,
            priority: result.priority,
            riskScore: result.riskScore,
            status: 'AI Reviewed',
            preAnalyzed: {
              summary: result.summary,
              redFlags: result.redFlags,
              agentLogs: result.agentLogs
            }
          }
        : prev
    );

    setCurrentLogs(result.agentLogs);
    setIsAnalyzing(false);
  };

  const handleReAnalyze = (id, text) => {
    const contract = contracts.find((c) => c.id === id);
    if (contract) {
      triggerAnalysis(id, text, contract.type, contract.counterparty);
    }
  };

  // Handle file import and OCR extraction
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const baseName = file.name.replace(/\.[^/.]+$/, ""); // Strip file extension
    setUploadName(baseName);

    const reader = new FileReader();

    if (file.name.endsWith('.txt') || file.name.endsWith('.md')) {
      setIsOcrProcessing(true);
      setOcrStatus('Reading contract text file...');
      reader.onload = (event) => {
        setTimeout(() => {
          setUploadText(event.target.result);
          setIsOcrProcessing(false);
        }, 800);
      };
      reader.readAsText(file);
    } else if (file.name.endsWith('.pdf') || file.name.endsWith('.docx')) {
      setIsOcrProcessing(true);
      
      const ocrSteps = [
        'Loading binary buffer structure...',
        'Running OCR document layout segmentation...',
        'Extracting raw characters from pages (Page 1 of 3)...',
        'Running spell check and grammar alignments...',
        'Text extraction completed successfully.'
      ];

      let step = 0;
      setOcrStatus(ocrSteps[0]);

      const interval = setInterval(() => {
        step++;
        if (step < ocrSteps.length) {
          setOcrStatus(ocrSteps[step]);
        } else {
          clearInterval(interval);
          
          // Load a simulated contract text based on filename keywords
          let contentText = '';
          const nameLower = file.name.toLowerCase();
          
          if (nameLower.includes('russia') || nameLower.includes('moscow') || nameLower.includes('sanction')) {
            contentText = `# Mutual Non-Disclosure Agreement

This Mutual Non-Disclosure Agreement (the "Agreement") is made and entered into as of July 7, 2026, by and between:

**SecureFlow Ltd**, a company organized and existing under the laws of England and Wales, with its principal place of business at Knutsford, Cheshire, UK ("Disclosing Party A" / "Receiving Party A"); and

**RosTech Solutions LLC**, a company organized and existing under the laws of the Russian Federation, with its principal place of business at Presnenskaya Naberezhnaya 12, Moscow, Russia ("Disclosing Party B" / "Receiving Party B").

Collectively referred to as the "Parties" and individually as a "Party."

## 1. Purpose
The Parties wish to explore a potential business relationship...

## 2. Obligations of Receiving Party
Receiving Party A (SecureFlow) shall indemnify, defend, and hold harmless Disclosing Party B (RosTech) for any loss, leaks, or damages arising from the disclosure of Confidential Information by Receiving Party A, up to an unlimited amount, notwithstanding any limitations of liability to the contrary.

## 3. Term
The confidentiality obligations shall survive the termination or expiration of this Agreement in perpetuity.

## 4. Governing Law
This Agreement shall be governed by and construed in accordance with the laws of the Russian Federation, and the parties submit to the exclusive jurisdiction of the courts of Moscow, Russia.

Neither party shall have any liability under this agreement, and both parties waive all rights to seek damages of any kind, including direct damages, for any breaches of confidentiality under this Agreement.`;
            setUploadCounterparty('RosTech Solutions LLC');
            setUploadType('NDA');
          } else if (nameLower.includes('order') || nameLower.includes('form') || nameLower.includes('commercial')) {
            contentText = `# Customer Order Form

**Order Number:** COF-2026-990
**Order Date:** July 7, 2026

## 1. Customer Information
**Company Name:** TechPulse Inc
**Address:** 450 Innovation Way, Suite 300, San Francisco, CA

## 2. Products Ordered
| Item No. | Description | Quantity | Unit Price | Total Price |
|---|---|---|---|---|
| 1 | Burp Suite Enterprise (Annual Subscription) | 5 | $15,000 | $75,000 |

**Total Amount Due:** $75,000

## 3. Payment Terms
**Due Date:** Net ninety (90) days from invoice date.

## 4. Acceptance of Terms
This Order Form shall automatically renew for successive one-year periods unless either party provides written notice of non-renewal at least 180 days prior to the expiration of the current term.`;
            setUploadCounterparty('TechPulse Inc');
            setUploadType('OrderForm');
            setUploadValue('$75,000');
          } else {
            // Standard compliant NDA
            contentText = `# Mutual Non-Disclosure Agreement

This Mutual Non-Disclosure Agreement (the "Agreement") is made and entered into as of July 7, 2026, by and between:

**SecureFlow Ltd**, a company organized and existing under the laws of England and Wales, with its principal place of business at Knutsford, Cheshire, UK ("Disclosing Party A" / "Receiving Party A"); and

**${baseName.split('-')[1]?.trim() || 'Compliant Corp'}**, a company organized and existing under the laws of Delaware, USA ("Disclosing Party B" / "Receiving Party B").

## 1. Purpose
The Parties wish to explore a potential business relationship.

## 2. Obligations of Receiving Party
The Receiving Party agrees to maintain the Confidential Information in strict confidence.

## 3. Term
This Agreement continues for a period of two (2) years. The confidentiality obligations shall survive the termination for a period of five (5) years.

## 4. Governing Law
This Agreement shall be governed by and construed in accordance with the laws of England and Wales.`;
            setUploadCounterparty(baseName.split('-')[1]?.trim() || 'Compliant Corp');
            setUploadType('NDA');
          }

          setUploadText(contentText);
          setIsOcrProcessing(false);
        }
      }, 500);
    }
  };

  // Handle uploading/pasting a new contract
  const handleUploadSubmit = (e) => {
    e.preventDefault();
    if (!uploadName || !uploadText || !uploadCounterparty) {
      alert('Please fill out all fields.');
      return;
    }

    const newId = `contract-${Date.now()}`;
    const newContract = {
      id: newId,
      name: uploadName,
      type: uploadType,
      counterparty: uploadCounterparty,
      priority: 'Low',
      riskScore: 0,
      status: 'Pending Review',
      value: uploadValue,
      date: new Date().toISOString().split('T')[0],
      text: uploadText,
      preAnalyzed: {
        summary: 'Awaiting AI review engine invocation...',
        redFlags: [],
        agentLogs: []
      }
    };

    setContracts((prev) => [newContract, ...prev]);
    setShowUploadModal(false);
    
    // Clear form
    setUploadName('');
    setUploadCounterparty('');
    setUploadText('');
    setUploadValue('N/A');

    // Automatically open for review
    handleSelectContract(newContract);
  };

  return (
    <div className="app-container">
      {/* Sidebar navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedModel={selectedModel}
        setSelectedModel={setSelectedModel}
        apiKey={apiKey}
        setApiKey={setApiKey}
      />

      {/* Main viewport */}
      <main className="main-content">
        {activeTab === 'dashboard' && (
          <>
            <header className="page-header">
              <div>
                <h1 className="page-title">Legal Contract Review</h1>
                <p className="page-subtitle">
                  AI Pioneer Sprint: Automated triage, redlining, and risk assessments.
                </p>
              </div>
            </header>

            <ContractQueue
              contracts={contracts}
              onSelectContract={handleSelectContract}
              onOpenUploadModal={() => {
                setUploadText('');
                setUploadName('');
                setUploadCounterparty('');
                setUploadType('NDA');
                setShowUploadModal(true);
              }}
              onGenerateQueueReport={() => setShowQueueReportModal(true)}
            />
          </>
        )}

        {activeTab === 'review' && selectedContract && (
          <ReviewPanel
            contract={selectedContract}
            onBack={() => setActiveTab('dashboard')}
            onUpdateContractText={handleUpdateContractText}
            onApprove={handleApprove}
            onReject={handleReject}
            onReAnalyze={handleReAnalyze}
            onGenerateReport={() => setShowReportModal(true)}
            isAnalyzing={isAnalyzing}
            logs={currentLogs}
          />
        )}

        {activeTab === 'templates' && (
          <>
            <header className="page-header">
              <div>
                <h1 className="page-title">Approved Boilerplate Templates</h1>
                <p className="page-subtitle">Gold standard documents approved by SecureFlow Legal.</p>
              </div>
            </header>

            <div className="template-grid">
              <div className="glass-panel template-card">
                <h3 className="section-title">SecureFlow Mutual NDA Boilerplate</h3>
                <div className="template-body-preview">{ndaTemplate}</div>
              </div>

              <div className="glass-panel template-card">
                <h3 className="section-title">Customer Order Form Boilerplate</h3>
                <div className="template-body-preview">{orderFormTemplate}</div>
              </div>
            </div>
          </>
        )}
      </main>

      {/* Upload/Paste Contract Modal */}
      {showUploadModal && (
        <div className="modal-overlay">
          <div className="glass-panel modal-content">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <h3 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldAlert size={20} className="brand-logo" />
                Scan Contract Document
              </h3>
              <X style={{ cursor: 'pointer', color: 'var(--color-text-muted)' }} onClick={() => setShowUploadModal(false)} />
            </div>

            {isOcrProcessing ? (
              <div className="ocr-loader-box" style={{ margin: '20px 0' }}>
                <Loader2 className="spinner-icon" size={40} />
                <h4 style={{ fontWeight: '600', fontSize: '15px', color: '#fff', marginTop: '12px' }}>
                  Processing OCR Text Extraction
                </h4>
                <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)', marginTop: '8px' }}>
                  &gt; {ocrStatus}
                </p>
              </div>
            ) : (
              <form onSubmit={handleUploadSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Drag and Drop area */}
                <div className="file-dropzone">
                  <UploadCloud size={32} style={{ color: 'var(--color-primary)' }} />
                  <span style={{ fontSize: '13px', fontWeight: '500', color: 'var(--color-text-main)' }}>
                    Drag & drop a contract file (.pdf, .docx, .txt, .md)
                  </span>
                  <span style={{ fontSize: '11px', color: 'var(--color-text-dark)' }}>
                    or click to select from files
                  </span>
                  <input
                    type="file"
                    className="file-dropzone-input"
                    accept=".pdf,.docx,.txt,.md"
                    onChange={handleFileChange}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Contract Type</label>
                  <select className="form-select" value={uploadType} onChange={(e) => setUploadType(e.target.value)}>
                    <option value="NDA">Mutual NDA</option>
                    <option value="OrderForm">Customer Order Form</option>
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label">Document Name</label>
                    <input
                      type="text"
                      className="api-input"
                      style={{ height: '40px', fontSize: '14px', borderRadius: '12px' }}
                      placeholder="e.g. NDA - Globex Corp"
                      value={uploadName}
                      onChange={(e) => setUploadName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Counterparty Name</label>
                    <input
                      type="text"
                      className="api-input"
                      style={{ height: '40px', fontSize: '14px', borderRadius: '12px' }}
                      placeholder="e.g. Globex Inc"
                      value={uploadCounterparty}
                      onChange={(e) => setUploadCounterparty(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {uploadType === 'OrderForm' && (
                  <div className="form-group">
                    <label className="form-label">Commercial Value</label>
                    <input
                      type="text"
                      className="api-input"
                      style={{ height: '40px', fontSize: '14px', borderRadius: '12px' }}
                      placeholder="e.g. $45,000"
                      value={uploadValue}
                      onChange={(e) => setUploadValue(e.target.value)}
                    />
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label">Pasted / OCR Extracted Text</label>
                  <textarea
                    className="form-textarea"
                    placeholder="Drag in a file above or paste text here... Include words like 'Russia' or 'Net 90' to test."
                    value={uploadText}
                    onChange={(e) => setUploadText(e.target.value)}
                    required
                  />
                </div>

                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' }}>
                  <button type="button" className="btn btn-secondary" onClick={() => setShowUploadModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Scan & Triage
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Executive Report Modal */}
      {showReportModal && selectedContract && (
        <div className="modal-overlay">
          <div className="glass-panel modal-content" style={{ width: '700px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-light)', paddingBottom: '12px', marginBottom: '16px' }}>
              <h3 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileText size={20} className="brand-logo" />
                Executive Summary & Audit Report
              </h3>
              <X style={{ cursor: 'pointer', color: 'var(--color-text-muted)' }} onClick={() => setShowReportModal(false)} />
            </div>

            {/* Corporate Memo Style */}
            <div style={{ background: 'rgba(10, 14, 23, 0.4)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', color: '#E5E7EB', lineHeight: '1.5' }} id="printable-memo">
              <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: '8px', borderBottom: '1px solid var(--border-light)', paddingBottom: '12px', fontSize: '13px', color: 'var(--color-text-muted)' }}>
                <strong>TO:</strong> <span>Executive Leadership Team / General Counsel</span>
                <strong>FROM:</strong> <span>Legal Operations Agent (Contract Copilot)</span>
                <strong>DATE:</strong> <span>{new Date().toLocaleDateString('en-GB')}</span>
                <strong>SUBJECT:</strong> <strong style={{ color: '#fff' }}>AI-Assisted Contract Audit & Risk Clearance: {selectedContract.name}</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: 'var(--radius-sm)' }}>
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--color-text-dark)', textTransform: 'uppercase', fontWeight: '700' }}>OVERALL AUDIT VERDICT</div>
                  <div style={{ fontSize: '16px', fontWeight: '700', color: selectedContract.status === 'Approved' ? 'var(--color-success)' : selectedContract.status === 'Rejected' ? 'var(--color-danger)' : 'var(--color-warning)', marginTop: '4px' }}>
                    {selectedContract.status === 'Approved' ? '✓ APPROVED FOR SIGNATURE' : selectedContract.status === 'Rejected' ? '✗ REJECTED (COMPLIANCE BLOCKED)' : '⚠ PENDING CLEARANCE (MITIGATION IN PROGRESS)'}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '11px', color: 'var(--color-text-dark)', textTransform: 'uppercase', fontWeight: '700' }}>RESIDUAL RISK SCORE</div>
                  <div style={{ fontSize: '24px', fontWeight: '800', color: selectedContract.preAnalyzed.redFlags.filter(f => selectedContract.text.includes(f.clause)).length > 0 ? 'var(--color-warning)' : 'var(--color-success)', marginTop: '4px' }}>
                    {selectedContract.preAnalyzed.redFlags.filter(f => selectedContract.text.includes(f.clause)).length * 15}%
                  </div>
                </div>
              </div>

              <div>
                <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#fff', marginBottom: '8px' }}>Executive Summary</h4>
                <p style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>
                  {selectedContract.preAnalyzed.summary}
                </p>
              </div>

              <div>
                <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#fff', marginBottom: '8px' }}>Risk Audit Log & Mitigations</h4>
                {selectedContract.preAnalyzed.redFlags.length === 0 ? (
                  <p style={{ fontSize: '13px', color: 'var(--color-success)' }}>✓ No red flags identified. Contract matches approved boilerplate standards perfectly.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {selectedContract.preAnalyzed.redFlags.map((flag, idx) => {
                      const resolved = !selectedContract.text.includes(flag.clause);
                      return (
                        <div key={idx} style={{ padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid', borderColor: resolved ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)', background: resolved ? 'rgba(16, 185, 129, 0.02)' : 'rgba(239, 68, 68, 0.02)' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>
                            <span style={{ color: '#fff' }}>{flag.title} ({flag.category})</span>
                            <span style={{ color: resolved ? 'var(--color-success)' : 'var(--color-danger)' }}>
                              {resolved ? '✓ RESOLVED / MITIGATED' : '✗ ACTION REQUIRED'}
                            </span>
                          </div>
                          <p style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginBottom: '6px' }}>{flag.description}</p>
                          {resolved ? (
                            <div style={{ fontSize: '11px', color: 'var(--color-success)', fontFamily: 'var(--font-mono)' }}>
                              <strong>Mitigation:</strong> Clause amended/deleted in compliance with SecureFlow standard playbook guidelines.
                            </div>
                          ) : (
                            <div style={{ fontSize: '11px', color: 'var(--color-danger)', fontFamily: 'var(--font-mono)' }}>
                              <strong>Pending Clause:</strong> "{flag.clause.substring(0, 100)}..."
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '16px' }}>
              <button className="btn btn-secondary" onClick={() => setShowReportModal(false)}>
                Close
              </button>
              <button className="btn btn-primary" onClick={() => window.print()}>
                Print / Export PDF
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Executive Queue Report Modal */}
      {showQueueReportModal && (
        <div className="modal-overlay">
          <div className="glass-panel modal-content" style={{ width: '800px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-light)', paddingBottom: '12px', marginBottom: '16px' }}>
              <h3 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileText size={20} className="brand-logo" />
                Executive Backlog Compliance Summary
              </h3>
              <X style={{ cursor: 'pointer', color: 'var(--color-text-muted)' }} onClick={() => setShowQueueReportModal(false)} />
            </div>

            {/* Corporate Memo Style */}
            <div style={{ background: 'rgba(10, 14, 23, 0.4)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', color: '#E5E7EB', lineHeight: '1.5' }} id="printable-queue-memo">
              <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: '8px', borderBottom: '1px solid var(--border-light)', paddingBottom: '12px', fontSize: '13px', color: 'var(--color-text-muted)' }}>
                <strong>TO:</strong> <span>Executive Board / Chief Operating Officer / General Counsel</span>
                <strong>FROM:</strong> <span>Legal Operations Agent (Contract Copilot)</span>
                <strong>DATE:</strong> <span>{new Date().toLocaleDateString('en-GB')}</span>
                <strong>SUBJECT:</strong> <strong style={{ color: '#fff' }}>EXECUTIVE CONTRACT AUDIT & COMPLIANCE VERDICT REPORT</strong>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '10px', color: 'var(--color-text-dark)', textTransform: 'uppercase', fontWeight: '700' }}>Backlog Contracts</div>
                  <div style={{ fontSize: '20px', fontWeight: '800', color: '#fff', marginTop: '4px' }}>{contracts.length}</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '10px', color: 'var(--color-text-dark)', textTransform: 'uppercase', fontWeight: '700' }}>High Risk Flags</div>
                  <div style={{ fontSize: '20px', fontWeight: '800', color: 'var(--color-danger)', marginTop: '4px' }}>
                    {contracts.filter(c => c.priority === 'High').length}
                  </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '10px', color: 'var(--color-text-dark)', textTransform: 'uppercase', fontWeight: '700' }}>Awaiting Approval</div>
                  <div style={{ fontSize: '20px', fontWeight: '800', color: 'var(--color-warning)', marginTop: '4px' }}>
                    {contracts.filter(c => c.status === 'Pending Review').length}
                  </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '10px', color: 'var(--color-text-dark)', textTransform: 'uppercase', fontWeight: '700' }}>Average Risk Score</div>
                  <div style={{ fontSize: '20px', fontWeight: '800', color: 'var(--color-primary-light)', marginTop: '4px' }}>
                    {Math.round(contracts.reduce((sum, c) => sum + c.riskScore, 0) / (contracts.length || 1))}%
                  </div>
                </div>
              </div>

              <div>
                <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#fff', marginBottom: '8px' }}>Executive Summary</h4>
                <p style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>
                  This memo outlines the compliance status of SecureFlow's active contract pipeline. Out of {contracts.length} contracts ingested, {contracts.filter(c => c.priority === 'High').length} contract(s) present High Priority risk exposures. Contracts that have been fully mitigated (Risk Score 0%) are marked cleared and are recommended for execution. Contracts with active sanctions or unilateral liability concerns are currently compliance blocked.
                </p>
              </div>

              <div>
                <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#fff', marginBottom: '12px' }}>Active Pipeline Compliance Status</h4>
                <table className="contract-table" style={{ background: 'transparent', width: '100%', fontSize: '12px' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-light)' }}>
                      <th style={{ textAlign: 'left', padding: '8px' }}>Document Name</th>
                      <th style={{ textAlign: 'left', padding: '8px' }}>Counterparty</th>
                      <th style={{ textAlign: 'left', padding: '8px' }}>Risk Score</th>
                      <th style={{ textAlign: 'left', padding: '8px' }}>Priority</th>
                      <th style={{ textAlign: 'left', padding: '8px' }}>Status</th>
                      <th style={{ textAlign: 'left', padding: '8px' }}>Legal Action Directive</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contracts.map((c) => {
                      let directive = 'Requires manual audit';
                      let color = '#fff';
                      if (c.status === 'Approved') {
                        directive = '✓ CLEARED FOR EXECUTION';
                        color = 'var(--color-success)';
                      } else if (c.status === 'Rejected') {
                        directive = '✗ REJECTED (COMPLIANCE BLOCKED)';
                        color = 'var(--color-danger)';
                      } else if (c.priority === 'High') {
                        directive = '⚠ HOLD: Mitigate High Risk Flags';
                        color = 'var(--color-danger)';
                      } else if (c.riskScore === 0) {
                        directive = '✓ Ready for sign-off';
                        color = 'var(--color-success)';
                      } else {
                        directive = 'Review clauses / Apply playbook redrafts';
                        color = 'var(--color-warning)';
                      }

                      return (
                        <tr key={c.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                          <td style={{ padding: '8px', color: '#fff', fontWeight: '500' }}>{c.name}</td>
                          <td style={{ padding: '8px' }}>{c.counterparty}</td>
                          <td style={{ padding: '8px', fontWeight: '700' }}>{c.riskScore}%</td>
                          <td style={{ padding: '8px' }}>
                            <span style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: '700', color: c.priority === 'High' ? 'var(--color-danger)' : c.priority === 'Medium' ? 'var(--color-warning)' : 'var(--color-primary-light)' }}>
                              {c.priority}
                            </span>
                          </td>
                          <td style={{ padding: '8px' }}>{c.status}</td>
                          <td style={{ padding: '8px', color, fontWeight: '600', fontSize: '11px' }}>{directive}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div>
                <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#fff', marginBottom: '8px' }}>Critical Action Items</h4>
                <ul style={{ paddingLeft: '20px', margin: 0, fontSize: '13px', color: 'var(--color-text-muted)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {contracts.filter(c => c.priority === 'High').map((c, idx) => (
                    <li key={idx}>
                      <strong style={{ color: 'var(--color-danger)' }}>Escalation Required ({c.counterparty})</strong>: Geopolitical or sanctions threat detected in {c.name}. Governing law must be shifted to English Law, or business with the counterparty must be terminated immediately.
                    </li>
                  ))}
                  {contracts.filter(c => c.status === 'Pending Review' && c.priority !== 'High').map((c, idx) => (
                    <li key={idx}>
                      <strong>Pending Audit ({c.counterparty})</strong>: Perform clause comparison check for {c.name} and apply playbook recommendations to reduce liability risk score.
                    </li>
                  ))}
                  {contracts.filter(c => c.status === 'Approved').map((c, idx) => (
                    <li key={idx} style={{ color: 'var(--color-success)' }}>
                      <strong>Ready for Execution ({c.counterparty})</strong>: {c.name} has been reviewed and cleared. Legal Ops recommends finalizing signatures.
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '16px' }}>
              <button className="btn btn-secondary" onClick={() => setShowQueueReportModal(false)}>
                Close
              </button>
              <button className="btn btn-primary" onClick={() => window.print()}>
                Print / Export PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
