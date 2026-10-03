import { useState } from "react";
import { mergeSortSteps, quickSortSteps, randomArray, parseNumbers, type SortResult } from "@/lib/algorithms";
import { Btn, Panel } from "./ui";

export function Comparison() {
  const [text, setText] = useState(randomArray(30, 1, 200).join(", "));
  const [res, setRes] = useState<{ m: SortResult; q: SortResult; n: number } | null>(null);

  const run = () => {
    const a = parseNumbers(text);
    if (a.length < 2) return;
    setRes({ m: mergeSortSteps(a), q: quickSortSteps(a), n: a.length });
  };

  const metrics = res ? ([
    ["Execution Time (ms)", res.m.timeMs, res.q.timeMs, 4],
    ["Comparisons", res.m.comparisons, res.q.comparisons, 0],
    ["Steps", res.m.opSteps, res.q.opSteps, 0],
    ["Swaps / Moves", res.m.swaps, res.q.swaps, 0],
    ["Array Size", res.n, res.n, 0],
  ] as [string, number, number, number][]) : [];

  return (
    <div className="space-y-5">
      <Panel title="Same input for both algorithms">
        <textarea value={text} onChange={(e) => setText(e.target.value)} rows={3} className="field w-full font-mono" />
        <div className="mt-3 flex flex-wrap gap-2">
          <Btn variant="primary" onClick={run}>Run Comparison</Btn>
          <Btn onClick={() => setText(randomArray(30, 1, 200).join(", "))}>Random 30</Btn>
          <Btn onClick={() => setText(Array.from({ length: 30 }, (_, i) => i + 1).join(", "))} title="Already sorted input — Quick Sort's worst case with last-element pivot">Sorted (worst case)</Btn>
        </div>
      </Panel>

      {res && (
        <>
          <div className="panel overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border text-left"><th className="label p-4">Metric</th><th className="label p-4">Merge Sort</th><th className="label p-4">Quick Sort</th></tr></thead>
              <tbody>
                {metrics.map(([k, a, b, d]) => (
                  <tr key={k} className="border-b border-border/50">
                    <td className="p-4 text-muted-foreground">{k}</td>
                    <td className="p-4 font-mono text-foreground">{a.toFixed(d)}</td>
                    <td className="p-4 font-mono text-foreground">{b.toFixed(d)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {metrics.slice(0, 3).map(([k, a, b, d]) => {
              const top = Math.max(a, b, 1e-9);
              return (
                <Panel key={k} title={k}>
                  {[["Merge", a, "bar-write"], ["Quick", b, "bar-pivot"]].map(([n, v, c]) => (
                    <div key={n as string} className="mb-3" title={`${n}: ${(v as number).toFixed(d)}`}>
                      <div className="mb-1 flex justify-between text-xs"><span className="text-muted-foreground">{n}</span><span className="font-mono">{(v as number).toFixed(d)}</span></div>
                      <div className="h-3 rounded bg-muted"><div className={`h-full rounded transition-all duration-700 ${c}`} style={{ width: `${((v as number) / top) * 100}%` }} /></div>
                    </div>
                  ))}
                </Panel>
              );
            })}
          </div>
          <p className="text-xs text-muted-foreground">All values are measured live in your browser. Timing is averaged over 50 runs but still varies between runs due to JIT, device load and browser scheduling.</p>
        </>
      )}
    </div>
  );
}
