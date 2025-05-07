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

/** Type of the global prompt function */
export type PromptFn = (message: string) => string | null
export type LogFn = (message?: unknown, ...args: unknown[]) => void

/** Prompt the user for input until it passes validation */
export function promptUser(
	message: string,
	validate?: (input: string) => void,
	promptFn: PromptFn = prompt,
	logFn: LogFn = console.error,
): string {
	while (true) {
		const input = (promptFn(message) ?? '').trim()
		try {
			if (validate) validate(input)
			return input
		} catch (err) {
			logFn(`%c❌ ${err instanceof Error ? err.message : String(err)}`, 'color:indianred')
		}
	}
}

export async function fileExists(path: string): Promise<boolean> {
	try {
		await Deno.stat(path)
		return true
	} catch {
		return false
	}
}
