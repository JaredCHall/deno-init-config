# jaredhall/init-config

[![jsr](https://img.shields.io/badge/jsr--%40jaredhall%2Finit-config-blue?logo=deno)](https://jsr.io/@jaredhall/init-config)
[![GitHub](https://img.shields.io/badge/GitHub-JaredCHall/deno-init-config-blue?logo=github)](https://github.com/JaredCHall/deno-init-config)

Scaffolds `deno.json(c)` files for new Deno modules using prompts or config

## Usage

```bash
deno run --allow-write jsr:@jaredhall/init-config
```

If deno.json(c) does not exist, You will be prompted to provide required values:

- `name`: JSR module name (must be scoped)
- `description`: Short summary
- `githubPath`: In the form `user/repo`

Use `--dry-run` to print to stdout and `--force` to overwrite an existing file

## Advanced Usage

```ts
import { buildConfig } from "jsr:@jaredhall/init-config"

const template = buildConfig({
  name: "@your_scope/your_module",
  description: "My awesome module",
  githubPath: "user/repo",
})
```

## Output

Generates a complete `deno.jsonc` file with:

- all required JSR properties: `name`, `description`, `exports`, `publish`
- formatting and linting config
- imports with `@std/assert` ready to go
- default tasks `test` and `check`
- custom `githubPath` property

## CLI Options

- `--dry-run`: Print result to stdout
- `--help`: Show help message

## Architecture

- Prompt/UI logic lives in `generate-config.ts`
- Core generation logic in `core.ts`
- Validation helpers in `helpers.ts`
- Fully testable with 100% test coverage
