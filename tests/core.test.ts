// deno-lint-ignore-file require-await
import { makeDenoConfigCommand } from '../src/core.ts'
import { assertEquals, assertRejects } from '@std/assert'

Deno.test('makeDenoConfigCommand - writes file when not dryRun', async () => {
  let writtenPath = ''
  let writtenData = ''

  const mockWrite = async (
      path: string | URL,
      data: string | ReadableStream<string>,
      _options?: Deno.WriteFileOptions
  ): Promise<void> => {
    if (typeof data !== 'string') throw new Error('Expected string data in mock')
    writtenPath = String(path)
    writtenData = data
  }

  const mockPrompt = (msg: string) => {
    if (msg.includes('JSR')) return '@scope/module'
    if (msg.includes('GitHub')) return 'user/repo'
    if (msg.includes('description')) return 'My module'
    throw new Error('Unexpected prompt')
  }
  const mockLog = () => {}

  const result = await makeDenoConfigCommand(
      { format: 'json' },
      { promptFn: mockPrompt, writeFn: mockWrite, logFn: mockLog }
  )

  assertEquals(result, './deno.json')
  assertEquals(writtenPath, './deno.json')
  const parsed = JSON.parse(writtenData)
  assertEquals(parsed.name, '@scope/module')
  assertEquals(parsed.description, 'My module')
  assertEquals(parsed.githubPath, 'user/repo')
})

Deno.test('makeDenoConfigCommand - logs config when dryRun is true', async () => {
  let output = ''
  const mockPrompt = (msg: string) => {
    if (msg.includes('JSR')) return '@scope/module'
    if (msg.includes('GitHub')) return 'user/repo'
    if (msg.includes('description')) return 'My module'
    return ''
  }
  const mockWrite = async () => {
    throw new Error('Should not write in dryRun mode')
  }
  const mockLog = (msg: string) => output = msg

  const result = await makeDenoConfigCommand(
      { format: 'jsonc', dryRun: true },
      { promptFn: mockPrompt, writeFn: mockWrite, logFn: mockLog }
  )

  assertEquals(result, './deno.jsonc')
  const parsed = JSON.parse(output)
  assertEquals(parsed.name, '@scope/module')
  assertEquals(parsed.githubPath, 'user/repo')
})

Deno.test('makeDenoConfigCommand - throws on invalid format', async () => {
  await assertRejects(
      () => makeDenoConfigCommand({ format: 'bogus' }),
      Error,
      'Invalid format: "bogus"'
  )
})
