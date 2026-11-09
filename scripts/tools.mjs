/** Resolve ImageMagick 6/7 for the screenshot contact sheet. */
import { execFileSync } from "node:child_process";

function isImageMagick(binary) {
  try {
    const version = execFileSync(binary, ["-version"], { encoding: "utf8" });
    return /ImageMagick/i.test(version);
  } catch {
    return false;
  }
}

export function resolveImageMagick({
  platform = process.platform,
  env = process.env,
  supports = isImageMagick,
} = {}) {
  if (env.IMAGEMAGICK_BIN) return env.IMAGEMAGICK_BIN;

  const candidates =
    platform === "win32"
      ? ["magick.exe", "magick", "convert.exe", "convert"]
      : ["magick", "convert"];
  return candidates.find(supports) ?? null;
}

let binary;
function imagemagick() {
  if (binary === undefined) {
    binary = resolveImageMagick();
  }
  return binary;
}

export const haveImageMagick = () => imagemagick() !== null;

export function requireImageMagick() {
  if (!haveImageMagick()) {
    throw new Error(
      "Cannot find ImageMagick. On Debian or Ubuntu: sudo apt-get install imagemagick. " +
        "On Windows, install ImageMagick and make sure magick.exe is on PATH, or set IMAGEMAGICK_BIN.",
    );
  }
}

export function magick(args) {
  requireImageMagick();
  return execFileSync(imagemagick(), args);
}
