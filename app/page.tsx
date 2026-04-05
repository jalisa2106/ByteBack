"use client";

import { useState, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Key, Terminal, Loader2 } from "lucide-react";

export default function CodeFlash() {
  const [apiKey, setApiKey] = useState("");
  const [isKeySaved, setIsKeySaved] = useState(false);
  const [codeSnippet, setCodeSnippet] = useState("");
  const [roast, setRoast] = useState("");
  const [isEvaluating, setIsEvaluating] = useState(false);

  // Load key from local storage on mount
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
      // Initialize Gemini SDK with the USER'S key
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

      const prompt = `
        You are an elite, slightly sarcastic senior developer. 
        Review the following code snippet. 
        Give it a quick 2-sentence "roast" on its quality, followed by one actionable "Senior Pro-Tip" to improve it.
        Format it cleanly.
        
        Code:
        ${codeSnippet}
      `;

      const result = await model.generateContent(prompt);
      setRoast(result.response.text());
    } catch (error) {
      console.error(error);
      setRoast("Error: Invalid API Key or network issue. Try clearing your key and entering it again.");
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
            Code-Flash
          </h1>
          <p className="text-gray-400">Paste your code. Get roasted by an AI Senior Dev.</p>
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
          <p className="text-xs text-gray-500 mt-2">
            Your key never leaves your browser. It is saved in localStorage and used directly for API calls.
          </p>
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
                  Analyzing Architecture...
                </>
              ) : (
                "Review Code"
              )}
            </button>

            {/* Results Display */}
            {roast && (
              <div className="bg-gray-900 p-6 rounded-lg border border-gray-800 mt-6 animate-in fade-in slide-in-from-bottom-4">
                <h3 className="text-lg font-bold text-red-400 mb-2">Senior Dev Feedback:</h3>
                <div className="whitespace-pre-wrap text-gray-300">
                  {roast}
                </div>
              </div>
            )}
          </section>
        )}
      </div>
    </main>
  );
}