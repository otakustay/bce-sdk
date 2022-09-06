# 又一个BCE SDK

## 为什么

原版的`@baiducloud/sdk`不太好用，所以决定重新做一个。

## 想怎么样

1. 全TypeScript实现，带类型。
2. 只支持HTTPS协议，什么年代了去他的裸HTTP吧。
3. 摆脱低版本Node运行的需求，使用新语方特性，诸如`URLSearchParams`。
4. 一定程度上支持浏览器中运行，只要你的浏览器够新。
5. ESM和CommonJS双构建，支持Tree Shaking。
6. 基于原生`fetch`与`Stream`而得的更好的性能。

## 是不是能用

反正我是在各种项目里用着，个人用到哪个API就加哪个，也欢迎有需要的PR添加功能。

对于调试、日志等有需求的，同样可以提。

## 如何使用

安装：

```shell
npm install @otakustay/bce-sdk
```

以BOS列出对象为例：

```ts
import {BosClient} from '@otakustay/bce-sdk';

const client = new BosClient({region: 'bj', ak: 'xxx', sk: 'xxx'});
const response = await client.listObjects('some-bucket-name', {maxKeys: 100, prefix: 'prefix/'});
console.log(response.body.contents);
```

具体请参考各个客户端类的类型，基本就能知道怎么用了。

API文档建设中……

## 浏览器运行的要求

1. 必须支持`crypto.subtle`和`fetch`。
2. 部分API只能在Node中使用，如`BosClient#putObjectFromFile`，这些API使用了异步的`await import('node:fs')`来避开在浏览器中直接执行。如果你使用Vite等构建工具，请将`node:*`模块置空。
3. 我们不保证在未来永远可以用于浏览器，但不适用于浏览器的情况下会发布大版本。
