const URL_ESCAPE: Record<string, string> = {
    '!': '%21',
    '\'': '%27',
    '(': '%28',
    ')': '%29',
    '*': '%2A',
};

export const normalizeUrl = (value: string, encodeSlash = true) => {
    const parts = value.split('/');
    const normalized = parts.map(v => encodeURIComponent(v).replace(/[!'()*]/g, c => URL_ESCAPE[c]));
    return normalized.join(encodeSlash ? '%2F' : '/');
};
