import { stripIndent } from "common-tags";

export interface ProcessOutput {
  // stdout with the final newline trimmed
  stdout: string;
}

/**
 * Execute a command.
 * Wraps the command and executes it in a new Bash shell. Inspired by google/zx.
 * @example
 * ```ts
 * const message = "hello world";
 * $`echo ${message}`;
 * ```
 * @example
 * ```ts
 * import { oneLine } from "common-tags";
 * $(oneLine`
 *   some
 *   long
 *   command`)
 * ```
 */
export default async function $(
  template: string | TemplateStringsArray,
  ...values: string[]
): Promise<ProcessOutput> {
  /* Command can be a template literal or a string, so they have to be handled
   * differently. If it is a template literal, then we have to loop over the
   * values and insert them into the template. For example, if the template is
   * `echo ${greeting} ${message}`, then `values[0]` is `greeting` and
   * `values[1]` is `message`.
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals */
  const command = typeof template === "string" // can't reduce a string
    ? template
    : template.reduce((acc, str, i) => acc + str + (values[i] || ""), "");
  const wrappedCommand = wrap(command);

  const p = Deno.run({
    cmd: ["/usr/bin/env", "bash", "-c", wrappedCommand],
    stdout: "piped",
    stderr: "piped",
  });

  const [status, output, error] = await Promise.all([
    p.status(),
    p.output(),
    p.stderrOutput(),
  ]);

  p.close();

  if (status.code !== 0) {
    throw new Error(new TextDecoder().decode(error).trim());
  }

  const stdout = new TextDecoder().decode(output).trim();

  return {
    stdout,
  };
}

/**
 * Wraps a command in a bash script.
 * @example
 * ```ts
 * const wrappedCmd = wrap(someCommand);
 * Deno.run({ cmd: ["bash", "-c", wrappedCmd] });
 * ```
 */
function wrap(cmd: string | TemplateStringsArray): string {
  return stripIndent`
    set -euo pipefail
    ${cmd}
    exit $?
  ` as string;
}
