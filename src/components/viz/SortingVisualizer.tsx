import { useMemo, useState } from "react";
import { mergeSortSteps, quickSortSteps, randomArray, parseNumbers } from "@/lib/algorithms";
import { usePlayer } from "@/hooks/use-player";
import { Btn, Stat, Panel, Complexity, SpeedControl, Progress } from "./ui";
import { cn } from "@/lib/utils";

type Algo = "merge" | "quick";

export function SortingVisualizer() {
  const [algo, setAlgo] = useState<Algo>("merge");
  const [size, setSize] = useState(10);
  const [min, setMin] = useState(5);
  const [max, setMax] = useState(99);
  const [base, setBase] = useState<number[]>([38, 12, 27, 43, 9, 31, 18, 25]);
  const [text, setText] = useState("38, 12, 27, 43, 9, 31, 18, 25");
  const [speed, setSpeed] = useState(450);

  const result = useMemo(() => (algo === "merge" ? mergeSortSteps(base) : quickSortSteps(base)), [algo, base]);
  const p = usePlayer(result.steps.length, speed);
  const s = result.steps[Math.min(p.index, result.steps.length - 1)]!;
  const peak = Math.max(...base, 1);

  const generate = () => {
    const lo = Math.min(min, max), hi = Math.max(min, max);
    const arr = randomArray(size, lo, hi);
    setBase(arr); setText(arr.join(", ")); p.reset();
  };
  const apply = () => { const arr = parseNumbers(text); if (arr.length >= 2) { setBase(arr); p.reset(); } };

  const color = (i: number) => {
    if (s.pivot === i) return "bar-pivot";
    if (s.swap.includes(i)) return "bar-swap";
    if (s.write.includes(i)) return "bar-write";
    if (s.compare.includes(i)) return "bar-compare";
    if (s.sorted.includes(i)) return "bar-sorted";
    if (s.range && (i < s.range[0] || i > s.range[1])) return "bar-dim";
    return "bar-idle";
  };

  return (
    <div className="grid gap-5 lg:grid-cols-[320px_1fr]">
      <aside className="space-y-5">
        <Panel title="Algorithm">
          <div className="grid grid-cols-2 gap-2">
            {(["merge", "quick"] as Algo[]).map((a) => (
              <button key={a} onClick={() => { setAlgo(a); p.reset(); }} className={cn("chip py-2", algo === a && "chip-on")}>
                {a === "merge" ? "Merge Sort" : "Quick Sort"}
              </button>
            ))}
          </div>
        </Panel>
        <Panel title="Input">
          <label className="label">Custom numbers</label>
          <div className="mt-2 flex gap-2">
            <input value={text} onChange={(e) => setText(e.target.value)} className="field flex-1" placeholder="38, 12, 27…" />
            <Btn onClick={apply} title="Use these numbers">Use</Btn>
          </div>
          <label className="label mt-4 block">Array size: <span className="text-primary">{size}</span></label>
          <input type="range" min={4} max={40} value={size} onChange={(e) => setSize(+e.target.value)} className="mt-2 w-full accent-primary" />
          <div className="mt-3 grid grid-cols-2 gap-2">
            <label className="label">Min<input type="number" value={min} onChange={(e) => setMin(+e.target.value)} className="field mt-1 w-full" /></label>
            <label className="label">Max<input type="number" value={max} onChange={(e) => setMax(+e.target.value)} className="field mt-1 w-full" /></label>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <Btn onClick={generate} title="Create a new random array">Generate Array</Btn>
            <Btn onClick={generate} title="Shuffle with new random values">Randomize</Btn>
          </div>
        </Panel>
        <Panel><SpeedControl speed={speed} setSpeed={setSpeed} /></Panel>
      </aside>

      <div className="space-y-5">
        <div className="panel p-5">
          <div className="flex flex-wrap gap-2">
            <Btn variant="primary" onClick={p.start} title="Run from the beginning">Start</Btn>
            <Btn onClick={p.pause} disabled={!p.playing} title="Pause animation">Pause</Btn>
            <Btn onClick={p.resume} disabled={p.playing || p.finished} title="Continue animation">Resume</Btn>
            <Btn onClick={p.next} disabled={p.finished} title="Advance one step">Next Step</Btn>
            <Btn onClick={p.reset} title="Back to original array">Reset</Btn>
          </div>
          <div className="status mt-4">{s.message}</div>
          <div className="mt-3"><Progress value={p.index / Math.max(result.steps.length - 1, 1)} /></div>

          <div className="mt-6 flex h-80 items-end gap-1 sm:gap-1.5">
            {s.array.map((v, i) => (
              <div key={i} className="flex h-full flex-1 flex-col justify-end items-center">
                <span className="mb-1 font-mono text-[10px] text-muted-foreground sm:text-xs">{v}</span>
                <div className={cn("bar w-full", color(i))} style={{ height: `${Math.max((v / peak) * 100, 3)}%` }} />
              </div>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-4 text-xs text-muted-foreground">
            {[["bar-compare", "Comparing"], ["bar-swap", "Swapped"], ["bar-write", "Merged / written"], ["bar-pivot", "Pivot"], ["bar-sorted", "Sorted"], ["bar-dim", "Outside range"]].map(([c, l]) => (
              <span key={c} className="flex items-center gap-1.5"><span className={cn("h-3 w-3 rounded-sm", c)} />{l}</span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
          <Stat label="Comparisons" value={s.comparisons} />
          <Stat label="Steps" value={`${s.steps}/${result.opSteps}`} />
          <Stat label={algo === "merge" ? "Writes" : "Swaps"} value={s.swaps} hint={algo === "merge" ? "Merge sort writes elements into place rather than swapping" : undefined} />
          <Stat label="Exec time" value={`${result.timeMs.toFixed(4)}ms`} hint="Measured algorithm runtime (avg of 50 runs)" />
          <Stat label="Array size" value={base.length} />
        </div>

        {algo === "merge" ? (
          <Complexity name="Merge Sort" rows={[["Best", "O(n log n)"], ["Average", "O(n log n)"], ["Worst", "O(n log n)"], ["Space", "O(n)"]]} />
        ) : (
          <Complexity name="Quick Sort" rows={[["Best", "O(n log n)"], ["Average", "O(n log n)"], ["Worst", "O(n²)"], ["Space", "O(log n) avg stack"]]} />
        )}
      </div>
    </div>
  );
}
