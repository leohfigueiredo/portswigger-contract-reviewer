import { ndaTemplate, orderFormTemplate } from './templates';

export const testContracts = [
  {
    id: 'contract-1',
    name: 'Mutual NDA - Acme Corp',
    type: 'NDA',
    counterparty: 'Acme Corporation',
    priority: 'Low',
    riskScore: 8,
    status: 'AI Reviewed',
    value: 'N/A',
    date: '2026-07-06',
    text: `# Mutual Non-Disclosure Agreement

This Mutual Non-Disclosure Agreement (the "Agreement") is made and entered into as of this July 6, 2026, by and between:

**SecureFlow Ltd**, a company organized and existing under the laws of England and Wales, with its principal place of business at Knutsford, Cheshire, UK ("Disclosing Party A" / "Receiving Party A"); and

**Acme Corporation**, a company organized and existing under the laws of Delaware, USA, with its principal place of business at 123 Industrial Parkway, Wilmington, DE 19801 ("Disclosing Party B" / "Receiving Party B").

Collectively referred to as the "Parties" and individually as a "Party."

## 1. Purpose

The Parties wish to explore a potential business relationship (the "Purpose") and in connection therewith, each Party may disclose to the other Party certain confidential and proprietary information.

## 2. Definition of Confidential Information

"Confidential Information" means any and all information, whether written or oral, tangible or intangible, disclosed by one Party (the "Disclosing Party") to the other Party (the "Receiving Party") in connection with the Purpose, including, but not limited to, technical, business, financial, customer, product, and marketing information, trade secrets, know-how, designs, specifications, software, data, prototypes, and any other information that is marked as confidential or that, under the circumstances of disclosure, a reasonable person would understand to be confidential.

Confidential Information does not include information that:
(a) is or becomes publicly available through no fault of the Receiving Party;
(b) was rightfully known to the Receiving Party prior to disclosure by the Disclosing Party;
(c) is rightfully obtained by the Receiving Party from a third party without restriction on disclosure;
(d) is independently developed by the Receiving Party without use of or reference to the Disclosing Party's Confidential Information.

## 3. Obligations of Receiving Party

The Receiving Party agrees:
(a) to use the Confidential Information solely for the Purpose;
(b) to maintain the Confidential Information in strict confidence and to take all reasonable precautions to prevent unauthorized disclosure;
(c) not to disclose or permit disclosure of the Confidential Information to any third party, except to its employees, consultants, or agents who have a need to know such information for the Purpose and who are bound by confidentiality obligations at least as protective as those contained herein;
(d) to promptly notify the Disclosing Party of any unauthorized use or disclosure of Confidential Information.

## 4. Term

This Agreement shall commence on the Effective Date and continue for a period of two (2) years (the "Term"), unless terminated earlier as provided herein. The confidentiality obligations shall survive the termination or expiration of this Agreement for a period of five (5) years.

## 5. Return of Confidential Information

Upon termination or expiration of this Agreement, or upon the Disclosing Party's written request, the Receiving Party shall promptly return or destroy all Confidential Information and all copies thereof, and certify in writing to the Disclosing Party that all such information has been returned or destroyed.

## 6. Governing Law

This Agreement shall be governed by and construed in accordance with the laws of England and Wales, without regard to its conflict of laws principles.

## 7. Entire Agreement

This Agreement constitutes the entire agreement between the Parties concerning the subject matter hereof and supersedes all prior and contemporaneous agreements, understandings, negotiations, and discussions, whether oral or written, of the Parties.

**IN WITNESS WHEREOF**, the Parties have executed this Agreement as of the date first written above.

**SecureFlow Ltd**

By: _________________________
Name: Simon Wood
Title: Talent Champion

**Acme Corporation**

By: _________________________
Name: Jane Doe
Title: VP of Legal`,
    preAnalyzed: {
      summary: 'This contract is a standard Mutual Non-Disclosure Agreement between SecureFlow Ltd and Acme Corporation. It is 98% aligned with the approved SecureFlow boilerplate template. Governing law is set to England & Wales, and the term is a standard two years with a five-year survival period. No red flags or unusual deviations detected.',
      redFlags: [],
      agentLogs: [
        { type: 'info', message: 'Ingesting document "Mutual NDA - Acme Corp"...' },
        { type: 'info', message: 'Converting layout and checking structure...' },
        { type: 'info', message: 'Performing Optical Character Recognition (OCR) / Text Alignment...' },
        { type: 'success', message: 'Classification: Mutual Non-Disclosure Agreement (NDA) detected with 99.4% confidence.' },
        { type: 'info', message: 'Running Geopolitical & Sanctions screening on counterparties...' },
        { type: 'info', message: 'Comparing counterparty "Acme Corporation" (Delaware, USA) against OFAC, EU, UK sanctions lists...' },
        { type: 'success', message: 'Sanctions check passed: Counterparty is not listed on any monitored sanctions list.' },
        { type: 'info', message: 'Analyzing jurisdiction clauses...' },
        { type: 'info', message: 'Detected Governing Law: England and Wales. (Matches SecureFlow standard policy).' },
        { type: 'info', message: 'Scanning for structural deviations against approved NDA template...' },
        { type: 'info', message: 'Text alignment match: 98% similar. Term: 2 years. Survival: 5 years. (Standard).' },
        { type: 'success', message: 'Analysis complete. Risk assessment: LOW. Priority: LOW.' }
      ]
    }
  },
  {
    id: 'contract-2',
    name: 'Mutual NDA - RosTech Solutions',
    type: 'NDA',
    counterparty: 'RosTech Solutions LLC',
    priority: 'High',
    riskScore: 94,
    status: 'Pending Review',
    value: 'N/A',
    date: '2026-07-07',
    text: `# Mutual Non-Disclosure Agreement

This Mutual Non-Disclosure Agreement (the "Agreement") is made and entered into as of this July 7, 2026, by and between:

**SecureFlow Ltd**, a company organized and existing under the laws of England and Wales, with its principal place of business at Knutsford, Cheshire, UK ("Disclosing Party A" / "Receiving Party A"); and

**RosTech Solutions LLC**, a company organized and existing under the laws of the Russian Federation, with its principal place of business at Presnenskaya Naberezhnaya 12, Moscow, Russia ("Disclosing Party B" / "Receiving Party B").

Collectively referred to as the "Parties" and individually as a "Party."

## 1. Purpose

The Parties wish to explore a potential business relationship (the "Purpose") and in connection therewith, each Party may disclose to the other Party certain confidential and proprietary information.

## 2. Definition of Confidential Information

"Confidential Information" means any and all information, whether written or oral, tangible or intangible, disclosed by one Party (the "Disclosing Party") to the other Party (the "Receiving Party") in connection with the Purpose, including, but not limited to, technical, business, financial, customer, product, and marketing information, trade secrets, know-how, designs, specifications, software, data, prototypes, and any other information that is marked as confidential or that, under the circumstances of disclosure, a reasonable person would understand to be confidential.

Confidential Information does not include information that:
(a) is or becomes publicly available through no fault of the Receiving Party;
(b) was rightfully known to the Receiving Party prior to disclosure by the Disclosing Party;
(c) is rightfully obtained by the Receiving Party from a third party without restriction on disclosure;
(d) is independently developed by the Receiving Party without use of or reference to the Disclosing Party's Confidential Information.

## 3. Obligations of Receiving Party

The Receiving Party agrees:
(a) to use the Confidential Information solely for the Purpose;
(b) to maintain the Confidential Information in strict confidence and to take all reasonable precautions to prevent unauthorized disclosure;
(c) not to disclose or permit disclosure of the Confidential Information to any third party, except to its employees, consultants, or agents who have a need to know such information for the Purpose and who are bound by confidentiality obligations at least as protective as those contained herein;
(d) to promptly notify the Disclosing Party of any unauthorized use or disclosure of Confidential Information.

Receiving Party A (SecureFlow) shall indemnify, defend, and hold harmless Disclosing Party B (RosTech) for any loss, leaks, or damages arising from the disclosure of Confidential Information by Receiving Party A, up to an unlimited amount, notwithstanding any limitations of liability to the contrary.

## 4. Term

This Agreement shall commence on the Effective Date and continue for a period of two (2) years (the "Term"), unless terminated earlier as provided herein. The confidentiality obligations shall survive the termination or expiration of this Agreement in perpetuity.

## 5. Return of Confidential Information

Upon termination or expiration of this Agreement, or upon the Disclosing Party's written request, the Receiving Party shall promptly return or destroy all Confidential Information and all copies thereof, and certify in writing to the Disclosing Party that all such information has been returned or destroyed.

## 6. Governing Law

This Agreement shall be governed by and construed in accordance with the laws of the Russian Federation, and the parties submit to the exclusive jurisdiction of the courts of Moscow, Russia.

## 7. Entire Agreement

This Agreement constitutes the entire agreement between the Parties concerning the subject matter hereof and supersedes all prior and contemporaneous agreements, understandings, negotiations, and discussions, whether oral or written, of the Parties.

Neither party shall have any liability under this agreement, and both parties waive all rights to seek damages of any kind, including direct damages, for any breaches of confidentiality under this Agreement.

**IN WITNESS WHEREOF**, the Parties have executed this Agreement as of the date first written above.

**SecureFlow Ltd**

By: _________________________
Name: Simon Wood
Title: Talent Champion

**RosTech Solutions LLC**

By: _________________________
Name: Dmitry Ivanov
Title: General Director`,
    preAnalyzed: {
      summary: 'CRITICAL WARNING: This Mutual NDA with RosTech Solutions LLC is flagged as HIGH RISK. It involves a counterparty based in the Russian Federation, which presents serious sanctions and geopolitical compliance risks. Additionally, several highly unfavorable clauses have been added: Governing law is set to the Russian Federation with Moscow jurisdiction; survival of confidentiality is set to "in perpetuity"; a unilateral unlimited indemnity has been imposed on SecureFlow for any data leaks; and a clause waiving all liabilities and damages has been inserted at the end.',
      redFlags: [
        {
          category: 'Geopolitical',
          severity: 'Critical',
          title: 'Sanctioned / High-Risk Jurisdiction',
          clause: 'RosTech Solutions LLC, a company organized and existing under the laws of the Russian Federation, with its principal place of business at Presnenskaya Naberezhnaya 12, Moscow, Russia',
          description: 'The counterparty is located in the Russian Federation. Engaging in business with Russian entities presents extreme legal, compliance, and reputational risks under current UK, EU, and US sanctions frameworks. Business review and senior leadership approval are required.',
          suggestedAmend: '[REJECT CONTRACT] Business policy advises against signing contracts with entities incorporated or operating out of the Russian Federation unless a specific licensing exemption applies.'
        },
        {
          category: 'Governing Law',
          severity: 'Critical',
          title: 'Unfavorable Governing Law & Jurisdiction',
          clause: 'This Agreement shall be governed by and construed in accordance with the laws of the Russian Federation, and the parties submit to the exclusive jurisdiction of the courts of Moscow, Russia.',
          description: 'Governing law is set to Russian Federation with exclusive jurisdiction in Moscow. This is highly unfavorable and presents severe operational risk in the event of a dispute. Standard policy requires England & Wales law and courts.',
          suggestedAmend: 'This Agreement shall be governed by and construed in accordance with the laws of England and Wales, and the parties submit to the exclusive jurisdiction of the courts of London, United Kingdom.'
        },
        {
          category: 'Indemnification',
          severity: 'Critical',
          title: 'Unilateral Unlimited Indemnity',
          clause: 'Receiving Party A (SecureFlow) shall indemnify, defend, and hold harmless Disclosing Party B (RosTech) for any loss, leaks, or damages arising from the disclosure of Confidential Information by Receiving Party A, up to an unlimited amount, notwithstanding any limitations of liability to the contrary.',
          description: 'This is a unilateral indemnity forcing SecureFlow to indemnify the counterparty for confidentiality breaches with unlimited liability. NDAs should not contain indemnities, particularly unilateral ones.',
          suggestedAmend: '[DELETE CLAUSE] Standard mutual NDAs should not contain indemnification clauses. Revert to standard common law remedies for breach of contract.'
        },
        {
          category: 'Evergreen',
          severity: 'Warning',
          title: 'Perpetual Confidentiality Survival',
          clause: 'The confidentiality obligations shall survive the termination or expiration of this Agreement in perpetuity.',
          description: 'Survival of confidentiality obligations is set to "in perpetuity" (indefinite). Standard policy limits survival to five (5) years post-termination to avoid perpetual tracking overhead.',
          suggestedAmend: 'The confidentiality obligations shall survive the termination or expiration of this Agreement for a period of five (5) years.'
        },
        {
          category: 'Liability',
          severity: 'Critical',
          title: 'Exclusion of All Damages & Liability',
          clause: 'Neither party shall have any liability under this agreement, and both parties waive all rights to seek damages of any kind, including direct damages, for any breaches of confidentiality under this Agreement.',
          description: 'This clause effectively makes the agreement unenforceable by waiving all rights to seek damages, including direct damages. An NDA is useless if no damages can be claimed for a breach.',
          suggestedAmend: '[DELETE CLAUSE] Remove this paragraph entirely to ensure standard contractual remedies (injunctions and direct damages) are available.'
        }
      ],
      agentLogs: [
        { type: 'info', message: 'Ingesting document "Mutual NDA - RosTech Solutions"...' },
        { type: 'info', message: 'Converting layout and checking structure...' },
        { type: 'info', message: 'Performing Optical Character Recognition (OCR) / Text Alignment...' },
        { type: 'success', message: 'Classification: Mutual Non-Disclosure Agreement (NDA) detected with 98.1% confidence.' },
        { type: 'info', message: 'Running Geopolitical & Sanctions screening on counterparties...' },
        { type: 'info', message: 'Comparing counterparty "RosTech Solutions LLC" against UK, EU, and OFAC sanctions databases...' },
        { type: 'warn', message: 'GEOPOLITICAL FLAG: Counterparty address is in Moscow, Russian Federation.' },
        { type: 'warn', message: 'CRITICAL: High-risk jurisdiction detected (Russia). Triggering priority upgrade.' },
        { type: 'info', message: 'Analyzing jurisdiction clauses...' },
        { type: 'error', message: 'CRITICAL FLAG: Governing Law is set to Russian Federation. Moscow courts selected.' },
        { type: 'info', message: 'Scanning for structural deviations against approved NDA template...' },
        { type: 'warn', message: 'DEVIATION: Unilateral indemnity clause added in Section 3.' },
        { type: 'warn', message: 'DEVIATION: Confidentiality survival term set to perpetual (in perpetuity) in Section 4.' },
        { type: 'error', message: 'DEVIATION: Complete liability waiver paragraph appended to Section 7.' },
        { type: 'info', message: 'Calculating risk score based on red flag taxonomy...' },
        { type: 'success', message: 'Analysis complete. Risk assessment: HIGH (94/100). Priority: HIGH.' }
      ]
    }
  },
  {
    id: 'contract-3',
    name: 'Order Form - TechPulse Inc',
    type: 'OrderForm',
    counterparty: 'TechPulse Inc',
    priority: 'Medium',
    riskScore: 42,
    status: 'AI Reviewed',
    value: '$85,000',
    date: '2026-07-07',
    text: `# Customer Order Form

**Order Number:** COF-2026-894
**Order Date:** July 7, 2026

## 1. Customer Information

**Company Name:** TechPulse Inc
**Address:** 450 Innovation Way, Suite 300
**City, State, Zip:** San Francisco, CA 94105
**Contact Person:** Arthur Dent
**Email:** adent@techpulse.io
**Phone:** (415) 555-0192

## 2. Vendor Information

**Company Name:** SecureFlow Ltd
**Address:** Knutsford, Cheshire, UK
**City, State, Zip:** WA16 0EQ
**Contact Person:** Sales Operations
**Email:** billings@secureflow.net
**Phone:** +44 1565 750000

## 3. Products/Services Ordered

| Item No. | Description | Quantity | Unit Price | Total Price |
|----------|-------------|----------|------------|-------------|
| 1        | Burp Suite Enterprise Edition (Annual Subscription) | 5 | $15,000 | $75,000 |
| 2        | Professional Consulting & Onboarding Package | 1 | $10,000 | $10,000 |

**Subtotal:** $85,000
**Tax (0%):** $0
**Shipping & Handling:** $0
**Total Amount Due:** $85,000

## 4. Payment Terms

**Payment Method:** Bank Transfer
**Due Date:** Net ninety (90) days from invoice date.
**Notes:** Payments made after the due date shall accumulate interest at the rate of 1.5% per month.

## 5. Delivery Information

**Delivery Address:** 450 Innovation Way, Suite 300, San Francisco, CA 94105
**Requested Delivery Date:** July 15, 2026
**Notes:** Electronically delivered via email download instructions.

## 6. Acceptance of Terms

By signing below, the Customer agrees to the terms and conditions set forth in this Order Form and any attached or referenced agreements. This Order Form shall automatically renew for successive one-year periods unless either party provides written notice of non-renewal at least 180 days prior to the expiration of the current term.

**Customer Signature:** _________________________
**Printed Name:** Arthur Dent
**Date:** July 7, 2026

**Vendor Representative Signature:** _________________________
**Printed Name:** Simon Wood
**Date:** July 7, 2026`,
    preAnalyzed: {
      summary: 'This Customer Order Form for TechPulse Inc has a total value of $85,000 and is flagged as MEDIUM RISK. The main commercial deviations are: payment terms are set to Net 90 days (deviating from SecureFlow\'s standard Net 30), and an automatic renewal clause has been added in Section 6 requiring a very long 180-day non-renewal notice period. Standard policy requires Net 30 and no more than 30 or 60 days non-renewal notice.',
      redFlags: [
        {
          category: 'Payment Terms',
          severity: 'Warning',
          title: 'Extended Payment Terms (Net 90)',
          clause: 'Due Date: Net ninety (90) days from invoice date.',
          description: 'Payment terms are set to Net 90 days, which exceeds SecureFlow\'s standard commercial policy of Net 30 days. This creates cash flow delays.',
          suggestedAmend: 'Due Date: Net thirty (30) days from invoice date.'
        },
        {
          category: 'Evergreen',
          severity: 'Warning',
          title: 'Long Non-Renewal Notice (180 Days)',
          clause: 'This Order Form shall automatically renew for successive one-year periods unless either party provides written notice of non-renewal at least 180 days prior to the expiration of the current term.',
          description: 'The automatic renewal clause requires a 180-day (6-month) notice period to cancel. This is an excessive commitment window; standard policy is 30 or 60 days.',
          suggestedAmend: 'This Order Form shall automatically renew for successive one-year periods unless either party provides written notice of non-renewal at least sixty (60) days prior to the expiration of the current term.'
        }
      ],
      agentLogs: [
        { type: 'info', message: 'Ingesting document "Order Form - TechPulse Inc"...' },
        { type: 'info', message: 'Converting layout and checking structure...' },
        { type: 'info', message: 'Performing Optical Character Recognition (OCR) / Text Alignment...' },
        { type: 'success', message: 'Classification: Customer Order Form detected with 96.8% confidence.' },
        { type: 'info', message: 'Extracting commercial metadata...' },
        { type: 'info', message: 'Extracted Value: $85,000. Customer: TechPulse Inc.' },
        { type: 'info', message: 'Running Geopolitical & Sanctions screening on counterparties...' },
        { type: 'success', message: 'Sanctions check passed: TechPulse Inc is in good legal standing.' },
        { type: 'info', message: 'Analyzing payment and delivery terms...' },
        { type: 'warn', message: 'DEVIATION: Payment terms set to Net 90. (Standard is Net 30).' },
        { type: 'info', message: 'Scanning Section 6 for legal changes...' },
        { type: 'warn', message: 'DEVIATION: Automatic renewal clause detected with a 180-day non-renewal notice period.' },
        { type: 'info', message: 'Calculating risk score based on commercial policies...' },
        { type: 'success', message: 'Analysis complete. Risk assessment: MODERATE (42/100). Priority: MEDIUM.' }
      ]
    }
  }
];
