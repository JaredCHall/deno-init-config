export type { DenoConfig } from "./src/types.ts";
export { validateJsrPath, validateGitHubPath } from "./src/helpers.ts";
export { makeConfigCommand } from "./src/make-config-command.ts";
export { buildConfig } from "./src/build-config.ts";

if (import.meta.main) {
  const { makeDenoConfigCli } = await import("./src/cli.ts");
  await makeDenoConfigCli();
}
