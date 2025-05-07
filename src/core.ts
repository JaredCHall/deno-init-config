import {promptUser, validateGitHubPath, validateJsrPath} from "./helpers.ts";
import type {DenoConfig} from "./types.ts";

export type PromptFn = typeof promptUser
export type WriteFn = typeof Deno.writeTextFile
export type LogFn = typeof console.log

/** Options for the generateDenoConfig command */
export interface makeDenoConfigCommandOptions {
  /** The format of the output file: json or jsonc */
  format: string
  /** return the output instead of writing to file */
  dryRun?: boolean
}

/** Injections for the generateDenoConfig command (for testing) */
export interface MakeDenoConfigCommandInjections {
  promptFn: PromptFn
  writeFn: WriteFn
  logFn: LogFn
}

/**
 * Generate a deno.json config file
 * - prompts the user for input
 * - prints to console if dryRun is true
 * - writes to file if dryRun is false
 *
 * @returns the path to the generated file
 */
export async function makeDenoConfigCommand(
    options: makeDenoConfigCommandOptions = {format: 'jsonc'},
    injects: MakeDenoConfigCommandInjections = {
      promptFn: promptUser,
      writeFn: Deno.writeTextFile,
      logFn: console.log,
    }
): Promise<string>
{
  if (options.format !== "json" && options.format !== "jsonc") {
    throw new Error(`Invalid format: "${options.format}". Use "json" or "jsonc".`);
  }

  const jsrPath = injects.promptFn('Enter the future JSR path of the project: ', validateJsrPath)
  const githubPath = injects.promptFn('Enter the GitHub path of the project: ', validateGitHubPath)
  const description = injects.promptFn('Enter a short description of the project: ')
  const config = generateDenoConfigObject(jsrPath, githubPath, description)
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

/** Generate the deno.json config object */
export function generateDenoConfigObject(jsrPath: string, githubPath: string, description: string): DenoConfig
{
  return {
    "name": jsrPath,
    "version": "0.1.0",
    "exports": "./mod.ts",
    "description": description,
    "githubPath": githubPath,
    "tasks": {
      "test": "deno test",
      "check": "deno fmt && deno lint && deno task test"
    },
    "imports": {
      "@std/assert": "jsr:@std/assert@1",
    },
    "fmt": {
      "useTabs": true,
      "lineWidth": 120,
      "indentWidth": 4,
      "semiColons": false,
      "singleQuote": true,
      "proseWrap": "preserve",
      "include": [
        "src/*.ts",
        "tests/*.ts"
      ]
    },
    "publish": {
      "include": [
        "LICENSE",
        "README.md",
        "mod.ts",
        "src/**/*.ts"
      ]
    }
  }
}