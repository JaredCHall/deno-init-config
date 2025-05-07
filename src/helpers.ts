export async function fileExists(path: string): Promise<boolean> {
  try {
    await Deno.stat(path)
    return true
  } catch {
    return false
  }
}
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

/** Prompt the user for input */
export function promptUser(message: string): string
{
  const input = prompt(message)
  if(input === null) throw new Error('User cancelled')

  return input.trim()
}