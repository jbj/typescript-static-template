import { describe, expect, it } from "vitest";

import { BUDGET, measureBundle } from "../scripts/check-bundle.mjs";

const file = (name, fields = {}) => ({
  file: name,
  bytes: 100,
  gzip: 30,
  isEntry: false,
  imports: [],
  dynamicImports: [],
  css: [],
  ...fields,
});

describe("bundle budgets", () => {
  it("preserves the inherited raw and gzip ceilings", () => {
    expect(BUDGET).toEqual({
      initialRaw: 120000,
      initialGzip: 40000,
      totalRaw: 194000,
      totalGzip: 66000,
    });
  });

  it("counts static imports, CSS and HTML once, leaving dynamic chunks deferred", () => {
    const result = measureBundle({
      files: [
        file("entry.js", {
          isEntry: true,
          imports: ["shared.js"],
          css: ["main.css"],
          dynamicImports: ["later.js"],
        }),
        file("shared.js", { imports: ["entry.js"], css: ["main.css"] }),
        file("main.css"),
        file("index.html"),
        file("later.js"),
      ],
    });
    expect(result.initial.map(({ file }) => file)).toEqual([
      "entry.js",
      "shared.js",
      "main.css",
      "index.html",
    ]);
    expect(result.deferred.map(({ file }) => file)).toEqual(["later.js"]);
    expect(result.measurements).toEqual({
      initialRaw: 400,
      initialGzip: 120,
      totalRaw: 500,
      totalGzip: 150,
    });
  });

  it("counts every entry in a multi-entry app", () => {
    expect(
      measureBundle({
        files: [file("one.js", { isEntry: true }), file("two.js", { isEntry: true })],
      }).measurements.initialRaw,
    ).toBe(200);
  });

  it("rejects empty discovery and broken static references", () => {
    expect(() => measureBundle({ files: [] })).toThrow("no entry chunk");
    expect(() =>
      measureBundle({ files: [file("entry.js", { isEntry: true, imports: ["missing.js"] })] }),
    ).toThrow("missing asset missing.js");
  });
});
