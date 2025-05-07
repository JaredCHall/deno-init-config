import {fileExists, promptUser, validateGitHubPath, validateJsrPath} from "./helpers.ts";
import {DenoConfig} from "./types.ts";

export type PromptFn = typeof promptUser
export type WriteFn = typeof Deno.writeTextFile

/** Options for the generateDenoConfig command */
export interface GenerateDenoConfigOptions {
  /** The format of the output file: json or jsonc */
  format: string
  /** Overwrite existing files */
  force?: boolean
  /** return the output instead of writing to file */
  dryRun?: boolean
}

/** Injections for the generateDenoConfig command (for testing) */
export interface GenerateDenoConfigInjections {
  promptFn: PromptFn
  writeFn: WriteFn
}

/**
 * Generate a deno.json config file
 *
 * @returns the path to the generated file or the output if dryRun is true
 */
export async function generateDenoConfig(
    options: GenerateDenoConfigOptions = {format: 'jsonc', force: false},
    injects: GenerateDenoConfigInjections = {
      promptFn: promptUser,
      writeFn: Deno.writeTextFile
    }
): Promise<string>
{
  if (options.format !== "json" && options.format !== "jsonc") {
    throw new Error(`Invalid format: "${options.format}". Use "json" or "jsonc".`);
  }
  if(!injects.promptFn) throw new Error('promptFn is required')
  if(!injects.writeFn) throw new Error('writeFn is required')

  const jsrPath = injects.promptFn('Enter the future JSR path of the project: ')
  validateJsrPath(jsrPath)
  const githubPath = injects.promptFn('Enter the GitHub path of the project: ')
  validateGitHubPath(githubPath)
  const description = injects.promptFn('Enter a short description of the project: ')
  const config = generateDenoConfigObject(jsrPath, githubPath, description)
  const configText = JSON.stringify(config, null, 2)

  const fileName = `./deno.${options.format}`

  if (await fileExists(fileName) && !options.force) {
    throw new Error('{fileName} already exists. Use --force to overwrite.')
  }

  if(options.dryRun){
    return configText
  }

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