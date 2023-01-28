import { rm } from "std/node/fs/promises.ts";
import { oneLine } from "common-tags";
import { $, command, logger, Messages } from "../utils/mod.ts";
import { NVM_DIR } from "./_constants.ts";

export const run = async () => {
  const hasNode = await command("node");
  const hasNvm = await command("nvm");

  // you already have Node in your PATH
  if (hasNode) {
    logger.debug(Messages.NODE_INSTALL_NOOP);
  }

  // maybe NVM is setup but Node was never installed
  // very unlikely
  if (!hasNode && hasNvm) {
    logger.debug(Messages.NVM_INSTALL_NOOP);

    try {
      logger.debug(Messages.NODE_INSTALL_START);
      await installNode();
      logger.debug(Messages.NODE_INSTALL_SUCCESS);
    } catch (err) {
      logger.error(Messages.NODE_INSTALL_FAIL);
      logger.error(err as Error);
      Deno.exit(1);
    }
  }

  // most likely
  if (!hasNode && !hasNvm) {
    logger.debug(Messages.NVM_INSTALL_START);
    try {
      await installNvm();
      logger.debug(Messages.NVM_INSTALL_SUCCESS);
    } catch (err) {
      logger.error(Messages.NVM_INSTALL_FAIL);
      logger.error(err as Error);
      Deno.exit(1);
    }

    try {
      logger.debug(Messages.NODE_INSTALL_START);
      await installNode();
      logger.debug(Messages.NODE_INSTALL_SUCCESS);
    } catch (err) {
      logger.error(Messages.NODE_INSTALL_FAIL);
      logger.error(err as Error);
      Deno.exit(1);
    }
  }
};

/**
 * Installs NVM by cloning from GitHub.
 */
async function installNvm(): Promise<void> {
  await rm(NVM_DIR, { recursive: true, force: true });
  await $`git clone https://github.com/nvm-sh/nvm.git ${NVM_DIR} --depth=1 &> /dev/null`;
}

/**
 * Installs the latest Node LTS and sets it as the default version.
 */
async function installNode(): Promise<void> {
  await $(oneLine`
    export NVM_DIR=${NVM_DIR} &&
    export PATH="$NVM_DIR/bin:$PATH" &&
    source $NVM_DIR/nvm.sh --no-use &&
    nvm install --lts &> /dev/null &&
    nvm alias default 'lts/*' > /dev/null`);
}
