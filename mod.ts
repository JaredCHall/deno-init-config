export type { DenoConfig } from "./src/types.ts";
export { validateJsrPath, validateGitHubPath } from "./src/helpers.ts";
export { generateDenoConfigObject, makeDenoConfigCommand } from "./src/core.ts";

// CLI entrypoint
if (import.meta.main) {
  const [{ makeDenoConfigCommand }, { parse }] = await Promise.all([
    import("./src/core.ts"),
    import("@std/flags")
  ])

  const args = parse(Deno.args, {
    string: ["format"],
    boolean: ["dry-run"],
    default: { format: "jsonc", "dry-run": false},
  });

  try{
    const output = await makeDenoConfigCommand({
      format: args.format,
      dryRun: args["dry-run"],
    })

    console.log(`%c✅ ${output} generated.`, 'color:limegreen');
    Deno.exit(0);

  }catch(err){
    console.error('%c❌ %s', 'color:indianred', err instanceof Error ? err.message : String(err));
    Deno.exit(1);
  }
}
