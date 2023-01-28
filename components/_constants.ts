import { homedir } from "std/node/os.ts";

export const CONFIG_PATH = "../config.yml" as const;

export const PUBLIC_PATH = "../public" as const;

export const HOME_PATH = homedir() as string;

export const NVM_DIR = `${HOME_PATH}/.nvm` as const;
