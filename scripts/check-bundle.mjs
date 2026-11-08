/**
 * Budgets the actual Vite import graph, including initial HTML and CSS.
 * The report stays in .art/, never in the published site.
 */
import { readFileSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";

import { createReport } from "./report.mjs";

const REPORT = fileURLToPath(new URL("../.art/bundle.json", import.meta.url));
const REPORT_NAME = ".art/bundle.json";
const kB = 1000;

// Preserve the source template's limits. Growth needs an explicit explanation,
// not a quiet budget increase to turn a failing build green.
export const BUDGET = {
  initialRaw: 120 * kB,
  initialGzip: 40 * kB,
  totalRaw: 194 * kB,
  totalGzip: 66 * kB,
};

export function measureBundle(report) {
  const byFile = new Map(report.files.map((file) => [file.file, file]));
  const entries = report.files.filter((file) => file.isEntry);
  if (entries.length === 0) throw new Error("The bundle report contains no entry chunk.");
  const initialNames = new Set();
  const queue = entries.map((entry) => entry.file);
  while (queue.length > 0) {
    const name = queue.pop();
    if (initialNames.has(name)) continue;
    const file = byFile.get(name);
    if (!file) throw new Error(`The bundle report references missing asset ${name}.`);
    initialNames.add(name);
    queue.push(...file.imports, ...file.css);
  }
  for (const file of report.files) {
    if (file.file.endsWith(".html")) initialNames.add(file.file);
  }
  const initial = report.files.filter((file) => initialNames.has(file.file));
  const sum = (files, key) => files.reduce((total, file) => total + file[key], 0);
  return {
    initial,
    deferred: report.files.filter((file) => !initialNames.has(file.file)),
    measurements: {
      initialRaw: sum(initial, "bytes"),
      initialGzip: sum(initial, "gzip"),
      totalRaw: sum(report.files, "bytes"),
      totalGzip: sum(report.files, "gzip"),
    },
  };
}

function main() {
  const result = createReport("bundle budget");
  let report;
  try {
    report = JSON.parse(readFileSync(REPORT, "utf8"));
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
    result.check(REPORT_NAME, "bundle report exists", "missing; run `npm run build` first");
    result.finish();
    return;
  }
  const { initial, deferred, measurements } = measureBundle(report);
  const size = (bytes) => `${(bytes / kB).toFixed(1)} kB`;
  for (const [label, files] of [
    ["loaded first", initial],
    ["deferred", deferred],
  ]) {
    result.detail(label);
    for (const file of files) {
      result.detail(`  ${file.file}: ${size(file.bytes)} raw, ${size(file.gzip)} gzipped`);
    }
  }
  const over = [];
  for (const [label, used] of Object.entries(measurements)) {
    const budget = BUDGET[label];
    if (used > budget) over.push(label);
    result.check(
      REPORT_NAME,
      `${label}: ${size(used)} of ${size(budget)}`,
      used <= budget ? [] : `${size(used - budget)} over budget`,
    );
  }
  if (over.length > 0) {
    const files = over.some((label) => label.startsWith("initial")) ? initial : report.files;
    result.detail("Largest modules (before minification; comparable, not additive):");
    for (const module of files
      .flatMap((file) => file.modules.map((module) => ({ ...module, file: file.file })))
      .sort((a, b) => b.bytes - a.bytes)
      .slice(0, 6)) {
      result.detail(`  ${module.id}: ${size(module.bytes)} in ${module.file}`);
    }
    result.detail("Reduce the bundle, or explain in the pull request why a budget must change.");
  }
  result.finish("Within budget.");
}

if (process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url) main();
