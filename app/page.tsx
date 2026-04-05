"use client";

import { useState, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Key, Terminal, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";

export default function ToxicTechLead() {
  const [apiKey, setApiKey] = useState("");
  const [isKeySaved, setIsKeySaved] = useState(false);
  const [codeSnippet, setCodeSnippet] = useState("");
  const [roast, setRoast] = useState("");
  const [isEvaluating, setIsEvaluating] = useState(false);

  useEffect(() => {
    const savedKey = localStorage.getItem("gemini_api_key");
    if (savedKey) {
      setApiKey(savedKey);
      setIsKeySaved(true);
    }
  }, []);

  const saveKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem("gemini_api_key", apiKey);
      setIsKeySaved(true);
    }
  };

  const removeKey = () => {
    localStorage.removeItem("gemini_api_key");
    setApiKey("");
    setIsKeySaved(false);
    setRoast("");
  };

  const roastCode = async () => {
    if (!codeSnippet.trim() || !apiKey) return;
    setIsEvaluating(true);
    setRoast("");

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

      const prompt = `
        ROLE:
        You are a senior software engineer (15+ years) reviewing production code.
        Tone: sharp, sarcastic, intimidating—but helpful.

        CORE RULES:
        - Roast the code, not the developer.
        - BE EXTREMELY BRIEF AND PUNCHY. Keep explanations to 1-2 short sentences. No long paragraphs.
        - MUST use Markdown formatting: Use \`### \` for main section headings.
        - Start the text on a NEW LINE after every heading.
        - Use bullet points (\`- \`) for lists.

        RESPONSE STRUCTURE (MANDATORY):

        ### First Impression
        [New line] 1 short, sarcastic sentence reacting to the code.

        ### Code Smells & Crimes
        [New line] Use bullet points. Identify the issue and give exactly 1 brief sentence on why it's bad.
        - **[Name of issue]:** [Brief explanation]
        - **[Name of issue]:** [Brief explanation]

        ### Hidden Dangers
        [New line] 1-2 sentences max explaining the real-world impact (bugs, performance, scalability, etc.).

        ### How to Fix It
        [New line] Provide the corrected code block immediately. Keep explanation to 1 short sentence.

        ### Final Verdict
        [New line] Score out of 10. Include 1 sharp, witty comparison.

        STYLE GUIDELINES:
        - Use sarcasm, but don't replace substance with jokes
        - Be specific, not generic
        - Avoid repetition
        - No emojis

        CODE TO REVIEW:
        ${codeSnippet}
      `;

      const result = await model.generateContent(prompt);
      setRoast(result.response.text());
    } catch (error) {
      console.error(error);
      setRoast(
        "Error: Invalid API Key or network issue. Try clearing your key and entering it again."
      );
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-950 text-gray-100 p-8 flex flex-col items-center">
      <div className="max-w-3xl w-full space-y-8">
        <header className="text-center space-y-2">
          <h1 className="text-4xl font-bold flex items-center justify-center gap-3">
            <Terminal className="text-green-400" size={40} />
            ToxicTechLead
          </h1>
          <p className="text-gray-400">
            Paste your code. Get roasted by an AI Senior Dev.
          </p>
        </header>

        {/* API Key Management (BYOK) */}
        <section className="bg-gray-900 p-6 rounded-lg border border-gray-800">
          <div className="flex items-center gap-2 mb-4">
            <Key className="text-blue-400" size={20} />
            <h2 className="text-xl font-semibold">API Settings (BYOK)</h2>
          </div>

          {!isKeySaved ? (
            <div className="flex gap-4">
              <input
                type="password"
                placeholder="Enter your Gemini API Key..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="flex-1 bg-gray-800 border border-gray-700 rounded-md p-2 text-white focus:outline-none focus:border-blue-500"
              />
              <button
                onClick={saveKey}
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md font-medium transition-colors"
              >
                Save Key
              </button>
            </div>
          ) : (
            <div className="flex justify-between items-center bg-gray-800 p-3 rounded-md border border-green-900/50">
              <span className="text-green-400 text-sm flex items-center gap-2">
                ✓ API Key securely stored in browser cache
              </span>
              <button
                onClick={removeKey}
                className="text-red-400 hover:text-red-300 text-sm font-medium"
              >
                Clear Key
              </button>
            </div>
          )}
        </section>

        {/* The Main App (Only visible if key is saved) */}
        {isKeySaved && (
          <section className="space-y-4">
            <textarea
              placeholder="Paste your code snippet here..."
              value={codeSnippet}
              onChange={(e) => setCodeSnippet(e.target.value)}
              className="w-full h-64 bg-gray-900 border border-gray-800 rounded-lg p-4 font-mono text-sm text-gray-300 focus:outline-none focus:border-blue-500"
            />

            <button
              onClick={roastCode}
              disabled={isEvaluating || !codeSnippet.trim()}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-700 disabled:cursor-not-allowed py-3 rounded-lg font-bold flex justify-center items-center gap-2 transition-colors"
            >
              {isEvaluating ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Reviewing Pull Request...
                </>
              ) : (
                "Review Code"
              )}
            </button>

            {/* Results Display with Markdown Parsing & Overflow Fix */}
            {roast && (
              <div className="bg-gray-900 p-6 rounded-lg border border-gray-800 mt-6 animate-in fade-in slide-in-from-bottom-4 overflow-hidden w-full">
                <div className="text-gray-300 text-sm leading-relaxed break-words">
                  <ReactMarkdown
                    components={{
                      // Custom styles for Headings to make them pop and separate sections
                      h3: ({ node, ...props }) => (
                        <h3 className="text-xl font-bold text-red-400 mt-8 mb-3 border-b border-gray-800 pb-2 first:mt-0" {...props} />
                      ),
                      p: ({ node, ...props }) => (
                        <p className="mb-4 last:mb-0 break-words" {...props} />
                      ),
                      strong: ({ node, ...props }) => (
                        <strong className="font-semibold text-white" {...props} />
                      ),
                      // Restore list styling that Tailwind resets
                      ul: ({ node, ...props }) => (
                        <ul className="list-disc list-outside ml-5 mb-6 space-y-2" {...props} />
                      ),
                      ol: ({ node, ...props }) => (
                        <ol className="list-decimal list-outside ml-5 mb-6 space-y-2" {...props} />
                      ),
                      li: ({ node, ...props }) => (
                        <li className="leading-snug" {...props} />
                      ),
                      pre: ({ node, ...props }) => (
                        <pre className="overflow-x-auto bg-gray-950 border border-gray-800 p-4 rounded-lg my-4 max-w-full" {...props} />
                      ),
                      code: ({ node, className, ...props }) => {
                        const isInline = !className?.includes('language-');
                        return (
                          <code
                            className={
                              isInline
                                ? "bg-gray-800 text-green-400 px-1.5 py-0.5 rounded font-mono text-xs break-words"
                                : "font-mono text-xs text-gray-300"
                            }
                            {...props}
                          />
                        );
                      },
                    }}
                  >
                    {roast}
                  </ReactMarkdown>
                </div>
              </div>
            )}
          </section>
        )}
      </div>
    </main>
  );
}