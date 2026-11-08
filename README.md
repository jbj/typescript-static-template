# TypeScript static web template

An accessible hello-world web app with TypeScript, Vite, layered documentation,
bounded verification, and CI-gated GitHub Pages deployment.

[Live example](https://jbj.github.io/typescript-static-template/) ·
[Use this template](https://github.com/jbj/typescript-static-template/generate)

## Start an app

Choose **Use this template** on GitHub to create a repository with its own
history. Clone your new repository, use Node.js 22.12+ (or a supported newer
version), and run:

```sh
npm ci
npm run dev
```

Replace the greeting in `src/main.ts`, styles in `src/style.css`, and page
metadata in `index.html`. Normal browser zoom is enabled. There are no runtime
dependencies, binary assets, or application network services.

## Verify and build

```sh
npm run verify -- --no-cache
npm run build
npm run preview
```

Full verification needs Chrome/Chromium and ImageMagick as well as Node.js.
On Debian or Ubuntu:

```sh
sudo apt-get install chromium imagemagick
```

Set `CHROME_BIN` when your browser has another name. Verification includes
unit tests, TypeScript, lint, formatting, documentation links and context
budgets, bundle budgets, and real-browser root/subpath checks at narrow/wide
sizes. Screenshots and the contact sheet land in `.art/shots/`, not the site.
Bundle thresholds remain explicit in `scripts/check-bundle.mjs`.

## Configure the generated repository

GitHub templates copy files, **not live repository settings**.

1. Rename the package metadata with `npm pkg set name=your-app` and update the
   lockfile with `npm install --package-lock-only`. Replace repository/live links
   in this README and [ruleset instructions](.github/rulesets/README.md), the
   path example in `vite.config.ts`, and the owner in `.github/CODEOWNERS`.
2. Update the working agreement and selected topic guides for your app.
   Keep the original MIT copyright notice when retaining this code; add your
   own attribution where appropriate.
3. Enable GitHub Actions and select **Settings → Pages → Source → GitHub
   Actions**. An administrator may instead configure it with:

   ```sh
   gh api --method POST repos/OWNER/REPO/pages -f build_type=workflow
   # If Pages already exists:
   gh api --method PUT repos/OWNER/REPO/pages -f build_type=workflow
   ```

4. Push the initial app to `main` and wait for **CI / Verify** to succeed.
   Run **Deploy** manually once if its completion trigger was not yet present
   on the default branch. Manual deployment also requires successful push CI
   for that exact main commit.
5. Apply and read back the checked-in
   [main ruleset](.github/rulesets/README.md) after initial publication. Its
   required check is `Verify`; it requires no human approval for a solo
   maintainer. Review CODEOWNERS and the policy before using them in a team.

Publishing is a Pages deployment of the exact successful main push SHA,
not a tagged release or a committed build branch. The workflow token does not
have administration permission and cannot configure Pages or branch rules.
The relative Vite base supports any repository name without rebuilding for
another URL prefix.

## Working agreement

Start with [AGENTS.md](AGENTS.md), which points to the
[working agreement](.github/copilot-instructions.md). It routes contributors to
focused [documentation topics](docs/) and on-demand
[decision records](docs/decisions/README.md).

## Attribution

Derived from [jbj/toddler-puzzle](https://github.com/jbj/toddler-puzzle) at
`4758f2f2d61fb455ca071bd33f95b11f37f7428d`, without importing its Git history.
The original [MIT license and copyright](LICENSE) are retained.
