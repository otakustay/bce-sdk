---
name: update-api-doc
description: Collect all API methods from the codebase, organize them into a table, and update README.md. Use when the user asks to update README, sync API documentation, add missing API records, or remove outdated API entries. Also use whenever any code editing involves `@see` annotations (adding, modifying, or deleting methods that have a `@see` JSDoc comment) — in that case this skill must be loaded and its full workflow executed before the task is considered complete.
---

# API Documentation Updater

## Workflow

### 1. Run the diff script

```bash
node skills/update-api-doc/scripts/diff-api-doc.ts
```

The script scans every `@see` annotation under `src/` and compares it against the "当前支持API" table in README.md. It outputs two sections:

- **源码中的所有 API** — each entry includes `[file path] ClassName.methodName`, module, and doc URL
- **Diff 结果** — three categories:
  - `➕ 需要新增` — rows present in source but missing from README
  - `➖ 需要删除` — rows in README that no longer exist in source
  - `✏️  需要修正` — rows where the URL in README differs from source

If the output ends with `✅ README 与源码完全一致，无需更新`, stop here.

### 2. Update README.md

Apply every change listed in the diff output to the "当前支持API" table:

- Table columns: `模块 | 类名 | 方法 | 官方文档`
- Module format: `@otakustay/bce-sdk/{directory-name}`
- Rows must stay sorted by module, then class

### 3. Validate doc links

After all edits are complete, run:

```bash
node skills/update-api-doc/scripts/validate-doc-link.ts
```

- If errors are reported, re-examine and fix the affected rows
- If you are confident the URL in source code is correct but the script still flags it, stop and report the invalid link details to the user
