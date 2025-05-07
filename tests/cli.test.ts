// deno-lint-ignore-file require-await
import { makeDenoConfigCli } from '../src/cli.ts'
import { assertEquals } from '@std/assert'
import {CommandError} from "../src/types.ts";

Deno.test('makeDenoConfigCli - shows help and exits 0', async () => {
  let exitCode = -1
  let output = ''
  const mockLog = (msg: string) => output = msg
  const mockErr = () => {}
  const mockExit = (code?: number) => {
    exitCode = code ?? -1
    throw new Error('exit') // prevent further execution
  }

  try {
    await makeDenoConfigCli({
      logFn: mockLog,
      errFn: mockErr,
      exitFn: mockExit,
      makeFn: async () => 'deno.jsonc',
      args: ['--help']
    })
  } catch (_e) {}


  assertEquals(output.includes('Usage:'), true)
  assertEquals(exitCode, 0)
})

Deno.test('makeDenoConfigCli - dry run logs output and exits 0', async () => {
  let logged = ''
  let exitCode = -1

  const mockLog = (msg: string) => logged = msg
  const mockExit = (code?: number) => {
    exitCode = code ?? -1
    throw new Error('exit')
  }

  try {
    await makeDenoConfigCli({
      logFn: mockLog,
      errFn: () => {},
      exitFn: mockExit,
      makeFn: async () => 'deno.jsonc',
      args: ['--dry-run']
    })
  } catch (_e) {}

  assertEquals(logged.includes('✅ deno.jsonc generated'), true)
  assertEquals(exitCode, 0)
})

Deno.test('makeDenoConfigCli - handles CommandError and exits 1', async () => {
  let captured = ''
  let exitCode = -1

  const mockLog = () => {}
  const mockErr = (msg: string) => captured = String(msg)
  const mockExit = (code?: number) => {
    exitCode = code ?? -1
    throw new Error('exit') // short-circuit
  }

  const fakeMake = async () => {
    throw new CommandError('intentional failure')
  }
  try {
    await makeDenoConfigCli({
      logFn: mockLog,
      errFn: mockErr,
      exitFn: mockExit,
      makeFn: fakeMake,
      args: []
    })
  } catch (_e) {}

  assertEquals(exitCode, 1)
})