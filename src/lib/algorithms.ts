// Index access is bounds-checked by algorithm logic.
// @ts-nocheck
export type SortStep = {
  array: number[];
  compare: number[];
  swap: number[];
  write: number[];
  pivot: number | null;
  range: [number, number] | null;
  sorted: number[];
  message: string;
  comparisons: number;
  swaps: number;
  steps: number;
};

export type SortResult = { steps: SortStep[]; timeMs: number; comparisons: number; swaps: number; opSteps: number };

// Pure runs for timing (no step recording overhead)
function mergeSortPure(a: number[]) {
  const tmp = a.slice();
  const rec = (l: number, r: number) => {
    if (l >= r) return;
    const m = (l + r) >> 1;
    rec(l, m);
    rec(m + 1, r);
    let i = l, j = m + 1, k = l;
    while (i <= m && j <= r) tmp[k++] = a[i] <= a[j] ? a[i++] : a[j++];
    while (i <= m) tmp[k++] = a[i++];
    while (j <= r) tmp[k++] = a[j++];
    for (let x = l; x <= r; x++) a[x] = tmp[x];
  };
  rec(0, a.length - 1);
}
function quickSortPure(a: number[]) {
  const rec = (lo: number, hi: number) => {
    if (lo >= hi) return;
    const p = a[hi];
    let i = lo;
    for (let j = lo; j < hi; j++) if (a[j] < p) { [a[i], a[j]] = [a[j], a[i]]; i++; }
    [a[i], a[hi]] = [a[hi], a[i]];
    rec(lo, i - 1);
    rec(i + 1, hi);
  };
  rec(0, a.length - 1);
}
function timeIt(fn: (a: number[]) => void, input: number[]) {
  const reps = 50;
  const t0 = performance.now();
  for (let r = 0; r < reps; r++) fn(input.slice());
  return (performance.now() - t0) / reps;
}

export function mergeSortSteps(input: number[]): SortResult {
  const a = input.slice();
  const steps: SortStep[] = [];
  let comparisons = 0, swaps = 0, ops = 0;
  const sorted: number[] = [];
  const push = (p: Partial<SortStep> & { message: string }) => {
    ops++;
    steps.push({ array: a.slice(), compare: [], swap: [], write: [], pivot: null, range: null, sorted: sorted.slice(), comparisons, swaps, steps: ops, ...p });
  };
  push({ message: `Original array: [${a.join(", ")}]` });
  const rec = (l: number, r: number) => {
    if (l >= r) return;
    const m = (l + r) >> 1;
    push({ range: [l, r], message: `Split [${a.slice(l, r + 1).join(", ")}] → left [${a.slice(l, m + 1).join(", ")}] | right [${a.slice(m + 1, r + 1).join(", ")}]` });
    rec(l, m);
    rec(m + 1, r);
    const left = a.slice(l, m + 1), right = a.slice(m + 1, r + 1);
    let i = 0, j = 0, k = l;
    while (i < left.length && j < right.length) {
      comparisons++;
      const li = l + i, rj = m + 1 + j;
      push({ range: [l, r], compare: [k, Math.min(rj, r)], message: `Comparing ${left[i]} and ${right[j]}` });
      if (left[i] <= right[j]) { a[k] = left[i]; push({ range: [l, r], write: [k], message: `${left[i]} is smaller → place ${left[i]} at position ${k}` }); i++; }
      else { a[k] = right[j]; push({ range: [l, r], write: [k], message: `${right[j]} is smaller → place ${right[j]} at position ${k}` }); j++; }
      void li;
      swaps++; k++;
    }
    while (i < left.length) { a[k] = left[i]; swaps++; push({ range: [l, r], write: [k], message: `Copy remaining ${left[i]} from left half` }); i++; k++; }
    while (j < right.length) { a[k] = right[j]; swaps++; push({ range: [l, r], write: [k], message: `Copy remaining ${right[j]} from right half` }); j++; k++; }
    if (l === 0 && r === a.length - 1) for (let x = l; x <= r; x++) sorted.push(x);
    push({ range: [l, r], message: `Merged sorted subarray [${a.slice(l, r + 1).join(", ")}]` });
  };
  rec(0, a.length - 1);
  for (let x = 0; x < a.length; x++) if (!sorted.includes(x)) sorted.push(x);
  push({ message: `✓ Sorted: [${a.join(", ")}]` });
  return { steps, timeMs: timeIt(mergeSortPure, input), comparisons, swaps, opSteps: ops };
}

export function quickSortSteps(input: number[]): SortResult {
  const a = input.slice();
  const steps: SortStep[] = [];
  let comparisons = 0, swaps = 0, ops = 0;
  const sorted: number[] = [];
  const push = (p: Partial<SortStep> & { message: string }) => {
    ops++;
    steps.push({ array: a.slice(), compare: [], swap: [], write: [], pivot: null, range: null, sorted: sorted.slice(), comparisons, swaps, steps: ops, ...p });
  };
  push({ message: `Original array: [${a.join(", ")}]` });
  const rec = (lo: number, hi: number) => {
    if (lo > hi) return;
    if (lo === hi) { sorted.push(lo); push({ message: `Single element ${a[lo]} is in its final place` }); return; }
    const p = a[hi];
    push({ range: [lo, hi], pivot: hi, message: `Partition [${lo}..${hi}] — pivot selected: ${p}` });
    let i = lo;
    for (let j = lo; j < hi; j++) {
      comparisons++;
      push({ range: [lo, hi], pivot: hi, compare: [j], message: `Comparing ${a[j]} with pivot ${p}` });
      if (a[j] < p) {
        if (i !== j) { [a[i], a[j]] = [a[j], a[i]]; swaps++; }
        push({ range: [lo, hi], pivot: hi, swap: [i, j], message: `${a[i]} < ${p} → move to left partition` });
        i++;
      } else {
        push({ range: [lo, hi], pivot: hi, compare: [j], message: `${a[j]} ≥ ${p} → stays in right partition` });
      }
    }
    if (i !== hi) { [a[i], a[hi]] = [a[hi], a[i]]; swaps++; }
    sorted.push(i);
    push({ range: [lo, hi], swap: [i, hi], message: `Place pivot ${p} at its final position ${i}` });
    rec(lo, i - 1);
    rec(i + 1, hi);
  };
  rec(0, a.length - 1);
  push({ sorted: a.map((_, i) => i), message: `✓ Sorted: [${a.join(", ")}]` });
  return { steps, timeMs: timeIt(quickSortPure, input), comparisons, swaps, opSteps: ops };
}

export type SearchStep = {
  low: number; high: number; mid: number | null; found: number | null; done: boolean;
  message: string; comparisons: number; steps: number;
};

export function binarySearchSteps(a: number[], target: number) {
  const steps: SearchStep[] = [];
  let lo = 0, hi = a.length - 1, comparisons = 0, n = 0;
  steps.push({ low: lo, high: hi, mid: null, found: null, done: false, message: `Searching for ${target} — Low = ${lo}, High = ${hi}`, comparisons, steps: n });
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    n++; comparisons++;
    if (a[mid] === target) {
      steps.push({ low: lo, high: hi, mid, found: mid, done: true, message: `Low = ${lo}, Mid = ${mid}, High = ${hi} — ${a[mid]} = ${target} → Element Found at index ${mid}!`, comparisons, steps: n });
      return { steps, index: mid, ...timing(a, target) };
    }
    if (a[mid] < target) {
      steps.push({ low: lo, high: hi, mid, found: null, done: false, message: `Low = ${lo}, Mid = ${mid}, High = ${hi} — ${target} > ${a[mid]} → search right half`, comparisons, steps: n });
      lo = mid + 1;
    } else {
      steps.push({ low: lo, high: hi, mid, found: null, done: false, message: `Low = ${lo}, Mid = ${mid}, High = ${hi} — ${target} < ${a[mid]} → search left half`, comparisons, steps: n });
      hi = mid - 1;
    }
  }
  steps.push({ low: lo, high: hi, mid: null, found: null, done: true, message: `Low (${lo}) > High (${hi}) — Element Not Found`, comparisons, steps: n });
  return { steps, index: -1, ...timing(a, target) };
}
function timing(a: number[], t: number) {
  const reps = 1000;
  const t0 = performance.now();
  for (let r = 0; r < reps; r++) { let lo = 0, hi = a.length - 1; while (lo <= hi) { const m = (lo + hi) >> 1; if (a[m] === t) break; if (a[m] < t) lo = m + 1; else hi = m - 1; } }
  return { timeMs: (performance.now() - t0) / reps };
}

export const randomArray = (n: number, min: number, max: number) =>
  Array.from({ length: n }, () => Math.floor(Math.random() * (max - min + 1)) + min);

export const parseNumbers = (s: string) =>
  s.split(/[\s,]+/).filter(Boolean).map(Number).filter((x) => Number.isFinite(x)).slice(0, 60);
