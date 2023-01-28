/**
 * Check if a command exists in PATH.
 */
export default async function command(cmd: string): Promise<boolean> {
  const p = Deno.run({
    cmd: ["/usr/bin/env", "bash", "-c", `command -v ${cmd}`],
    stdout: "null",
    stderr: "null",
  });

  // need to wait for status to know the command has finished
  const status = await p.status();

  p.close();

  return status.code === 0;
}
