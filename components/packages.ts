import { rm } from "std/node/fs/promises.ts";
import { join } from "std/path/mod.ts";

import {
  $,
  command,
  getConfig,
  logger,
  Messages,
  sleep,
} from "../utils/mod.ts";
import { CONFIG_PATH } from "./_constants.ts";
import type { Asset, Release } from "./_types.ts";

const config = getConfig(new URL(CONFIG_PATH, import.meta.url));

export const run = async (): Promise<void> => {
  try {
    if (config.unminimize === true) {
      logger.debug(Messages.PACKAGES_APT_UNMINIMIZE_START);
      await unminimizePackages();
      logger.debug(Messages.PACKAGES_APT_UNMINIMIZE_SUCCESS);
    }
  } catch (err) {
    // don't exit if this fails
    logger.warning(Messages.PACKAGES_APT_UNMINIMIZE_WARNING);
    logger.warning(err as Error);
  }

  try {
    logger.debug(Messages.PACKAGES_APT_INSTALL_START);

    if (config.packages.apt.length > 0) {
      await removeAptTranslations();
      await updateApt();
      await installAptPackages(config.packages.apt);
    }

    logger.debug(Messages.PACKAGES_APT_INSTALL_SUCCESS);
  } catch (err) {
    logger.error(Messages.PACKAGES_APT_INSTALL_FAIL);
    logger.error(err as Error);
    Deno.exit(1);
  }

  try {
    logger.debug(Messages.PACKAGES_DEB_INSTALL_START);

    if (config.packages.github.length > 0) {
      for (const gh of config.packages.github) {
        const bin = gh.bin || gh.repo.split("/").pop() as string;

        if (await command(bin)) continue;

        const asset = await getAssetFromRepoWithArch(
          gh.repo,
          gh.arch,
        );
        await sleep(333);
        await installDebFromAsset(asset);
      }
    }

    logger.debug(Messages.PACKAGES_DEB_INSTALL_SUCCESS);
  } catch (err) {
    logger.error(Messages.PACKAGES_DEB_INSTALL_FAIL);
    logger.error(err as Error);
    Deno.exit(1);
  }
};

/**
 * Checks if the current user is root.
 * The EUID is the "effective user id" of the running process and is read-only.
 */
async function checkSudo(): Promise<boolean> {
  try {
    await $`test "$EUID" -eq 0`;
    return true;
  } catch {
    return false;
  }
}

/**
 * Update apt to not download additional languages and also delete any existing languages.
 * Should be run after unminimize.
 */
async function removeAptTranslations(): Promise<void> {
  const sudo = await checkSudo() ? "" : "sudo ";
  await $`${sudo}mkdir -p /etc/apt/apt.conf.d`;

  try {
    await $`test -f /etc/apt/apt.conf.d/99translations`;
  } catch {
    await $`echo 'Acquire::Languages "none";' | ${sudo}tee /etc/apt/apt.conf.d/99translations > /dev/null`;
    await $`${sudo}rm -rf /var/lib/apt/lists/*`;
  }
}

/**
 * Update apt.
 * Run this before any script that installs packages.
 */
async function updateApt(): Promise<void> {
  const sudo = await checkSudo() ? "" : "sudo ";
  await $`${sudo}apt-get update &> /dev/null`;
  await $`${sudo}apt-get upgrade -y &> /dev/null`;
}

/**
 * Because this is a container, many packages you'd find in a full Ubuntu
 * installation are not included. For example, vim is not installed and there
 * are no manpages. Running `unminimize` will make the container more like a
 * standard Ubuntu installation.
 * @see {@link https://wiki.ubuntu.com/Minimal}
 */
async function unminimizePackages(): Promise<void> {
  const sudo = await checkSudo() ? "" : "sudo ";
  await $`echo y | ${sudo}unminimize &> /dev/null`;
}

/**
 * Installs a list of apt packages.
 */
async function installAptPackages(packages: string[]): Promise<void> {
  if (packages.length < 1) return;
  const sudo = await checkSudo() ? "" : "sudo ";
  await $`${sudo}apt-get install -y ${packages.join(" ")} &> /dev/null`;
}

/**
 * Fetches the latest release from a GitHub repository and return the asset for
 * the specified architecture.
 * @throws {Error}
 */
async function getAssetFromRepoWithArch(
  repo: string,
  arch = "amd64",
): Promise<Asset> {
  const res1 = await fetch(
    `https://api.github.com/repos/${repo}/releases/latest`,
  );
  const { assets_url: assetsUrl } = await res1.json() as Release;

  // sleep since we are firing off two requests and this is going to be executed in a loop
  await sleep(333);

  const res2 = await fetch(assetsUrl);
  const assets = await res2.json();

  const asset = assets.find((asset: Asset) =>
    asset.name.endsWith(`${arch}.deb`)
  );

  if (!asset) {
    throw new Error(`Could not find asset in latest ${repo} release`);
  }

  return asset;
}

/**
 * Download and install the Debian package archive from a GitHub release asset.
 * Prefer deb archives over pre-compiled binaries (when possible) as they are
 * easier to maintain.
 */
async function installDebFromAsset(asset: Asset): Promise<void> {
  const sudo = await checkSudo() ? "" : "sudo ";

  const { browser_download_url: browserDownloadUrl } = asset;
  const filename = browserDownloadUrl.split("/").pop() as string;

  const res = await fetch(browserDownloadUrl);
  const arrayBuffer = await res.arrayBuffer();
  const buffer = new Uint8Array(arrayBuffer);

  await Deno.writeFile(`/tmp/${filename}`, buffer);
  await $`${sudo}dpkg -i /tmp/${filename} &> /dev/null`;
  await rm(join("/tmp", filename), { force: true });
}
