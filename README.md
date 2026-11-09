# Your first web app

This template gives you a simple web page to explore and change. You do not
need to know Git or GitHub to get started. GitHub is where your project lives;
the Copilot App is where you can open and work on it.

[See the live example](https://OWNER.github.io/REPO/) ·
[Create your own copy](https://github.com/OWNER/REPO/generate)

## Start in the Copilot App

1. On GitHub, choose **Create your own copy** (or **Use this template**) and
   create a repository for your project.
2. Open that new repository in the Copilot App.
3. Install [Node.js 22.12 or newer](https://nodejs.org/en/download/) on your
   Windows laptop. Node.js is the tool that runs this project. If the
   Copilot App was open during installation, reopen its terminal.
4. In the Copilot App terminal, run these commands:

   ```powershell
   npm ci
   npm run dev
   ```

   `npm ci` sets up the tools for this project. You only need it the first time
   (or after the project's tools change). `npm run dev` starts your web page on
   your laptop. Open the address printed in the terminal, usually
   `http://localhost:5173/`. Leave the command running while you work; press
   **Ctrl+C** in the terminal when you are done.

5. Open `src/main.ts` in the editor and change the greeting. Save the file to
   see the page update in your browser. You can change its colors and layout in
   `src/style.css`, and its browser-tab title in `index.html`.

The page works on small screens, supports normal browser zoom, and has no
application services to set up.

## When you are ready for more

Run `npm run verify` to check the project, or `npm run build` to make its
publishable files. Full verification works on Windows and Linux and needs
Chrome or Chromium; setup details are in the
[code guide](docs/code.md#local-and-ci-environments). GitHub also runs the
checks for you when you make a change. The normal checks run on Linux even if
you are working on Windows; maintainers can manually run Windows verification to
check Windows too.

## For repository maintainers

GitHub templates copy files, **not live repository settings**.

1. Rename the package with `npm pkg set name=your-app`, then update the lockfile
   with `npm install --package-lock-only`. Replace `OWNER` and `REPO` in this
   README and [ruleset instructions](.github/rulesets/README.md), the path
   example in `vite.config.ts`, and the owner in `.github/CODEOWNERS`.
2. Update the [working agreement](.github/copilot-instructions.md) and selected
   [documentation topics](docs/) for your app. Keep the original MIT copyright
   notice when retaining this code; add your own attribution where appropriate.
3. Enable GitHub Actions and select **Settings → Pages → Source → GitHub
   Actions**. An administrator may instead configure it with:

   ```powershell
   gh api --method POST repos/OWNER/REPO/pages -f build_type=workflow
   # If Pages already exists:
   gh api --method PUT repos/OWNER/REPO/pages -f build_type=workflow
   ```

4. Push the initial app to `main` and wait for **CI / Verify** to succeed. Run
   **Deploy** manually once if its completion trigger was not yet present on
   the default branch. Manual deployment also requires successful push CI for
   that exact `main` commit.
5. Apply and read back the checked-in
   [main ruleset](.github/rulesets/README.md) after initial publication. Its
   required check is `Verify`; it requires no human approval for a solo
   maintainer. Review CODEOWNERS and the policy before using them in a team.

Publishing deploys the exact successful `main` push commit to GitHub Pages; it
is not a tagged release or a committed build branch. The workflow token cannot
configure Pages or branch rules. The relative Vite base supports any
repository name without rebuilding for another URL prefix.

## Working agreement

Start with [AGENTS.md](AGENTS.md), which points to the
[working agreement](.github/copilot-instructions.md). It routes contributors
to focused [documentation topics](docs/) and on-demand
[decision records](docs/decisions/README.md).

## Attribution

Derived from [jbj/toddler-puzzle](https://github.com/jbj/toddler-puzzle) at
`4758f2f2d61fb455ca071bd33f95b11f37f7428d`, without importing its Git history.
The original [MIT license and copyright](LICENSE) are retained.
