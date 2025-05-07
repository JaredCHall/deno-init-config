import {fileExists, promptUser, validateGitHubPath, validateJsrPath} from "./helpers.ts";
import {buildConfig} from "./build-config.ts";
import {CommandError} from "./types.ts";

/** Options for the generateDenoConfig command */
export interface makeConfigCommandOptions {
  /** The format of the output file: json or jsonc */
  format: string
  /** Overwrite the file if it exists */
  force?: boolean
  /** return the output instead of writing to file */
  dryRun?: boolean
}

/** Injections for the generateDenoConfig command (for testing) */
export interface MakeConfigCommandInjections {
  promptFn: typeof promptUser
  writeFn: typeof Deno.writeTextFile
  logFn: typeof console.log
  fileExistsFn: typeof fileExists
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
    options: makeConfigCommandOptions = {format: 'jsonc', force: false, dryRun: false},
    injects: MakeConfigCommandInjections = {
      promptFn: promptUser,
      writeFn: Deno.writeTextFile,
      logFn: console.log,
      fileExistsFn: fileExists
    }
): Promise<string>
{

  const {format, force, dryRun} = options
  const {promptFn, writeFn, logFn, fileExistsFn} = injects

  if (format !== "json" && format !== "jsonc") {
    throw new CommandError(`Invalid format: "${format}". Use "json" or "jsonc".`);
  }

  const outputPath = `./deno.${format}`
  if (!dryRun && !force && await fileExistsFn(outputPath)) {
    throw new CommandError(`${outputPath} already exists. Use --force to overwrite.`)
  }

  const jsrPath = promptFn('Enter the future JSR path of the project: ', validateJsrPath)
  const githubPath = promptFn('Enter the GitHub path of the project: ', validateGitHubPath)
  const description = promptFn('Enter a short description of the project: ')
  const config = buildConfig({jsrPath, githubPath, description})

  const configText = JSON.stringify(config, null, 2)
  if(dryRun){
    logFn(configText)
    return outputPath
  }

  await writeFn(outputPath, configText)

  return outputPath
}
