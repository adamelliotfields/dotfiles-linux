import { Endpoints } from "@octokit/types";

export type Release =
  Endpoints["GET /repos/{owner}/{repo}/releases/latest"]["response"]["data"];

// deno-fmt-ignore
export type Asset =
  Endpoints["GET /repos/{owner}/{repo}/releases/assets/{asset_id}"]["response"]["data"];
