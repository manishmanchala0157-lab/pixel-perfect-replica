import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SortingVisualizer } from "@/components/viz/SortingVisualizer";
import { SearchVisualizer } from "@/components/viz/SearchVisualizer";
import { Comparison } from "@/components/viz/Comparison";
import { About } from "@/components/viz/About";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sorting & Searching Visualizer — Merge, Quick, Binary Search" },
      { name: "description", content: "Step-by-step interactive visualizer for Merge Sort, Quick Sort and Binary Search with live stats and comparison." },
      { property: "og:title", content: "Sorting & Searching Visualizer" },
      { property: "og:description", content: "Explore algorithms step-by-step and understand how they work." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const tabs = ["Sorting Visualizer", "Searching Visualizer", "Algorithm Comparison", "About Algorithms"] as const;

function Index() {
  const [tab, setTab] = useState<(typeof tabs)[number]>(tabs[0]);
  return (
    <div className="min-h-screen bg-grid">
      <header className="mx-auto max-w-7xl px-4 pt-10 pb-6 sm:px-6">
        <div className="label text-primary">DAA · Interactive Lab</div>
        <h1 className="mt-2 font-display text-4xl text-foreground sm:text-5xl">Sorting &amp; Searching Visualizer</h1>
        <p className="mt-2 text-muted-foreground">Explore algorithms step-by-step and understand how they work</p>
        <nav className="mt-8 flex gap-1 overflow-x-auto border-b border-border">
          {tabs.map((t) => (
            <button key={t} onClick={() => setTab(t)} className={cn("tab", tab === t && "tab-on")}>{t}</button>
          ))}
        </nav>
      </header>
      <main className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 animate-fade-in" key={tab}>
        {tab === tabs[0] && <SortingVisualizer />}
        {tab === tabs[1] && <SearchVisualizer />}
        {tab === tabs[2] && <Comparison />}
        {tab === tabs[3] && <About />}
      </main>
    </div>
  );
}
