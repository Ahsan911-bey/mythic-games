'use client';

import { useState, useRef, useEffect, useCallback, KeyboardEvent } from 'react';
import { Terminal, X, Minimize2 } from 'lucide-react';

interface HistoryEntry {
  type: 'input' | 'output' | 'error' | 'schema' | 'system';
  content: string;
}

const BANNER = [
  '  __  __      _   _     _      ____  ___  _',
  ' |  \\/  |_  _| |_| |__ (_)__  / ___||__ \\| |',
  " | |\\/| | || |  _| '_ \\| / _| \\___ \\ |_) | |",
  ' | |  | |\\_, |\\__|_||_|_\\__|  ___) / __/|_|',
  ' |_|  |_|/__/              |____/|_____|_|',
  '',
  ' MySQL Terminal v1.0.0 — Mythic Games Admin',
  ' Type SQL to execute. Type "/" to list schema models.',
  ' Type "clear" to clear the screen.',
  ' ─────────────────────────────────────────────────',
  '',
];

export default function SqlTerminal() {
  const [isOpen, setIsOpen] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>(
    BANNER.map((line) => ({ type: 'system', content: line }))
  );
  const [input, setInput] = useState('');
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [cmdHistoryIdx, setCmdHistoryIdx] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom whenever history changes
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [history]);

  // Focus input when terminal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // ESC key closes terminal
  useEffect(() => {
    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) setIsOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const pushHistory = useCallback((entries: HistoryEntry[]) => {
    setHistory((prev) => [...prev, ...entries]);
  }, []);

  const handleCommand = useCallback(
    async (raw: string) => {
      const cmd = raw.trim();
      if (!cmd) return;

      // Add command to cmd history
      setCmdHistory((prev) => [cmd, ...prev]);
      setCmdHistoryIdx(-1);

      // Show the prompt + command in output
      pushHistory([{ type: 'input', content: cmd }]);

      // Built-in clear command
      if (cmd.toLowerCase() === 'clear') {
        setHistory(BANNER.map((line) => ({ type: 'system', content: line })));
        return;
      }

      setIsLoading(true);
      try {
        const res = await fetch('/api/admin/sql', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: cmd }),
        });
        const data = await res.json();

        if (data.type === 'error' || data.error) {
          pushHistory([{ type: 'error', content: `ERROR: ${data.error}` }]);
        } else if (data.type === 'schema') {
          pushHistory([
            { type: 'output', content: '--- Schema Models ---' },
            ...data.output.map((m: string) => ({ type: 'output' as const, content: `  ${m}` })),
            { type: 'output', content: `(${data.output.length} models)` },
          ]);
        } else if (data.type === 'select') {
          const rows: Record<string, unknown>[] = data.rows;
          if (!rows || rows.length === 0) {
            pushHistory([{ type: 'output', content: 'Empty set (0 rows)' }]);
          } else {
            // Build a table-like output
            const keys = Object.keys(rows[0]);
            const colWidths = keys.map((k) =>
              Math.max(k.length, ...rows.map((r) => String(r[k] ?? 'NULL').length))
            );
            const separator = '+' + colWidths.map((w) => '-'.repeat(w + 2)).join('+') + '+';
            const header =
              '| ' + keys.map((k, i) => k.padEnd(colWidths[i])).join(' | ') + ' |';

            const tableLines: HistoryEntry[] = [
              { type: 'output', content: separator },
              { type: 'output', content: header },
              { type: 'output', content: separator },
              ...rows.map((row) => ({
                type: 'output' as const,
                content:
                  '| ' +
                  keys.map((k, i) => String(row[k] ?? 'NULL').padEnd(colWidths[i])).join(' | ') +
                  ' |',
              })),
              { type: 'output', content: separator },
              { type: 'output', content: `${rows.length} row(s) in set` },
            ];
            pushHistory(tableLines);
          }
        } else if (data.type === 'execute') {
          pushHistory([
            { type: 'output', content: `Query OK, ${data.affected} row(s) affected` },
          ]);
        }
      } catch (err: any) {
        pushHistory([{ type: 'error', content: `Network error: ${err.message}` }]);
      } finally {
        setIsLoading(false);
        pushHistory([{ type: 'system', content: '' }]);
      }
    },
    [pushHistory]
  );

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const cmd = input;
      setInput('');
      handleCommand(cmd);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const nextIdx = Math.min(cmdHistoryIdx + 1, cmdHistory.length - 1);
      setCmdHistoryIdx(nextIdx);
      setInput(cmdHistory[nextIdx] ?? '');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIdx = Math.max(cmdHistoryIdx - 1, -1);
      setCmdHistoryIdx(nextIdx);
      setInput(nextIdx === -1 ? '' : cmdHistory[nextIdx]);
    }
  };

  return (
    <>
      {/* Floating trigger button */}
      <button
        onClick={() => setIsOpen(true)}
        title="Open SQL Terminal"
        className="fixed bottom-8 right-8 z-40 flex items-center gap-2 bg-black border border-green-500/50 hover:border-green-400 text-green-400 font-mono text-sm font-bold px-4 py-3 rounded-lg shadow-2xl shadow-green-500/20 hover:shadow-green-400/30 transition-all duration-300 hover:scale-105 group"
      >
        <Terminal className="w-4 h-4 group-hover:animate-pulse" />
        <span className="hidden sm:inline">SQL Terminal</span>
      </button>

      {/* Full-screen overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex flex-col"
          style={{ backgroundColor: '#000', fontFamily: "'Courier New', Courier, monospace" }}
          onClick={() => inputRef.current?.focus()}
        >
          {/* Terminal title bar */}
          <div
            className="flex items-center justify-between px-4 py-2 shrink-0"
            style={{ backgroundColor: '#1a1a1a', borderBottom: '1px solid #2a2a2a' }}
          >
            <div className="flex items-center gap-2">
              {/* Traffic light buttons */}
              <button onClick={() => setIsOpen(false)} className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-400 transition-colors" title="Close" />
              <button className="w-3 h-3 rounded-full bg-yellow-500 cursor-default" />
              <button className="w-3 h-3 rounded-full bg-green-500 cursor-default" />
              <span className="ml-3 text-xs text-gray-400">mythic-games — mysql@gamestore</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-green-400/60 font-mono">Press ESC to close</span>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Output history */}
          <div
            ref={outputRef}
            className="flex-grow overflow-y-auto p-4 text-sm leading-6"
            style={{ scrollbarColor: '#2a2a2a #000' }}
          >
            {history.map((entry, i) => (
              <div key={i} className="whitespace-pre-wrap break-all">
                {entry.type === 'input' ? (
                  <div>
                    <span style={{ color: '#00d084' }}>admin@mythic</span>
                    <span style={{ color: '#666' }}>:</span>
                    <span style={{ color: '#5588ff' }}>~</span>
                    <span style={{ color: '#666' }}>$</span>
                    <span style={{ color: '#ffffff' }}> {entry.content}</span>
                  </div>
                ) : entry.type === 'error' ? (
                  <div style={{ color: '#ff5555' }}>{entry.content}</div>
                ) : entry.type === 'system' ? (
                  <div style={{ color: '#888' }}>{entry.content}</div>
                ) : (
                  <div style={{ color: '#00ff88' }}>{entry.content}</div>
                )}
              </div>
            ))}

            {isLoading && (
              <div style={{ color: '#888' }} className="animate-pulse">
                Executing...
              </div>
            )}
          </div>

          {/* Input row */}
          <div
            className="flex items-center gap-2 px-4 py-3 shrink-0 text-sm"
            style={{ borderTop: '1px solid #1a1a1a', backgroundColor: '#000' }}
          >
            <span style={{ color: '#00d084' }}>admin@mythic</span>
            <span style={{ color: '#666' }}>:</span>
            <span style={{ color: '#5588ff' }}>~</span>
            <span style={{ color: '#666' }}>$</span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              spellCheck={false}
              autoComplete="off"
              autoCorrect="off"
              className="flex-grow bg-transparent outline-none caret-green-400"
              style={{ color: '#ffffff', caretColor: '#00ff88' }}
              placeholder={isLoading ? '' : '_'}
            />
          </div>
        </div>
      )}
    </>
  );
}
