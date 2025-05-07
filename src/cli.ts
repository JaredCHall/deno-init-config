import { makeConfigCommand } from "./make-config-command.ts";
import { parse } from "@std/flags"
import {fileExists, promptUser} from "./helpers.ts";
import {CommandError} from "./types.ts";

const USAGE = `Usage:
  deno run --allow-read[ --allow-write] mod.ts [options]

Permissions:
  --allow-write     Required unless --dry-run is used

Options:
  --format          Output format: "json" or "jsonc" (default: "jsonc")
  --dry-run         Print the config to stdout instead of writing to file
  --help            Show this help message`

/** Injections for the makeDenoConfigCli command (for testing) */
export interface MakeDenoConfigCliInjections {
  logFn: typeof console.log
  errFn: typeof console.error
  exitFn: typeof Deno.exit
  makeFn: typeof makeConfigCommand
  args: typeof Deno.args
}

/** CLI entrypoint for the makeDenoConfigCommand */
export async function makeDenoConfigCli(injects: MakeDenoConfigCliInjections = {
  logFn: console.log,
  errFn: console.error,
  exitFn: Deno.exit,
  makeFn: makeConfigCommand,
  args: Deno.args,
}): Promise<void> {

  const args = parse(injects.args, {
    string: ["format"],
    boolean: ["dry-run", "help", "force"],
    default: { format: "jsonc", "dry-run": false, help: false, force: false }
  })

  if (args.help) {
    injects.logFn(USAGE)
    return injects.exitFn(0)
  }

  try {
    const output = await injects.makeFn({
      format: args.format,
      dryRun: args["dry-run"],
    },{
      logFn: injects.logFn,
      writeFn: Deno.writeTextFile,
      promptFn: promptUser,
      fileExistsFn: fileExists
    })
    injects.logFn(`%c✅ ${output} generated.`, 'color:limegreen')
    return injects.exitFn(0)
  } catch (err) {
   if(err instanceof CommandError){
     injects.errFn('%c❌ %s', 'color:indianred', err.message)
     return injects.exitFn(1)
   }
   throw err
  }
}