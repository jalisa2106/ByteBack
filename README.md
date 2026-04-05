# ⚡ ByteBack

> **"Because your code shouldn't just work—it should survive a Senior Dev's review."**

ByteBack is a high-performance, AI-driven code review suite built to bridge the gap between "it works on my machine" and production-ready software. It uses a zero-trust, serverless architecture to deliver brutal, sarcastic, and deeply technical feedback, forcing developers to defend their architectural choices.



---

## 🚀 Live Demo
**Interact with the Prototye:** [Insert your Vercel URL here]

---

## 🧠 The Engineering Philosophy

Most AI tools are "too polite." **ByteBack** operates on the principle that technical growth happens fastest when you're forced out of your comfort zone. It doesn't just catch syntax errors; it identifies "Stringly-typed" logic, mocks redundant operations, and roasts poor naming conventions.

### Key Architectural Pillars:
* **Security-First BYOK (Bring Your Own Key):** Implemented a zero-latency frontend security model that stores sensitive API keys exclusively in `localStorage`. This eliminates backend database vulnerabilities and ensures 100% user privacy.
* **LLM Prompt Engineering:** Engineered a sophisticated "Senior Engineer" persona using Google's **Gemini 2.5 Flash**. The system handles recursive Markdown parsing and structured output with a focus on extreme brevity and technical accuracy.
* **Modern Stack (2026):** Built with the absolute bleeding edge—**Next.js 16 (App Router)** and **Tailwind CSS v4**—ensuring sub-second Largest Contentful Paint (LCP) and a responsive "Bento-grid" interface.

---

## 🛠️ Technical Deep-Dive

* **Core Framework:** Next.js 16 (React 19, App Router)
* **Type System:** TypeScript (Strict Mode)
* **AI Engine:** Google Gemini SDK (Gemini 2.5 Flash / 2.0 Pro)
* **UI/UX:** Tailwind CSS v4, Lucide Icons, Framer Motion
* **Text Processing:** `react-markdown` with custom CSS-in-JS overflow handling for horizontal code-block containment.

---

## 📦 Rapid Setup

1. **Clone & Install:**
   ```bash
   git clone [https://github.com/yourusername/ByteBack.git](https://github.com/yourusername/ByteBack.git)
   cd ByteBack && npm install