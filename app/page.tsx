"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  Key,
  Terminal,
  Loader2,
  Copy,
  Check,
  ShieldCheck,
  Sparkles,
  GitPullRequest,
  Trash2,
  GitBranch,
  Cpu,
  FileCode2,
  Eye,
  EyeOff,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster, toast } from "sonner";
import Editor from "react-simple-code-editor";
import Prism from "prismjs";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-python";
import "prismjs/components/prism-rust";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-tsx";
import "prismjs/themes/prism-twilight.css"; // A dark theme that fits our aesthetic

const SAMPLE_CODE = `function getUsers(cb) {
  let data;
  fetch("/api/users").then(res => {
    data = res.json();
  });
  cb(data);
}

var x = getUsers(function(d) {
  console.log(d)
});`;

const BOOT_LINES = [
  "booting senior-dev-engine v2.5...",
  "loading 15 years of accumulated trauma...",
  "ready.",
];

// const LANGUAGES = [
//   { value: "javascript", label: "JavaScript" },
//   { value: "typescript", label: "TypeScript" },
//   { value: "python", label: "Python" },
//   { value: "rust", label: "Rust" },
//   { value: "c++", label: "C++" },
//   { value: "c", label: "C" },
// ];

export default function ByteBack() {
  const [apiKey, setApiKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [isKeySaved, setIsKeySaved] = useState(false);
  const [codeSnippet, setCodeSnippet] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [roast, setRoast] = useState("");
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [bootIndex, setBootIndex] = useState(0);
  const [booted, setBooted] = useState(false);

  const gutterRef = useRef<HTMLDivElement>(null);

  // boot sequence
  useEffect(() => {
    if (bootIndex < BOOT_LINES.length) {
      const t = setTimeout(() => setBootIndex((i) => i + 1), 500);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => setBooted(true), 300);
      return () => clearTimeout(t);
    }
  }, [bootIndex]);

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
      toast.success("API Key securely saved to local storage.");
    }
  };

  const removeKey = () => {
    localStorage.removeItem("gemini_api_key");
    setApiKey("");
    setIsKeySaved(false);
    setRoast("");
    toast.info("API Key removed from local storage.");
  };

  const lineCount = useMemo(
    () => Math.max(codeSnippet.split("\n").length, 1),
    [codeSnippet]
  );

  const score = useMemo(() => {
    const m = roast.match(/(\d{1,2})\s*\/\s*10/);
    return m ? parseInt(m[1], 10) : null;
  }, [roast]);

  // Editor scroll syncing
  const handleEditorScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (gutterRef.current) {
       gutterRef.current.scrollTop = e.currentTarget.scrollTop;
    }
  };

  const copyRoast = async () => {
    try {
      await navigator.clipboard.writeText(roast);
      setCopied(true);
      toast.success("Review copied to clipboard!");
      setTimeout(() => setCopied(false), 1800);
    } catch {
      toast.error("Failed to copy to clipboard.");
    }
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
        Tone: sharp, sarcastic, intimidating—but helpful. If the code is actually good, be grudgingly impressed.

        CORE RULES:
        - Roast the code, not the developer.
        - BE EXTREMELY BRIEF AND PUNCHY. Keep explanations to 1-2 short sentences. No long paragraphs.
        - MUST use Markdown formatting: Use \`### \` for main section headings.
        - Start the text on a NEW LINE after every heading.
        - Use bullet points (\`- \`) for lists.

        EVALUATION LOGIC:
        Evaluate the code on a scale of 1 to 10. 
        
        IF THE CODE IS BAD OR MEDIOCRE (Score 1-7), use this structure:
        ### First Impression
        [1 short, sarcastic sentence]
        ### Code Smells & Crimes
        [Bullet points of issues. 1 brief sentence per issue]
        ### Hidden Dangers
        [1-2 sentences on real-world impact]
        ### How to Fix It
        [Provide the corrected code block and 1 short explanation sentence]
        ### Final Verdict
        [Score out of 10. Include 1 sharp, witty comparison]

        IF THE CODE IS GOOD OR PERFECT (Score 8-10), use this structure ONLY:
        ### First Impression
        [1 short sentence showing reluctant respect, e.g., "I came here to roast, but this isn't terrible."]
        ### Final Verdict
        [Score out of 10. 1 compliment wrapped in dry sarcasm.]

        CODE TO REVIEW:
        ${codeSnippet}
      `;

      const result = await model.generateContent(prompt);
      setRoast(result.response.text());
    } catch (err) {
      console.error(err);
      toast.error("ERR_AUTH_OR_NETWORK: Invalid API key or connection refused.");
    } finally {
      setIsEvaluating(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
  };

  return (
    <main className="min-h-screen flex flex-col items-center px-4 sm:px-6 py-10 sm:py-14 relative selection:bg-[var(--accent)] selection:text-[#05070a]">
      <Toaster position="bottom-right" theme="dark" className="font-sans" />
      
      <div className="max-w-6xl w-full space-y-8 z-10">
        
        {/* ---------------- HEADER ---------------- */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-center space-y-4"
        >
           <div className="inline-flex items-center gap-2 text-xs text-[var(--muted)] border border-[var(--border)] rounded-full px-3 py-1 bg-[var(--panel)]/60 backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent)] opacity-60" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--accent)]" />
            </span>
            BYOK · Gemini 2.5 Flash · zero server logging
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold flex items-center justify-center gap-3 tracking-tight font-sans">
            <Terminal
              className="text-[var(--accent)] spin-slow"
              size={38}
              style={{ animationDuration: "12s" }}
            />
            <span className="bg-gradient-to-r from-[var(--accent)] via-emerald-300 to-[var(--blue)] bg-clip-text text-transparent">
              ByteBack
            </span>
          </h1>

          <p className="text-[var(--muted)] text-sm sm:text-base max-w-lg mx-auto leading-relaxed font-sans">
            {booted ? (
              <>
                Paste your code. Get roasted by a senior dev who&apos;s seen
                things. Then actually get better.
              </>
            ) : (
              <span className="font-mono text-left inline-block">
                {BOOT_LINES.slice(0, bootIndex + 1).map((l, i) => (
                  <span key={i} className="block text-[var(--accent)]/80">
                    $ {l}
                  </span>
                ))}
                <span className="caret" />
              </span>
            )}
          </p>
          
        </motion.header>

        {/* ---------------- BENTO GRID LAYOUT ---------------- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* LEFT COLUMN: Input & Action */}
          <div className="lg:col-span-8 flex flex-col gap-6">
             {/* API Key Panel (Mobile Only - Hidden on Large Screens) */}
             <motion.section
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="term-window glass-panel lg:hidden"
             >
                <div className="term-titlebar">
                  <div className="flex gap-1.5">
                    <span className="term-dot bg-[#ff5f56]" />
                    <span className="term-dot bg-[#ffbd2e]" />
                    <span className="term-dot bg-[#27c93f]" />
                  </div>
                  <span className="ml-2 text-xs text-[var(--muted)] flex items-center gap-1.5 font-sans">
                    <Key size={12} /> config
                  </span>
                </div>
                <div className="p-4">
                  {!isKeySaved ? (
                     <div className="flex flex-col gap-3">
                         <div className="relative">
                            <input
                              type={showKey ? "text" : "password"}
                              placeholder="API Key..."
                              value={apiKey}
                              onChange={(e) => setApiKey(e.target.value)}
                              className="input-term w-full rounded-md pl-3 pr-10 py-2 text-sm text-white font-mono"
                            />
                             <button
                                type="button"
                                onClick={() => setShowKey((s) => !s)}
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--muted)] hover:text-white transition-colors"
                              >
                                {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
                              </button>
                         </div>
                         <button onClick={saveKey} disabled={!apiKey.trim()} className="btn-primary py-2 rounded-md text-sm font-sans">Save Key</button>
                     </div>
                  ) : (
                    <div className="flex items-center justify-between bg-[#070a0d]/50 border border-[var(--accent-dim)]/40 rounded-md p-3">
                       <span className="text-xs text-[var(--accent)] flex items-center gap-2"><ShieldCheck size={14}/> Key Active</span>
                       <button onClick={removeKey} className="text-[var(--danger)] text-xs flex items-center gap-1 hover:scale-95 transition-transform"><Trash2 size={12}/> Clear</button>
                    </div>
                  )}
                </div>
             </motion.section>

            {/* Code Editor Panel */}
            <motion.section
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="term-window glass-panel flex flex-col flex-grow min-h-[400px]"
            >
              <div className="term-titlebar justify-between">
                <div className="flex items-center gap-2">
                  <span className="term-dot bg-[#ff5f56]" />
                  <span className="term-dot bg-[#ffbd2e]" />
                  <span className="term-dot bg-[#27c93f]" />
                  <span className="ml-2 text-xs text-[var(--muted)] flex items-center gap-1.5 font-sans">
                    <FileCode2 size={12} /> review.input
                  </span>
                </div>
                
                <div className="flex items-center gap-3">
                  {/* <select 
                    value={language} 
                    onChange={(e) => setLanguage(e.target.value)}
                    className="bg-transparent text-xs text-[var(--muted)] border border-[var(--border)] rounded px-2 py-1 outline-none focus:border-[var(--accent-dim)] font-sans"
                  >
                    {LANGUAGES.map(l => (
                      <option key={l.value} value={l.value} className="bg-[var(--panel)]">{l.label}</option>
                    ))}
                  </select> */}
                  <button
                    onClick={() => setCodeSnippet(SAMPLE_CODE)}
                    className="text-xs text-[var(--muted)] hover:text-[var(--accent)] transition-all hover:scale-[0.98] flex items-center gap-1 font-sans"
                  >
                    <Sparkles size={12} /> load sample
                  </button>
                </div>
              </div>

              <div className="flex flex-grow relative overflow-hidden bg-[#0a0d14]/80">
                <div
                  ref={gutterRef}
                  className="editor-gutter hidden sm:block text-right pr-3 pl-4 py-4 text-xs text-[var(--muted)]/40 overflow-hidden select-none font-mono absolute left-0 top-0 bottom-0 w-[40px] border-r border-[var(--border)]/50 z-10 bg-[#0a0d14]"
                >
                  {Array.from({ length: lineCount }, (_, i) => (
                    <div key={i} className="leading-6">{i + 1}</div>
                  ))}
                </div>
                
                {/* Syntax Highlighted Editor */}
                <div className="flex-grow overflow-auto sm:ml-[40px]" onScroll={handleEditorScroll}>
                   <Editor
                      value={codeSnippet}
                      onValueChange={code => setCodeSnippet(code)}
                      highlight={code => Prism.highlight(code, Prism.languages[language] || Prism.languages.javascript, language)}
                      padding={16}
                      className="font-mono text-sm leading-6 min-h-full"
                      textareaClassName="focus:outline-none"
                      style={{
                        fontFamily: 'var(--font-geist-mono), monospace',
                        backgroundColor: 'transparent'
                      }}
                    />
                </div>
              </div>
            </motion.section>

            {/* Action Button */}
            <motion.button
              whileHover={{ scale: isEvaluating || !codeSnippet.trim() ? 1 : 0.99 }}
              whileTap={{ scale: isEvaluating || !codeSnippet.trim() ? 1 : 0.97 }}
              onClick={roastCode}
              disabled={isEvaluating || !codeSnippet.trim()}
              className="btn-primary relative overflow-hidden w-full py-4 rounded-xl flex justify-center items-center gap-2.5 text-sm tracking-wide font-sans shadow-lg shadow-[var(--accent)]/10"
            >
              {isEvaluating ? (
                <>
                  {/* Skeleton Sweep Effect */}
                  <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                  <Loader2 className="animate-spin relative z-10" size={18} />
                  <span className="relative z-10">Analyzing Architecture...</span>
                </>
              ) : (
                <>
                  <GitPullRequest size={18} />
                  Run Code Review
                </>
              )}
            </motion.button>
          </div>

          {/* RIGHT COLUMN: Settings & Results */}
          <div className="lg:col-span-4 flex flex-col gap-6">
             
             {/* API Key Panel (Desktop) */}
             <motion.section
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="term-window glass-panel hidden lg:block"
             >
                <div className="term-titlebar border-b border-[var(--border)] bg-transparent">
                   <span className="text-xs text-[var(--muted)] flex items-center gap-1.5 font-sans">
                    <Key size={12} /> Configuration
                  </span>
                </div>
                <div className="p-5">
                   {!isKeySaved ? (
                     <div className="space-y-4">
                        <p className="text-xs text-[var(--muted)] font-sans leading-relaxed">
                          Provide your Gemini API key. Stored in local browser storage. Zero server tracking.
                        </p>
                        <div className="relative">
                            <input
                              type={showKey ? "text" : "password"}
                              placeholder="AIzaSy..."
                              value={apiKey}
                              onChange={(e) => setApiKey(e.target.value)}
                              className="input-term w-full rounded-md pl-3 pr-10 py-2.5 text-sm text-white font-mono bg-[#070a0d]/80"
                            />
                             <button
                                type="button"
                                onClick={() => setShowKey((s) => !s)}
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--muted)] hover:text-white transition-colors"
                              >
                                {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
                              </button>
                         </div>
                         <button onClick={saveKey} disabled={!apiKey.trim()} className="btn-primary w-full py-2.5 rounded-md text-sm font-sans transition-all">Save Securely</button>
                     </div>
                   ) : (
                     <div className="flex flex-col gap-3">
                         <div className="flex items-center gap-2 text-sm text-[var(--accent)] bg-[var(--accent)]/10 border border-[var(--accent)]/20 rounded p-3">
                            <ShieldCheck size={16}/>
                            <span className="font-sans font-medium">Key Active & Secure</span>
                         </div>
                         <button onClick={removeKey} className="text-[var(--danger)] text-xs font-sans flex items-center justify-center gap-1.5 py-2 hover:bg-[var(--danger)]/10 rounded transition-colors">
                           <Trash2 size={13}/> Clear Credentials
                         </button>
                     </div>
                   )}
                </div>
             </motion.section>

             {/* Results Panel */}
             <AnimatePresence mode="wait">
              {roast && (
                <motion.div
                  key="results"
                  variants={containerVariants}
                  initial="hidden"
                  animate="show"
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="term-window glass-panel overflow-hidden flex-grow"
                >
                  <div className="term-titlebar justify-between bg-transparent border-b border-[var(--border)]">
                    <span className="text-xs text-[var(--muted)] flex items-center gap-1.5 font-sans">
                      <Terminal size={12} /> review.log
                    </span>
                    <motion.button
                      whileHover={{ scale: 0.95 }}
                      onClick={copyRoast}
                      className="text-xs text-[var(--muted)] hover:text-[var(--accent)] transition-colors flex items-center gap-1 font-sans bg-[var(--panel)] px-2 py-1 rounded border border-[var(--border)]"
                    >
                      {copied ? <Check size={12} className="text-[var(--accent)]" /> : <Copy size={12} />}
                      {copied ? "Copied" : "Copy"}
                    </motion.button>
                  </div>

                  <div className="p-5 overflow-y-auto max-h-[600px] custom-scrollbar">
                    {score !== null && (
                      <motion.div variants={itemVariants} className="flex items-center gap-4 mb-6 pb-5 border-b border-[var(--border)]/50">
                        <div
                          className="relative w-14 h-14 rounded-full flex items-center justify-center shrink-0 shadow-lg"
                          style={{
                            background: `conic-gradient(${
                              score >= 8 ? "var(--accent)" : score >= 5 ? "var(--amber)" : "var(--danger)"
                            } ${score * 36}deg, var(--panel-2) 0deg)`,
                          }}
                        >
                          <div className="w-11 h-11 rounded-full bg-[var(--panel)] flex items-center justify-center text-sm font-bold font-mono text-white">
                            {score}
                          </div>
                        </div>
                        <div className="font-sans">
                          <p className="text-[10px] uppercase tracking-wider text-[var(--muted)] font-semibold mb-0.5">
                            Verdict Score
                          </p>
                          <p className="text-sm text-gray-200">
                             {score >= 8 ? "Passable. Don't let it go to your head." : "Refactor immediately."}
                          </p>
                        </div>
                      </motion.div>
                    )}

                    <motion.div variants={itemVariants} className="prose-roast text-sm font-sans">
                      <ReactMarkdown
                        components={{
                          h3: ({ ...props }) => <h3 className="font-sans tracking-tight text-white mt-6 mb-3 font-semibold" {...props} />,
                          p: ({ ...props }) => <p className="text-gray-300 leading-relaxed mb-4" {...props} />,
                          strong: ({ ...props }) => <strong className="text-white font-semibold" {...props} />,
                          ul: ({ ...props }) => <ul className="list-none space-y-2 mb-4" {...props} />,
                          li: ({ ...props }) => (
                            <li className="relative pl-4 text-gray-300">
                               <span className="absolute left-0 top-[6px] w-1.5 h-1.5 rounded-full bg-[var(--accent)]/60" />
                               <span {...props} />
                            </li>
                          ),
                          pre: ({ ...props }) => <pre className="bg-[#05070a] border border-[var(--border)] rounded-lg p-4 my-4 overflow-x-auto font-mono text-xs" {...props} />,
                          code: ({ className, ...props }) => {
                            const isInline = !className?.includes("language-");
                            return (
                              <code
                                className={isInline ? "bg-[var(--accent)]/10 text-[var(--accent)] px-1.5 py-0.5 rounded text-xs font-mono border border-[var(--accent)]/20" : "font-mono text-gray-300"}
                                {...props}
                              />
                            );
                          },
                        }}
                      >
                        {roast}
                      </ReactMarkdown>
                    </motion.div>
                  </div>
                </motion.div>
              )}
             </AnimatePresence>
          </div>
        </div>

        {/* ---------------- FOOTER ---------------- */}
        <footer className="text-center text-xs text-[var(--muted)] pt-6 pb-4 font-sans tracking-wide">
          <p>
            built by <span className="text-gray-300">Jalisabanu Malik</span>
          </p>
        </footer>
      </div>
      
      {/* Background radial gradients for glassmorphism depth */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[var(--accent)]/5 via-[#05070a] to-[#05070a]" />
      <div className="fixed inset-0 z-0 pointer-events-none bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-[var(--blue)]/5 via-transparent to-transparent" />
    </main>
  );
}