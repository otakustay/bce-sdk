# SDK Development Guidelines

This document describes the conventions that must be followed when adding a new BCE service Client to this codebase.

## 1. Directory Structure

Each service gets its own directory with a fixed entry file `index.ts`:

```
src/
└── {service}/
    └── index.ts   # Client class + all type definitions in a single file
```

Do not split into multiple files unless the service has complexity comparable to BOS (which has separate Bucket and Object sub-dimensions).

## 2. Naming Conventions

- Client class: `{Service}Client` — e.g. `BlsClient`, `CfcClient`, `CdnClient`
- Options type: `{Service}Options`

```typescript
// Region-based services reuse RegionClientOptions
export type CfcOptions = RegionClientOptions;

export class CfcClient {
    private readonly http: Http;
    constructor(options: CfcOptions) { ... }
}
```

All types (requests, responses, enums) are defined and exported at the top of the file. The Client class goes at the bottom.

## 3. Http Instantiation

Choose the appropriate static factory method based on the service type:

| Service type | Factory method | Endpoint format | Example |
|---|---|---|---|
| Region-based | `Http.fromRegionSupportedServiceId(serviceId, options)` | `{serviceId}.{region}.baidubce.com` | BLS, CFC, STS |
| Fixed endpoint | `Http.fromEndpoint(endpoint, context)` | Full hostname specified directly | CDN: `cdn.baidubce.com` |

Region-based services extend `RegionClientOptions` (contains `credentials`, `region`, optional `sessionToken`).

## 4. Method Conventions

Each API endpoint maps to one `async` method. Add a `@see` JSDoc comment above each method pointing to the official documentation URL:

```typescript
/**
 * @see https://cloud.baidu.com/doc/CFC/s/xjwvz450q
 */
async createFunction(request: CreateFunctionRequest) {
    const response = await this.http.json<FunctionConfiguration>(
        'POST',
        '/v1/functions',
        {body: request}
    );
    return response;
}
```

Select the Http method based on the response type:

| Scenario | Http method |
|---|---|
| JSON response body | `this.http.json<T>(method, url, options?)` |
| No response body (200/204) | `this.http.noContent(method, url, options?)` |
| Plain text response | `this.http.text(method, url, options?)` |
| Blob response | `this.http.blob(method, url, options?)` |

**RequestOptions fields:**

```typescript
{
    params: { key: value },   // Query parameters; undefined/null values are filtered out automatically
    headers: { 'x-bce-xxx': 'value' },
    body: { ... },            // Plain objects are serialized to JSON automatically
}
```

## 5. package.json

After adding a new service, add the corresponding entry to the `exports` field in `package.json`:

```json
{
  "exports": {
    "./cfc": "./dist/cfc/index.js"
  }
}
```

The key is `./{service}` and the value is `./dist/{service}/index.js`.

## 6. Validation

After completing the implementation, run lint and build **in parallel**. Both must pass before the work is considered done:

```bash
npm run lint & npm run build & wait
```

Both commands are launched simultaneously. Fix any errors from either side and re-run; do not skip one of them.
