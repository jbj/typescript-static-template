import { describe, expect, it } from "vitest";

import { resolveChromeExecutable } from "../scripts/chrome.mjs";
import { resolveImageMagick } from "../scripts/tools.mjs";

describe("browser executable discovery", () => {
  it("uses the configured browser path on either platform", () => {
    expect(
      resolveChromeExecutable({
        platform: "win32",
        env: { CHROME_BIN: "D:\\Browsers\\chrome.exe" },
      }),
    ).toBe("D:\\Browsers\\chrome.exe");
  });

  it("uses Chromium by default on Linux", () => {
    expect(resolveChromeExecutable({ platform: "linux", env: {} })).toBe("chromium");
  });

  it("finds Chrome in the standard Windows installation folders", () => {
    const installedChrome = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

    expect(
      resolveChromeExecutable({
        platform: "win32",
        env: {
          PROGRAMFILES: "C:\\Program Files",
          LOCALAPPDATA: "C:\\Users\\Student\\AppData\\Local",
        },
        exists: (path) => path === installedChrome,
      }),
    ).toBe(installedChrome);
  });

  it("falls back to the Windows PATH command", () => {
    expect(resolveChromeExecutable({ platform: "win32", env: {}, exists: () => false })).toBe(
      "chrome.exe",
    );
  });
});

describe("ImageMagick discovery", () => {
  it("checks Windows executable names and selects the first working command", () => {
    const tried = [];

    const binary = resolveImageMagick({
      platform: "win32",
      env: {},
      supports: (candidate) => {
        tried.push(candidate);
        return candidate === "magick";
      },
    });

    expect(tried).toEqual(["magick.exe", "magick"]);
    expect(binary).toBe("magick");
  });

  it("checks Linux commands without requiring a shell", () => {
    const tried = [];

    const binary = resolveImageMagick({
      platform: "linux",
      env: {},
      supports: (candidate) => {
        tried.push(candidate);
        return candidate === "convert";
      },
    });

    expect(tried).toEqual(["magick", "convert"]);
    expect(binary).toBe("convert");
  });

  it("honors an explicit ImageMagick path", () => {
    expect(
      resolveImageMagick({
        platform: "win32",
        env: { IMAGEMAGICK_BIN: "C:\\ImageMagick\\magick.exe" },
        supports: () => {
          throw new Error("should not probe the PATH");
        },
      }),
    ).toBe("C:\\ImageMagick\\magick.exe");
  });
});
