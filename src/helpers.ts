/** Throw an error if the jsr path is invalid */
export function validateJsrPath(jsrPath: string): void {
  if (!jsrPath.startsWith('@') || !jsrPath.includes('/')) {
    throw new Error(`Invalid JSR path: must be scoped like "@scope/module"`)
  }
}
/** Throw an error if the github path is invalid */
export function validateGitHubPath(githubPath: string): void {
  if (!/^[\w-]+\/[\w.-]+$/.test(githubPath)) {
    throw new Error(`Invalid GitHub path: must be in "user/repo" format`)
  }
}

/** Prompt the user for input until it passes validation */
export function promptUser(
    message: string,
    validate?: (input: string) => void
): string {
  while(true){
    const input = (prompt(message) ?? '').trim()
    try {
      if (validate) validate(input)
      return input
    } catch (err) {
      console.error(`%c❌ ${err instanceof Error ? err.message : String(err)}`, 'color:indianred')
    }
  }
}
