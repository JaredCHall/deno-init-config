import {promptUser, validateGitHubPath, validateJsrPath} from "./helpers.ts";
import {buildConfig} from "./build-config.ts";
import {CommandError} from "./types.ts";

/** Options for the generateDenoConfig command */
export interface makeConfigCommandOptions {
  /** The format of the output file: json or jsonc */
  format: string
  /** return the output instead of writing to file */
  dryRun?: boolean
}

/** Injections for the generateDenoConfig command (for testing) */
export interface MakeConfigCommandInjections {
  promptFn: typeof promptUser
  writeFn: typeof Deno.writeTextFile
  logFn: typeof console.log
}

/**
 * Generate a deno.json config file
 * - prompts the user for input
 * - prints to console if dryRun is true
 * - writes to file if dryRun is false
 *
 * @returns the path to the generated file
 */
export async function makeConfigCommand(
    options: makeConfigCommandOptions = {format: 'jsonc'},
    injects: MakeConfigCommandInjections = {
      promptFn: promptUser,
      writeFn: Deno.writeTextFile,
      logFn: console.log,
    }
): Promise<string>
{

  if (options.format !== "json" && options.format !== "jsonc") {
    throw new CommandError(`Invalid format: "${options.format}". Use "json" or "jsonc".`);
  }

  const jsrPath = injects.promptFn('Enter the future JSR path of the project: ', validateJsrPath)
  const githubPath = injects.promptFn('Enter the GitHub path of the project: ', validateGitHubPath)
  const description = injects.promptFn('Enter a short description of the project: ')
  const config = buildConfig({jsrPath, githubPath, description})
  const configText = JSON.stringify(config, null, 2)
  const fileName = `./deno.${options.format}`

  if(options.dryRun){
    injects.logFn(configText)
    return fileName
  }

  // write the file
  await injects.writeFn(fileName, JSON.stringify(config, null, 2))

  return fileName
}
