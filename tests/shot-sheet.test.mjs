import { spawnSync } from "node:child_process";
import { copyFileSync, mkdirSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

describe("screenshot sheet command", () => {
  it("runs its entrypoint from a path with spaces and reports missing screenshots", () => {
    const root = mkdtempSync(join(tmpdir(), "shot sheet "));
    const scripts = join(root, "scripts");
    try {
      mkdirSync(scripts);
      for (const name of ["shot-sheet.mjs", "tools.mjs"]) {
        copyFileSync(
          fileURLToPath(new URL(`../scripts/${name}`, import.meta.url)),
          join(scripts, name),
        );
      }

      const result = spawnSync(process.execPath, [join(scripts, "shot-sheet.mjs")], {
        env: { ...process.env, IMAGEMAGICK_BIN: process.execPath },
        encoding: "utf8",
      });

      expect(result.error).toBeUndefined();
      expect(result.status).toBe(1);
      expect(result.stderr).toContain("No screenshots");
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });
});
