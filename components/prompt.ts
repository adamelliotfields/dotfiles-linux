import { $, getConfig, logger, Messages } from "../utils/mod.ts";
import { CONFIG_PATH } from "./_constants.ts";

const config = getConfig(new URL(CONFIG_PATH, import.meta.url));

export const run = async (): Promise<void> => {
  const { bash, zsh } = config.prompt;

  logger.debug(Messages.PROMPT_INSTALL_START);

  // Bash prompt
  try {
    const dest = bash.dest ?? bash.repo.split("/").at(-1) as string;
    await $`test -d ${dest}`;
    logger.debug(Messages.PROMPT_INSTALL_BASH_READY);
  } catch {
    try {
      await cloneRepo(
        `https://github.com/${bash.repo}`,
        bash.branch,
        bash.dest,
      );
      logger.debug(Messages.PROMPT_INSTALL_BASH_READY);
    } catch (err) {
      logger.error(Messages.PROMPT_INSTALL_BASH_FAIL);
      logger.error(err as Error);
      Deno.exit(1);
    }
  }

  // Zsh prompt
  try {
    const dest = zsh.dest ?? zsh.repo.split("/").at(-1) as string;
    await $`test -d ${dest}`;
    logger.debug(Messages.PROMPT_INSTALL_ZSH_READY);
  } catch {
    try {
      await cloneRepo(
        `https://github.com/${zsh.repo}`,
        zsh.branch,
        zsh.dest,
      );
      logger.debug(Messages.PROMPT_INSTALL_ZSH_READY);
    } catch (err) {
      logger.error(Messages.PROMPT_INSTALL_ZSH_FAIL);
      logger.error(err as Error);
      Deno.exit(1);
    }
  }

  logger.debug(Messages.PROMPT_INSTALL_SUCCESS);
};

/**
 * Clones a Git repository.
 */
async function cloneRepo(
  repo: string,
  branch?: string,
  dir?: string,
): Promise<void> {
  const b = branch && branch.length > 0 ? `--branch=${branch} ` : "";
  const d = dir && dir.length > 0 ? `${dir} ` : "";
  await $`git clone ${repo} ${d}${b}--depth 1 > /dev/null`;
}
