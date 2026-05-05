"use client";

import { useState, useEffect } from "react";

type Search = {
  id: number;
  inputType: string;
  inputValue: string;
  decimalResult: string;
  createdAt: string;
};

export default function Home() {
  const [binary, setBinary] = useState("");
  const [hexadecimal, setHexadecimal] = useState("");
  const [decimal, setDecimal] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [savedSearches, setSavedSearches] = useState<Search[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("binary");

  const handleBinaryChange = (value: string) => {
    if (value === "" || /^[01]+$/.test(value)) {
      setBinary(value);
      setError("");
      setDecimal(value === "" ? null : parseInt(value, 2));
    } else {
      setError("Only 0s and 1s are allowed");
    }
  };

  const handleHexadecimalChange = (value: string) => {
    const upper = value.toUpperCase();
    if (value === "" || /^[0-9A-F]+$/i.test(value)) {
      setHexadecimal(upper);
      setError("");
      setDecimal(value === "" ? null : parseInt(upper, 16));
    } else {
      setError("Only 0–9 and A–F are allowed");
    }
  };

  const handleClear = () => {
    setBinary("");
    setHexadecimal("");
    setDecimal(null);
    setError("");
  };

  const loadSearches = async () => {
    try {
      const res = await fetch("/api/searches");
      if (res.ok) setSavedSearches(await res.json());
    } catch (e) {
      console.error("Error loading searches:", e);
    }
  };

  useEffect(() => { loadSearches(); }, []);

  const handleSave = async () => {
    if (decimal === null || error) return;
    const inputValue = activeTab === "binary" ? binary : hexadecimal;
    if (!inputValue) return;

    setIsSaving(true);
    try {
      const res = await fetch("/api/searches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inputType: activeTab, inputValue, decimalResult: decimal.toString() }),
      });
      if (res.ok) await loadSearches();
    } catch (e) {
      console.error("Error saving search:", e);
    } finally {
      setIsSaving(false);
    }
  };

  const handleLoadSearch = (s: Search) => {
    if (s.inputType === "binary") {
      setActiveTab("binary");
      setBinary(s.inputValue);
      setHexadecimal("");
    } else {
      setActiveTab("hexadecimal");
      setHexadecimal(s.inputValue);
      setBinary("");
    }
    setDecimal(parseInt(s.decimalResult));
    setError("");
  };

  const formatDate = (d: string) => {
    const dt = new Date(d);
    return dt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) +
      " " + dt.toLocaleDateString([], { month: "short", day: "numeric" });
  };

  const isBin = activeTab === "binary";
  const currentInput = isBin ? binary : hexadecimal;

  return (
    <div className="t-root">
      {/* ── Header ── */}
      <header className="t-header">
        <span className="t-logo">DECODE</span>
        <span className="t-header-sep">//</span>
        <span className="t-header-sub">binary &amp; hex → decimal</span>
        <div className="t-header-right">
          <div className="t-status-dot" />
          <span>online</span>
        </div>
      </header>

      <main className="t-main">
        {/* ── Left panel: input ── */}
        <section className="t-left">

          {/* Mode selector */}
          <div>
            <div className="t-label">Input mode</div>
            <div className="t-mode-wrap">
              <button
                className={`t-mode-btn ${isBin ? "m-bin" : ""}`}
                onClick={() => { setActiveTab("binary"); setError(""); }}
              >
                BIN
              </button>
              <button
                className={`t-mode-btn ${!isBin ? "m-hex" : ""}`}
                onClick={() => { setActiveTab("hexadecimal"); setError(""); }}
              >
                HEX
              </button>
            </div>
          </div>

          {/* Input field */}
          <div>
            <div className="t-label">
              {isBin ? "Binary  [0, 1]" : "Hex  [0–9, A–F]"}
            </div>
            <div className={`t-input-wrap ${isBin ? "bin-focus" : "hex-focus"}`}>
              <span className="t-prompt-sym">›</span>
              {isBin ? (
                <input
                  key="bin"
                  className="t-input"
                  type="text"
                  placeholder="1010"
                  value={binary}
                  onChange={(e) => handleBinaryChange(e.target.value)}
                  autoComplete="off"
                  spellCheck={false}
                />
              ) : (
                <input
                  key="hex"
                  className="t-input"
                  type="text"
                  placeholder="FF"
                  value={hexadecimal}
                  onChange={(e) => handleHexadecimalChange(e.target.value)}
                  autoComplete="off"
                  spellCheck={false}
                />
              )}
            </div>
            {error && <div className="t-error">! {error}</div>}
          </div>

          {/* Buttons */}
          <div className="t-btns">
            <button
              className="t-btn"
              onClick={handleSave}
              disabled={decimal === null || !!error || isSaving}
            >
              {isSaving ? "···" : "SAVE"}
            </button>
            <button
              className="t-btn t-btn-sec"
              onClick={handleClear}
              disabled={!currentInput && decimal === null}
            >
              CLR
            </button>
          </div>

          {/* Guide */}
          <div className="t-guide">
            <div className="t-label">How to use</div>
            <div className="t-guide-line">Select BIN or HEX mode</div>
            <div className="t-guide-line">Type your number</div>
            <div className="t-guide-line">Result appears instantly</div>
            <div className="t-guide-line">Save to keep a record</div>
          </div>
        </section>

        {/* ── Right panel: result + history ── */}
        <section className="t-right">

          {/* Result display */}
          <div className="t-result-area">
            <span className="t-result-tag">// decimal output</span>

            {decimal !== null && !error ? (
              <div className={`t-result-num ${!isBin ? "is-hex" : ""}`}>
                {decimal.toLocaleString()}
              </div>
            ) : (
              <div className="t-result-cursor">█</div>
            )}

            {decimal !== null && !error && (
              <>
                <span className="t-result-base">base 10</span>
                <span className="t-result-from">
                  from {isBin ? "binary" : "hex"} {currentInput}
                </span>
              </>
            )}
          </div>

          {/* History */}
          <div className="t-history">
            <div className="t-history-head">
              // conversion log ({savedSearches.length})
            </div>
            {savedSearches.length === 0 ? (
              <div className="t-history-empty">
                No saved conversions yet
              </div>
            ) : (
              savedSearches.map((s) => (
                <div
                  key={s.id}
                  className="t-h-entry"
                  onClick={() => handleLoadSearch(s)}
                  title="Click to reload"
                >
                  <span className="t-h-type">[{s.inputType.slice(0, 3).toUpperCase()}]</span>
                  <span className="t-h-input">{s.inputValue}</span>
                  <span className="t-h-arrow">→</span>
                  <span className="t-h-result">{parseInt(s.decimalResult).toLocaleString()}</span>
                  <span className="t-h-time">{formatDate(s.createdAt)}</span>
                </div>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
