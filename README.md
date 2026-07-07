# Contract Review System (Contract Copilot)

This repository details how Artificial Intelligence can transform a corporate legal contract review pipeline, taking it from a manual, overwhelming queue to an automated, high-visibility, and secure system.

A fully functional, interactive web application has been built alongside strategic frameworks to demonstrate the practical application of this system.

---

## 🔗 GitHub Repository
You can view the code, commit history, and latest updates online at:
👉 **[https://github.com/leohfigueiredo/portswigger-contract-reviewer](https://github.com/leohfigueiredo/portswigger-contract-reviewer)**

---

## 📂 What's Inside This Submission

This package contains two primary components:

1.  **`contract-copilot/` (The Interactive Web Tool)**:
    An interactive React + Vite application that demonstrates exactly how an AI agent reviews, prioritizes, and redlines contract documents. It includes:
    *   **Interactive Triage Queue**: Sorts and ranks incoming documents by priority (High/Medium/Low) based on contract value and compliance risks.
    *   **Geopolitical & Sanctions Audits**: Flags transactions linked to sanctioned regions (specifically highlighting **Russia, Belarus, and Iran**) and alerts the legal team instantly.
    *   **Step-by-Step Agentic Console**: Typewriter terminal output visualizing the AI Agent's pipeline steps, building team trust.
    *   **Line-by-Line Template Diffing**: Dynamic visual diff comparing uploaded text with standard corporate NDAs and Order Forms.
    *   **One-Click suggested amends**: Renders rewritten clauses that can be merged directly into the document editor with one click.
    *   **Simulation & Live Modes**: Runs locally out-of-the-box using built-in compliance heuristic tests (simulation), or links directly to Google Gemini models via an API key field (live).
2.  **`documents/` (Strategic Design & Templates)**:
    *   `Contract Priority Framework and Red Flag Taxonomy for AI-Assisted Review.md`: The logical rules used by the AI to grade and scan contracts.
    *   `AI Action Plan for Streamlining Legal Contract Review.md`: A phased rollout plan structured into two-week sprints.
    *   `Mutual Non-Disclosure Agreement.md`: Approved gold-standard NDA boilerplate.
    *   `Customer Order Form.md`: Approved customer order form boilerplate.

---

## 🚀 How to Run the Web App

To launch the Contract Copilot web app on your local machine:

1.  Open your terminal and navigate to the application folder:
    ```bash
    cd contract-copilot
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Launch the local Vite server:
    ```bash
    npm run dev
    ```
4.  Open the provided URL (usually `http://localhost:5173`) in your web browser.

---

## 💡 Key Features of the Approach

*   **Frictionless Adoption**: Providing a fully functioning offline Simulation Mode so you can evaluate the system instantly without needing API keys.
*   **Real AI Capability**: Integrating the client-side Google Gemini SDK so the application can be immediately tested with live LLM queries.
*   **Multi-Model Engine Configuration**: Configurable dropdown to route queries to Google Gemini, OpenAI ChatGPT, Anthropic Claude, Microsoft Copilot, or local Llama 3 models.
