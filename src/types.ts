export interface DenoConfig {
  name?: string
  version?: string
  exports?: string
  description?: string
  githubPath?: string
  tasks?: Record<string, string>
  imports?: Record<string, string>
  fmt?: {
    useTabs?: boolean
    lineWidth?: number
    indentWidth?: number
    semiColons?: boolean
    singleQuote?: boolean
    proseWrap?: 'preserve' | 'always' | 'never'
    include?: string[]
  }
  publish?: {
    include?: string[]
  }
}
