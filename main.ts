import * as files from "./components/files.ts";
import * as node from "./components/node.ts";
import * as packages from "./components/packages.ts";
import * as prompt from "./components/prompt.ts";

// each one of these calls Deno.exit(1) if it fails
await node.run();
await packages.run();
await prompt.run();
await files.run();

Deno.exit(0);
