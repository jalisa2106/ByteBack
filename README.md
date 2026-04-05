# ByteBack: AI-Powered Code Review Suite

ByteBack is a high-performance, serverless web application designed to provide automated, technically rigorous code reviews. Utilizing a Senior Software Engineer persona, the system analyzes code snippets for logic flaws, efficiency gaps, and maintainability issues, delivering structured feedback through an advanced Large Language Model (LLM) integration.

---

## Live Demo
**Interact with the Prototye:** [https://byte-back.vercel.app/]

---

## Technical Specifications

* **Framework:** Next.js 16 (App Router architecture)
* **Language:** TypeScript (Strict Type Checking)
* **Styling:** Tailwind CSS v4 (Utility-first CSS engine)
* **AI Engine:** Google Gemini SDK (Gemini 2.5 Flash / 2.0 Pro)
* **Markdown Parsing:** React-Markdown with custom horizontal overflow containment

---

## Architectural Features

### Zero-Trust BYOK (Bring-Your-Own-Key)
ByteBack is engineered with a client-side security model. To eliminate the risk of centralized API key leaks, the application stores user-provided Gemini API keys exclusively in the browser's `localStorage`. All inference requests are routed directly from the client to the Google Generative AI endpoints, ensuring 100% data privacy and zero server-side logging of credentials.

### Performance Optimization
The application leverages the Next.js 16 App Router for sub-second Largest Contentful Paint (LCP). By utilizing a purely functional frontend approach, ByteBack operates with zero backend latency and minimal client-side bundle sizes.

---

## How to Obtain Your Gemini API Key

To use ByteBack, you must provide your own API key. This ensures you maintain full control over your usage quotas and security. Follow these steps:

1.  **Visit Google AI Studio:** Navigate to [aistudio.google.com](https://aistudio.google.com/).
2.  **Sign In:** Log in with your standard Google/Gmail account.
3.  **Create API Key:** Click on the "Get API Key" button in the left-hand sidebar.
4.  **Copy Key:** Select "Create API key in new project" and copy the generated alphanumeric string.
5.  **Activate ByteBack:** Paste this key into the "API Settings" panel within the ByteBack interface and click "Save Key."

---


## Project Note

This application serves as a technical demonstration of modern full-stack patterns, focusing on secure Generative AI integration, type-safe architecture, and high-performance frontend delivery.

Developed by Jalisabanu Malik
Computer Science Student at Charusat University