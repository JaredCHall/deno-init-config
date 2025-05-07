import type { DenoConfig } from './types.ts'

export interface BuildConfigOptions {
	jsrPath: string
	githubPath: string
	description: string
}
/** Generate the deno.json config object */
export function buildConfig(options: BuildConfigOptions): DenoConfig {
	const { jsrPath, githubPath, description } = options

	return {
		'name': jsrPath,
		'version': '0.1.0',
		'exports': './mod.ts',
		'description': description,
		'githubPath': githubPath,
		'tasks': {
			'test': 'deno test',
			'check': 'deno fmt && deno lint && deno task test',
		},
		'imports': {
			'@std/assert': 'jsr:@std/assert@1',
		},
		'fmt': {
			'useTabs': true,
			'lineWidth': 120,
			'indentWidth': 4,
			'semiColons': false,
			'singleQuote': true,
			'proseWrap': 'preserve',
			'include': [
				'src/*.ts',
				'tests/*.ts',
			],
		},
		'publish': {
			'include': [
				'LICENSE',
				'README.md',
				'mod.ts',
				'src/**/*.ts',
			],
		},
	}
}
