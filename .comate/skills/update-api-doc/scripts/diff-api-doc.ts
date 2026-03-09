import fs from 'node:fs';
import path from 'node:path';

interface ApiEntry {
    file: string;
    module: string;
    className: string;
    method: string;
    url: string;
}

function findTsFiles(dir: string): string[] {
    const entries = fs.readdirSync(dir, {withFileTypes: true});
    const files: string[] = [];
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            files.push(...findTsFiles(fullPath));
        }
        else if (entry.name.endsWith('.ts')) {
            files.push(fullPath);
        }
    }
    return files;
}

function extractApisFromFile(filePath: string): ApiEntry[] {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    const module = path.basename(path.dirname(filePath));
    const apis: ApiEntry[] = [];

    let currentClass = '';
    let pendingUrl = '';

    for (const line of lines) {
        // Track class declarations
        const classMatch = line.match(/^(?:export\s+)?(?:abstract\s+)?class\s+(\w+)/);
        if (classMatch) {
            currentClass = classMatch[1];
            pendingUrl = '';
            continue;
        }

        // Capture @see URL from JSDoc
        const seeMatch = line.match(/@see\s+(https?:\/\/\S+)/);
        if (seeMatch) {
            pendingUrl = seeMatch[1];
            continue;
        }

        // Associate pending URL with the next async method
        if (pendingUrl) {
            const methodMatch = line.match(/^\s+async\s+(\w+)\s*[<(]/);
            if (methodMatch) {
                apis.push({
                    file: filePath,
                    module,
                    className: currentClass,
                    method: methodMatch[1],
                    url: pendingUrl,
                });
                pendingUrl = '';
            }
            else if (line.trim() && !line.trim().startsWith('*') && !line.trim().startsWith('/') && !line.trim().startsWith('/*')) {
                // Non-comment, non-blank line that isn't a method — discard pending URL
                pendingUrl = '';
            }
        }
    }

    return apis;
}

function parseReadmeTable(readmePath: string): ApiEntry[] {
    const content = fs.readFileSync(readmePath, 'utf8');
    const lines = content.split('\n');
    const apis: ApiEntry[] = [];

    let inApiSection = false;

    for (const line of lines) {
        if (line.includes('当前支持API')) {
            inApiSection = true;
            continue;
        }

        if (!inApiSection) {
            continue;
        }

        // End of section: next level-2 heading
        if (line.match(/^## /) && !line.includes('当前支持API')) {
            break;
        }

        if (line.startsWith('|') && !line.includes('---') && !line.includes('模块') && !line.includes('Module')) {
            const parts = line.split('|').map(p => p.trim()).filter(Boolean);
            if (parts.length >= 4) {
                const fullModule = parts[0]; // @otakustay/bce-sdk/cfc
                const module = fullModule.split('/').pop() ?? fullModule;
                apis.push({
                    file: '',
                    module,
                    className: parts[1],
                    method: parts[2],
                    url: parts[3],
                });
            }
        }
    }

    return apis;
}

const srcDir = path.join(process.cwd(), 'src');
const readmePath = path.join(process.cwd(), 'README.md');

// Collect source APIs
const tsFiles = findTsFiles(srcDir);
const sourceApis: ApiEntry[] = [];
for (const file of tsFiles) {
    sourceApis.push(...extractApisFromFile(file));
}
sourceApis.sort((a, b) => {
    if (a.module !== b.module) {
        return a.module.localeCompare(b.module);
    }
    if (a.className !== b.className) {
        return a.className.localeCompare(b.className);
    }
    return a.method.localeCompare(b.method);
});

// Parse README
const readmeApis = parseReadmeTable(readmePath);

// Build lookup maps
const entryKey = (e: ApiEntry) => `${e.module}::${e.className}::${e.method}`;
const sourceMap = new Map(sourceApis.map(e => [entryKey(e), e]));
const readmeMap = new Map(readmeApis.map(e => [entryKey(e), e]));

// ── Output: all source APIs ──────────────────────────────────────────────────
console.log('=== All APIs in source ===\n');
for (const api of sourceApis) {
    const relFile = path.relative(process.cwd(), api.file);
    console.log(`[${relFile}] ${api.className}.${api.method}`);
    console.log(`  module : @otakustay/bce-sdk/${api.module}`);
    console.log(`  url    : ${api.url}`);
    console.log();
}

// ── Output: diff ─────────────────────────────────────────────────────────────
const missing: ApiEntry[] = [];
const extra: ApiEntry[] = [];
const wrong: Array<{source: ApiEntry; readme: ApiEntry}> = [];

for (const [key, api] of sourceMap) {
    const readmeEntry = readmeMap.get(key);
    if (!readmeEntry) {
        missing.push(api);
    }
    else if (readmeEntry.url !== api.url) {
        wrong.push({source: api, readme: readmeEntry});
    }
}

for (const [key, api] of readmeMap) {
    if (!sourceMap.has(key)) {
        extra.push(api);
    }
}

console.log('=== Diff result ===\n');

if (missing.length === 0 && extra.length === 0 && wrong.length === 0) {
    console.log('✅ README is up to date, no changes needed');
    process.exit(0);
}

if (missing.length > 0) {
    console.log(`➕ ${missing.length} row(s) to add:`);
    for (const api of missing) {
        const relFile = path.relative(process.cwd(), api.file);
        console.log(`  [${relFile}] @otakustay/bce-sdk/${api.module} | ${api.className} | ${api.method} | ${api.url}`);
    }
    console.log();
}

if (extra.length > 0) {
    console.log(`➖ ${extra.length} row(s) to remove:`);
    for (const api of extra) {
        console.log(`  @otakustay/bce-sdk/${api.module} | ${api.className} | ${api.method}`);
    }
    console.log();
}

if (wrong.length > 0) {
    console.log(`✏️  ${wrong.length} row(s) to fix:`);
    for (const {source, readme} of wrong) {
        const relFile = path.relative(process.cwd(), source.file);
        console.log(`  [${relFile}] @otakustay/bce-sdk/${source.module} | ${source.className} | ${source.method}`);
        console.log(`    README : ${readme.url}`);
        console.log(`    source : ${source.url}`);
    }
    console.log();
}
