import React, { useRef, useState } from "react";
import { FigmaAsset } from "./ui";
import { companies } from "./content";

const suggestions = [
  "Find me the best job that matches 80% ATS score",
  "Create a CV for the job role",
  "Find job that align with my skills",
  "Jobs in Google",
];

export function AgentSection({ onApply, onProfile, onSearch }) {
  const [prompt, setPrompt] = useState("");
  const [tool, setTool] = useState("Tools");
  const [attachment, setAttachment] = useState("");
  const [results, setResults] = useState(null);
  const input = useRef(null);
  const file = useRef(null);
  const search = (event) => {
    event.preventDefault();
    if (onSearch) return onSearch();
    if (!prompt.trim()) return input.current.focus();
    if (tool === "Create a CV" || /\bcv\b|resume/i.test(prompt)) return onProfile();
    const generic = /ats|align with my skills|perfect job/i.test(prompt);
    const terms = prompt.toLowerCase().replace(/[^a-z0-9 ]/g, " ").split(/\s+/).filter((word) => word.length > 2 && !["find", "jobs", "job", "for", "the", "best", "that", "matches", "with", "work", "role", "roles", "please", "looking", "want"].includes(word));
    setResults(generic ? companies : companies.filter((company) => terms.some((term) => `${company.name} ${company.role}`.toLowerCase().includes(term))));
  };
  return (
    <section className="agent-section container" id="agent" aria-labelledby="agent-heading">
      <header className="agent-intro" data-heading-reveal>
        <p className="agent-eyebrow">OUR AGENT</p>
        <h2 id="agent-heading">Introducing our agent!!</h2>
        <p>You are not alone !</p>
      </header>
      <div className="agent-card" data-reveal>
        <div className="agent-mascot" aria-hidden="true"><FigmaAsset section="112:582" name="imgImage8" /></div>
        <div className="agent-identity"><h3>Jobee AI</h3><p>Your Ai- powered job assistant</p></div>
        <form className="agent-composer" onSubmit={search}>
          <label className="sr-only" htmlFor="agent-prompt">Ask Jobee about a role or company</label>
          <textarea id="agent-prompt" ref={input} value={prompt} onChange={(event) => setPrompt(event.target.value)} placeholder="Let’s find the perfect job for you !!" rows={1} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); event.currentTarget.form.requestSubmit(); } }} />
          <div className="agent-controls">
            <button className="agent-attach" type="button" aria-label="Attach a CV" onClick={() => file.current.click()}><FigmaAsset section="112:582" name="imgElements" /></button>
            <input ref={file} type="file" accept=".pdf,.doc,.docx,.txt" hidden onChange={(event) => setAttachment(event.target.files?.[0]?.name || "")} />
            <details className="agent-tools"><summary>{tool}<FigmaAsset section="112:582" name="imgElements1" /></summary><div>{["Find jobs", "Create a CV"].map((name) => <button key={name} type="button" onClick={(event) => { setTool(name); event.currentTarget.closest("details").open = false; }}>{name}</button>)}</div></details>
            <button className="agent-search" type="submit">Search</button>
          </div>
        </form>
        {attachment && <p className="agent-attachment" role="status">Selected: {attachment} <button type="button" aria-label="Remove attachment" onClick={() => { setAttachment(""); file.current.value = ""; }}>×</button></p>}
        <div className="agent-suggestions"><p>Suggestions</p>{suggestions.map((suggestion) => <button key={suggestion} type="button" onClick={() => { setPrompt(suggestion); setResults(null); input.current.focus(); }}>{suggestion}</button>)}</div>
        {results !== null && <div className="agent-results" aria-live="polite"><p>{results.length ? "Available roles on Progrize" : "No matching roles on this page. Try a different role or company."}</p>{results.map((company) => <button key={company.name} type="button" onClick={() => onApply(company)}><span>{company.role}<small>{company.name}</small></span><span>{company.salary} ↗</span></button>)}<small>Preview search uses the roles on this page. AI matching, CV analysis and ATS scoring are not connected yet.</small></div>}
      </div>
    </section>
  );
}
