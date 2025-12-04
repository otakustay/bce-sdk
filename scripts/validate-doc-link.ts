import fs from 'node:fs';
import path from 'node:path';

interface DocLinkInfo {
    module: string;
    className: string;
    method: string;
    link: string;
}

/**
 * 验证单个文档链接
 */
async function validateSingleLink(docInfo: DocLinkInfo): Promise<{isValid: boolean, error?: string}> {
    try {
        const response: Response = await fetch(docInfo.link);

        if (response.status !== 200) {
            return {
                isValid: false,
                error: `响应码为 ${response.status}`,
            };
        }
        return {isValid: true};
    }
    catch {
        return {
            isValid: false,
            error: '请求失败',
        };
    }
}

/**
 * 解析表格行，提取文档信息
 */
function parseDocLine(line: string): DocLinkInfo | null {
    const parts: string[] = line.split('|').map(part => part.trim()).filter(part => !!part);

    if (parts.length >= 4) {
        const [module, className, method, link] = parts;
        return {module, className, method, link};
    }

    return null;
}

// 验证README.md中的百度云文档链接
try {
    // 1. 读取README.md文件
    const readmePath: string = path.join(process.cwd(), 'README.md');
    const content: string = fs.readFileSync(readmePath, 'utf8');

    // 2. 提取所有包含https://cloud.baidu.com/doc/为前缀的URL的行
    const lines: string[] = content.split('\n');
    const docLines: string[] = lines.filter(line => line.includes('https://cloud.baidu.com/doc/'));

    console.log(`找到 ${docLines.length} 个文档链接，开始验证...\n`);

    const errors: string[] = [];

    // 3. 处理每一行
    for (const line of docLines) {
        // 跳过表头行
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
    // 4. 输出结果
    if (errors.length === 0) {
        console.log('✅ 全部链接有效');
    }
    else {
        console.log(`❌ 发现 ${errors.length} 个无效链接:`);
        for (const error of errors) {
            console.log(`   - ${error}`);
        }
    }
}
catch {
    console.error('脚本执行失败');
    process.exit(1);
}
