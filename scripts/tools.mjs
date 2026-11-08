/** Resolve ImageMagick 6/7 for the screenshot contact sheet. */
import { execFileSync } from "node:child_process";

function have(binary) {
  try {
    execFileSync("/bin/sh", ["-c", 'command -v -- "$1"', "sh", binary], { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

let binary;
function imagemagick() {
  if (binary === undefined) {
    binary = process.env.IMAGEMAGICK_BIN ?? ["magick", "convert"].find(have) ?? null;
  }
  return binary;
}

export const haveImageMagick = () => imagemagick() !== null;

export function requireImageMagick() {
  if (!haveImageMagick()) {
    throw new Error(
      "Cannot find ImageMagick. On Debian or Ubuntu: sudo apt-get install imagemagick",
    );
  }
}

export function magick(args) {
  requireImageMagick();
  return execFileSync(imagemagick(), args);
}
