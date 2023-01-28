import { parse } from "std/encoding/yaml.ts";

interface Prompt {
  repo: string;
  branch?: string;
  dest?: string;
}

export interface Config {
  unminimize: boolean;
  prompt: {
    zsh: Prompt;
    bash: Prompt;
  };
  packages: {
    apt: string[];
    github: {
      bin?: string;
      repo: string;
      arch: string;
    }[];
  };
}

/**
 * Get the config object from a config file.
 * @example
 * ```ts
 * const config = getConfig(new URL("../config.yml", import.meta.url));
 * ```
 */
export default function getConfig(file: string | URL): Config {
  const configRaw = Deno.readTextFileSync(file);
  return parse(configRaw) as Config;
}
