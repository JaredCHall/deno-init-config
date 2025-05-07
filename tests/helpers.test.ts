// helpers.test.ts
import { assertThrows, assertEquals } from "@std/assert"
import { validateJsrPath, validateGitHubPath, promptUser } from "../src/helpers.ts"

Deno.test("validateJsrPath - accepts valid scoped path", () => {
  validateJsrPath("@my_scope/my_module") // should not throw
})

Deno.test("validateJsrPath - throws on missing @", () => {
  assertThrows(
      () => validateJsrPath("my_scope/my_module"),
      Error,
      'Invalid JSR path: must be scoped like "@scope/module"'
  )
})

Deno.test("validateJsrPath - throws on missing slash", () => {
  assertThrows(
      () => validateJsrPath("@my_scope"),
      Error,
      'Invalid JSR path: must be scoped like "@scope/module"'
  )
})

Deno.test("validateGitHubPath - accepts valid user/repo format", () => {
  validateGitHubPath("jaredhall/deno-init-config") // should not throw
})

Deno.test("validateGitHubPath - throws on missing slash", () => {
  assertThrows(
      () => validateGitHubPath("jaredhall"),
      Error,
      'Invalid GitHub path: must be in "user/repo" format'
  )
})

Deno.test("validateGitHubPath - throws on invalid characters", () => {
  assertThrows(
      () => validateGitHubPath("user$/repo!"),
      Error,
      'Invalid GitHub path: must be in "user/repo" format'
  )
})


Deno.test('promptUser - returns valid input immediately', () => {
  const mockPrompt = () => '  ok_value  '
  const mockLog = () => {}

  const result = promptUser('Prompt:', undefined, mockPrompt, mockLog)
  assertEquals(result, 'ok_value') // trimmed
})

Deno.test('promptUser - applies validation and retries until valid', () => {
  const responses = ['bad', '', 'good']
  let callCount = 0

  const mockPrompt = () => responses[callCount++]
  const errors: string[] = []
  const mockLog = (msg: unknown) => errors.push(String(msg))

  const validate = (input: string) => {
    if (input !== 'good') throw new Error('Try again')
  }

  const result = promptUser('Prompt:', validate, mockPrompt, mockLog)

  assertEquals(result, 'good')
  assertEquals(errors.length, 2)
  assertEquals(errors[0].includes('❌ Try again'), true)
})

Deno.test('promptUser - handles prompt cancel (null input)', () => {
  let called = false
  const mockPrompt = () => {
    if (!called) {
      called = true
      return null // simulate user hitting "Cancel"
    }
    return 'okay'
  }

  const logs: string[] = []
  const mockLog = (msg: unknown) => logs.push(String(msg))

  const validate = (input: string) => {
    if (input === '') throw new Error('Empty input not allowed')
  }

  const result = promptUser('Prompt:', validate, mockPrompt, mockLog)
  assertEquals(result, 'okay')
  assertEquals(logs.length, 1)
  assertEquals(logs[0].includes('❌ Empty input not allowed'), true)
})

Deno.test('promptUser - handles thrown value that is not an Error', () => {
  let callCount = 0
  const inputs = ['bad', 'ok']
  const mockPrompt = () => inputs[callCount++]

  const logs: string[] = []
  const mockLog = (msg: unknown) => logs.push(String(msg))

  // validation throws a string instead of Error
  const validate = (input: string) => {
    if (input !== 'ok') throw 'oops!'
  }

  const result = promptUser('Prompt:', validate, mockPrompt, mockLog)
  assertEquals(result, 'ok')
  assertEquals(logs.length, 1)
  assertEquals(logs[0].includes('❌ oops!'), true)
})
