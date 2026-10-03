import { useMemo, useState } from "react";
import { binarySearchSteps, randomArray, parseNumbers } from "@/lib/algorithms";
import { usePlayer } from "@/hooks/use-player";
import { Btn, Stat, Panel, Complexity, SpeedControl, Progress } from "./ui";
import { cn } from "@/lib/utils";

export function SearchVisualizer() {
  const [text, setText] = useState("5 12 18 23 31 42 56 67 81");
  const [arr, setArr] = useState([5, 12, 18, 23, 31, 42, 56, 67, 81]);
  const [target, setTarget] = useState(42);
  const [notice, setNotice] = useState("");
  const [speed, setSpeed] = useState(900);

  const res = useMemo(() => binarySearchSteps(arr, target), [arr, target]);
  const p = usePlayer(res.steps.length, speed);
  const s = res.steps[p.index];

  const load = (raw: number[]) => {
    const sorted = [...raw].sort((a, b) => a - b);
    const was = raw.some((v, i) => v !== sorted[i]);
    setNotice(was ? "Binary Search requires sorted data. Array sorted automatically." : "");
    setArr(sorted); setText(sorted.join(" ")); p.reset();
  };

  return (
    <div className="grid gap-5 lg:grid-cols-[320px_1fr]">
      <aside className="space-y-5">
        <Panel title="Input">
          <label className="label">Array</label>
          <input value={text} onChange={(e) => setText(e.target.value)} className="field mt-2 w-full" />
          <label className="label mt-4 block">Search value</label>
          <input type="number" value={target} onChange={(e) => { setTarget(+e.target.value); p.reset(); }} className="field mt-2 w-full" />
          <div className="mt-4 grid grid-cols-2 gap-2">
            <Btn onClick={() => { const a = parseNumbers(text); if (a.length) load(a); }}>Use Array</Btn>
            <Btn onClick={() => { const a = randomArray(15, 1, 99); load(a); setTarget(a[Math.floor(Math.random() * a.length)]); }}>Random Array</Btn>
          </div>
        </Panel>
        <Panel><SpeedControl speed={speed} setSpeed={setSpeed} /></Panel>
        <Complexity name="Binary Search" rows={[["Best", "O(1)"], ["Average", "O(log n)"], ["Worst", "O(log n)"], ["Space", "O(1)"]]} />
      </aside>

      <div className="space-y-5">
        <div className="panel p-5">
          <div className="flex flex-wrap gap-2">
            <Btn variant="primary" onClick={p.start}>Start Search</Btn>
            <Btn onClick={p.pause} disabled={!p.playing}>Pause</Btn>
            <Btn onClick={p.resume} disabled={p.playing || p.finished}>Resume</Btn>
            <Btn onClick={p.next} disabled={p.finished}>Next Step</Btn>
            <Btn onClick={p.reset}>Reset</Btn>
          </div>
          {notice && <div className="notice mt-4">{notice}</div>}
          <div className={cn("status mt-4", s.done && (s.found !== null ? "status-ok" : "status-bad"))}>
            {s.done ? (s.found !== null ? "Element Found! " : "Element Not Found — ") : ""}{s.message}
          </div>
          <div className="mt-3"><Progress value={p.index / Math.max(res.steps.length - 1, 1)} /></div>

          <div className="mt-8 flex flex-wrap gap-2">
            {arr.map((v, i) => {
              const out = i < s.low || i > s.high;
              return (
                <div key={i} className="flex flex-col items-center gap-1">
                  <div className={cn("cell", out && "cell-out", s.mid === i && "cell-mid", s.found === i && "cell-found")}>{v}</div>
                  <span className="font-mono text-[10px] text-muted-foreground">{i}</span>
                  <span className="h-4 font-mono text-[10px] font-semibold text-primary">
                    {[i === s.low && "L", i === s.mid && "M", i === s.high && "H"].filter(Boolean).join("·")}
                  </span>
                </div>
              );
            })}
          </div>
          <p className="mt-3 font-mono text-xs text-muted-foreground">
            Interval: [{s.low}, {s.high}] · L = low · M = mid · H = high
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          <Stat label="Search steps" value={s.steps} />
          <Stat label="Comparisons" value={s.comparisons} />
          <Stat label="Exec time" value={`${res.timeMs.toFixed(5)}ms`} hint="Average of 1000 runs" />
          <Stat label="Target" value={target} />
          <Stat label="Final index" value={p.finished ? (res.index >= 0 ? res.index : "—") : "…"} />
          <Stat label="Array size" value={arr.length} />
        </div>
      </div>
    </div>
  );
}
