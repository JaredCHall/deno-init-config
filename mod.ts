export type { DenoConfig } from "./src/types.ts";
export { validateJsrPath, validateGitHubPath } from "./src/helpers.ts";
export { generateDenoConfigObject, generateDenoConfig } from "./src/core.ts";
import { generateDenoConfig } from "./src/core.ts";
import { parse } from "@std/flags";

// CLI entrypoint
if (import.meta.main) {
  const args = parse(Deno.args, {
    string: ["format"],
    boolean: ["force","dry-run"],
    default: { format: "jsonc" , force: true, "dry-run": false},
  });

  try{
    const output = await generateDenoConfig({
      format: args.format,
      force: args.force,
      dryRun: args["dry-run"],
    })

    if(args["dry-run"]){
      console.log(output)
    }else{
      console.log(`%c✅ ${output} generated.`, 'color:limegreen');
    }
    Deno.exit(0);

  }catch(err){
    console.error('%c❌ %s', 'color:indianred', err instanceof Error ? err.message : String(err));
    Deno.exit(1);
  }
}
