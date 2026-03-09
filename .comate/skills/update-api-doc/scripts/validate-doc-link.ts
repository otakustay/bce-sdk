import fs from 'node:fs';
import path from 'node:path';

interface DocLinkInfo {
    module: string;
    className: string;
    method: string;
    link: string;
}

async function validateSingleLink(docInfo: DocLinkInfo): Promise<{isValid: boolean, error?: string}> {
    try {
        const response: Response = await fetch(docInfo.link);

        if (response.status !== 200) {
            return {
                isValid: false,
                error: `HTTP ${response.status}`,
            };
        }
        return {isValid: true};
    }
    catch {
        return {
            isValid: false,
            error: 'request failed',
        };
    }
}

function parseDocLine(line: string): DocLinkInfo | null {
    const parts: string[] = line.split('|').map(part => part.trim()).filter(part => !!part);

    if (parts.length >= 4) {
        const [module, className, method, link] = parts;
        return {module, className, method, link};
    }

    return null;
}

try {
    const readmePath: string = path.join(process.cwd(), 'README.md');
    const content: string = fs.readFileSync(readmePath, 'utf8');

    const lines: string[] = content.split('\n');
    const docLines: string[] = lines.filter(line => line.includes('https://cloud.baidu.com/doc/'));

    console.log(`Found ${docLines.length} doc link(s), validating...\n`);

    const errors: string[] = [];

    for (const line of docLines) {
        if (line.includes('模块') || line.includes('---')) {
            continue;
        }

        const docInfo = parseDocLine(line);
        if (docInfo) {
            const result = await validateSingleLink(docInfo);
            if (!result.isValid) {
                errors.push(`${docInfo.module} | ${docInfo.className}.${docInfo.method} - ${result.error}`);
            }
        }
    }

    if (errors.length === 0) {
        console.log('✅ All links valid');
    }
    else {
        console.log(`❌ Found ${errors.length} invalid link(s):`);
        for (const error of errors) {
            console.log(`   - ${error}`);
        }
    }
}
catch {
    console.error('Script failed');
    process.exit(1);
}
