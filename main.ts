import {
  apt,
  clone,
  type CloneOptions,
  files,
  github,
  type GitHubOptions,
  nvm,
} from "@adamelliotfields/dotfiles";

const DOTFILES_DIR = "home";

const PROMPT: [string, CloneOptions] = ["nojhan/liquidprompt", {
  branch: "stable",
}];

const APT_PACKAGES = ["git-extras", "ripgrep", "shellcheck", "vim"];

const DEB_PACKAGES: [string, GitHubOptions | undefined][] = [
  ["cli/cli", { bin: "gh", arch: "linux_amd64" }],
  ["sharkdp/bat", undefined],
  ["sharkdp/fd", undefined],
  ["dandavison/delta", undefined],
  ["peltoche/lsd", undefined],
  ["ajeetdsouza/zoxide", undefined],
];

// Apt packages
try {
  console.log(`⏳ Installing ${APT_PACKAGES.length} APT packages...`);
  const time = await apt(APT_PACKAGES);
  console.log(`👍 Done! (${time}ms)`);
} catch (err) {
  console.error("🚨 Failed to install APT packages!");
  console.error(err);
  Deno.exit(1);
}

// Deb packages from GitHub
try {
  console.log(
    `⏳ Installing ${DEB_PACKAGES.length} Debian packages from GitHub...`,
  );
  const start = performance.now();
  for (const deb of DEB_PACKAGES) {
    await github(...deb);
    console.log(`✅ ${deb[0]}`);
  }
  const end = performance.now();
  console.log(`👍 Done! (${Math.trunc(end - start)}ms)`);
} catch (err) {
  console.error("🚨 Failed to install Debian packages!");
  console.error(err);
  Deno.exit(1);
}

// nvm with Node LTS
try {
  console.log("⏳ Installing nvm and Node LTS...");
  const time = await nvm();
  console.log(`👍 Done! (${time}ms)`);
} catch (err) {
  console.error("🚨 Failed to install nvm!");
  console.error(err);
  Deno.exit(1);
}

// Prompt
try {
  console.log(`⏳ Installing ${PROMPT[0]}...`);
  const time = await clone(...PROMPT);
  console.log(`👍 Done! (${time}ms)`);
} catch (err) {
  console.error("🚨 Failed to install prompt!");
  console.error(err);
  Deno.exit(1);
}

// Dotfiles
try {
  console.log("⏳ Symlinking dotfiles...");
  const { pathname } = new URL(DOTFILES_DIR, import.meta.url);
  const time = await files(pathname);
  console.log(`👍 Done! (${time}ms)`);
} catch (err) {
  console.error("🚨 Failed to symlink dotfiles!");
  console.error(err);
  Deno.exit(1);
}

Deno.exit(0);
