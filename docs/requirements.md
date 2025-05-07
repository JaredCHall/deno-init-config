# 📦 Requirements: `deno-init-config`

This module scaffolds a `deno.jsonc` file for new Deno modules using interactive prompts.

---

## ✅ Goals

- Prompt the user for required metadata
- Generate a fully-formed `deno.jsonc` file
- Follow the same clean, testable design as `deno-init-readme`

---

## 🧾 Required Prompts

- `name`: JSR module name (must be scoped, e.g., `@your_scope/your_module`)
- `description`: Short summary of the module
- `githubPath`: In the form `user/repo`

---

## ✅ Generated Output

- `deno.jsonc` with:
  - `name`
  - `description`
  - `version`: `"0.1.0"`
  - `githubPath` - non-standard field used by godstack ecosystem
  - `scripts` block with `test`, `lint`, `fmt`
  - `lint` and `fmt` exclusion for `testdata`
  - `import` with map to jsr:@std/assert
  - `exports` mod.ts
  - `publish` - required by JSR

Example:

```jsonc
{
  "name": "@your_scope/your_module",
  "description": "My awesome module",
  "version": "0.1.0",
  "scripts": {
    "test": "deno test",
    "lint": "deno lint",
    "fmt": "deno fmt"
  },
  "lint": {
    "files": {
      "exclude": ["testdata"]
    }
  },
  "fmt": {
    "files": {
      "exclude": ["testdata"]
    }
  }
  "imports": {
    "@std/assert": "jsr:@std/assert@1",
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
```

---

## 🧪 CLI Behavior

- `--dry-run`: Output config to `stdout` instead of writing
- `--force`: Overwrite existing `deno.jsonc` if present
- `--help`: Print usage instructions and exit

---

## 🧱 Architecture

- `generateConfig()` as CLI entry point (exported)
- Pure logic in `core.ts`, e.g., `generateDenoConfig(settings): string`
- All prompts and file I/O in `generate-config.ts`
- Helper functions for validation (e.g. `validateName`, `validateGithubPath`)
- Fully testable with no reliance on runtime globals
