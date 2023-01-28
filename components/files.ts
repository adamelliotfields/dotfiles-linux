import { ensureDir, ensureSymlink } from "std/fs/mod.ts";
import { basename, dirname, join } from "std/path/mod.ts";
import { EOL } from "std/node/os.ts";
import { pathToFileURL } from "std/node/url.ts";
import { oneLine } from "common-tags";

import { $, logger, Messages } from "../utils/mod.ts";
import { HOME_PATH, PUBLIC_PATH } from "./_constants.ts";

const PUBLIC_URL = new URL(PUBLIC_PATH, import.meta.url);
const HOME_URL = pathToFileURL(HOME_PATH);

export const run = async (): Promise<void> => {
  try {
    logger.debug(Messages.FILES_LINKING_START);
    const filePaths = await getFilesFromPublic();

    for (const filePath of filePaths) {
      await linkFileFromPublicToHome(filePath);
    }

    logger.debug(Messages.FILES_LINKING_SUCCESS);
  } catch (err) {
    logger.error(Messages.FILES_LINKING_FAIL);
    logger.error(err as Error);
    Deno.exit(1);
  }
};

/**
 * Gets a list of file paths from `public`. Using `find` because it it recurses
 * into subfolders like `.config`.
 */
async function getFilesFromPublic(): Promise<string[]> {
  const { pathname } = PUBLIC_URL;
  const { stdout } = await $`find ${pathname} -type f`;
  return stdout.split(EOL);
}

/**
 * Symlink the file from `public` to the home directory. Creates the necessary
 * folder structure if it doesn't exist prior to symlinking.
 */
async function linkFileFromPublicToHome(file: string): Promise<void> {
  const fileBasename = basename(file);
  const fileDirname = dirname(file);
  const { pathname: publicPath } = PUBLIC_URL;
  const { pathname: homePath } = HOME_URL;

  // if the file is ~/.config/foo/bar.txt
  // then we want to create ~/.config/foo
  const homeFileDir = join(
    homePath,
    fileDirname.replace(publicPath, ""),
  );
  const homeFilePath = join(homeFileDir, fileBasename);

  // create the directory if it doesn't exist
  await ensureDir(homeFileDir);

  // check the file exists and is not a symlink and then move it to a backup
  try {
    await $(oneLine`
      test -f ${homeFilePath} &&
      ! test -L ${homeFilePath} &&
      mv -f ${homeFilePath} ${homeFilePath}.bak`);
  } catch { /**/ }

  await ensureSymlink(file, homeFilePath);
}
