#!/usr/bin/env node
/**
 * Design Token Linter
 *
 * Scans the codebase for inline hex codes and arbitrary Tailwind color
 * classes outside the token files. Reports counts, exits non-zero only
 * on regressions inside the strict zones.
 *
 *   STRICT  — src/components/ui/, src/styles/, new files anywhere
 *             Any inline hex fails CI.
 *   WARN    — everywhere else under src/
 *             Counts are reported but don't fail CI (we have ~1,230
 *             legacy violations to migrate incrementally).
 *
 * The CLAUDE.md charter says: refactor when you touch a file. This
 * linter enforces that direction without breaking the build on day one.
 *
 * Run:    node scripts/lint-design-tokens.mjs
 * CI:     npm run lint:design  (added to package.json)
 */
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = fileURLToPath(new URL('..', import.meta.url))
const SRC = join(ROOT, 'src')

const HEX_RE = /#[0-9a-fA-F]{6}\b/g
const ARBITRARY_CLASS_RE = /\[#[0-9a-fA-F]{6}\]/g

// Files allowed to define raw hex (the system).
const ALLOWED_FILES = new Set([
  'src/styles/tokens.ts',
  'src/styles/forward-colors.ts',           // legacy aliases, scheduled for retirement
  'src/styles/design-tokens.ts',            // legacy tokens, scheduled for retirement
  'src/styles/colors.ts',                   // legacy, if present
])

// Globs that must stay 100% clean (strict mode).
const STRICT_PREFIXES = ['src/components/ui/', 'src/styles/tokens.ts']

function walk(dir, acc = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    const s = statSync(full)
    if (s.isDirectory()) {
      if (entry === 'node_modules' || entry === '.next' || entry === 'dist') continue
      walk(full, acc)
    } else if (/\.(tsx?|jsx?|css)$/.test(entry)) {
      acc.push(full)
    }
  }
  return acc
}

function isAllowed(relPath) {
  if (ALLOWED_FILES.has(relPath)) return true
  return false
}

function isStrict(relPath) {
  return STRICT_PREFIXES.some((p) => relPath.startsWith(p))
}

function findHex(file) {
  const src = readFileSync(file, 'utf8')
  const hits = []
  let m
  while ((m = HEX_RE.exec(src)) !== null) {
    const line = src.slice(0, m.index).split('\n').length
    hits.push({ kind: 'hex', value: m[0], line })
  }
  while ((m = ARBITRARY_CLASS_RE.exec(src)) !== null) {
    const line = src.slice(0, m.index).split('\n').length
    hits.push({ kind: 'arbitrary-class', value: m[0], line })
  }
  return hits
}

function main() {
  const files = walk(SRC)
  let strictFails = 0
  let warnTotal = 0
  const warnByFile = []

  for (const f of files) {
    const rel = relative(ROOT, f).split(sep).join('/')
    if (isAllowed(rel)) continue
    const hits = findHex(f)
    if (hits.length === 0) continue
    if (isStrict(rel)) {
      strictFails += hits.length
      console.error(`\n✗ STRICT VIOLATION: ${rel}`)
      for (const h of hits.slice(0, 5)) {
        console.error(`    L${h.line}: ${h.kind} ${h.value}`)
      }
      if (hits.length > 5) console.error(`    …and ${hits.length - 5} more`)
    } else {
      warnTotal += hits.length
      warnByFile.push({ rel, count: hits.length })
    }
  }

  const warnTop = warnByFile.sort((a, b) => b.count - a.count).slice(0, 10)
  console.log('\nDesign token audit')
  console.log('==================')
  console.log(`Strict zone violations:  ${strictFails}    (must be 0)`)
  console.log(`Legacy zone violations:  ${warnTotal}    (does not fail CI)`)
  console.log('\nTop 10 files with legacy violations:')
  for (const f of warnTop) console.log(`  ${String(f.count).padStart(4)}  ${f.rel}`)

  if (strictFails > 0) {
    console.error('\n✗ Inline hex codes are forbidden in src/components/ui/ and src/styles/tokens.ts.')
    console.error('  Reference tokens from src/styles/tokens.ts instead.')
    process.exit(1)
  }
  console.log('\n✓ Strict zones clean.')
}

main()
