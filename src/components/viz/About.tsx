import { Complexity } from "./ui";

const algos = [
  { name: "Merge Sort", idea: "Divide and conquer", steps: ["Split the array into two halves", "Recursively sort each half", "Merge the two sorted halves by repeatedly taking the smaller front element"], pros: "Stable, guaranteed O(n log n)", cons: "Needs O(n) extra memory",
    rows: [["Best", "O(n log n)"], ["Average", "O(n log n)"], ["Worst", "O(n log n)"], ["Space", "O(n)"]] as [string, string][] },
  { name: "Quick Sort", idea: "Partition around a pivot", steps: ["Pick a pivot (last element here)", "Move smaller elements left, larger right", "Place pivot in its final spot, recurse on both sides"], pros: "In-place, very fast in practice", cons: "O(n²) on bad pivots (e.g. sorted input)",
    rows: [["Best", "O(n log n)"], ["Average", "O(n log n)"], ["Worst", "O(n²)"], ["Space", "O(log n)"]] as [string, string][] },
  { name: "Binary Search", idea: "Halve the search space", steps: ["Requires a sorted array", "Compare target with the middle element", "Discard the half that cannot contain the target"], pros: "Extremely fast lookups", cons: "Data must be sorted first",
    rows: [["Best", "O(1)"], ["Average", "O(log n)"], ["Worst", "O(log n)"], ["Space", "O(1)"]] as [string, string][] },
];

export function About() {
  return (
    <div className="grid gap-5 lg:grid-cols-3">
      {algos.map((a) => (
        <div key={a.name} className="space-y-4">
          <div className="panel p-5">
            <div className="label text-primary">{a.idea}</div>
            <h3 className="mt-1 font-display text-2xl text-foreground">{a.name}</h3>
            <ol className="mt-4 space-y-2">
              {a.steps.map((s, i) => (
                <li key={s} className="flex gap-3 text-sm text-muted-foreground"><span className="font-mono text-primary">0{i + 1}</span>{s}</li>
              ))}
            </ol>
            <div className="mt-4 grid gap-2 text-xs">
              <div className="rounded-md bg-success/10 p-2 text-success">+ {a.pros}</div>
              <div className="rounded-md bg-destructive/10 p-2 text-destructive">− {a.cons}</div>
            </div>
          </div>
          <Complexity name="Complexity" rows={a.rows} />
        </div>
      ))}
    </div>
  );
}
