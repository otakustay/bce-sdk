# 又一个BCE SDK

## 为什么

原版的`@baiducloud/sdk`不太好用，所以决定重新做一个。

## 想怎么样

1. 全TypeScript实现，带类型。
2. 只支持HTTPS协议，什么年代了去他的裸HTTP吧。
3. 摆脱低版本Node运行的需求，使用新语方特性，诸如`URLSearchParams`。
4. 原则上不支持在浏览器里使用。
5. 纯ESM构建，支持Tree Shaking。
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
import {BosClient} from '@otakustay/bce-sdk/bos';

const client = new BosClient({region: 'bj', ak: 'xxx', sk: 'xxx'});
const response = await client.listObjects('some-bucket-name', {maxKeys: 100, prefix: 'prefix/'});
console.log(response.body.contents);
```

具体请参考各个客户端类的类型，基本就能知道怎么用了。

## 当前支持API

| 模块                   | 类名                   | 方法                        | 官方文档                                    |
| ---------------------- | ---------------------- | --------------------------- | ------------------------------------------- |
| @otakustay/bce-sdk/bls | BlsClient              | queryLogRecord              | https://cloud.baidu.com/doc/BLS/s/hk8to0l9o |
| @otakustay/bce-sdk/bls | BlsClient              | createDownloadTask          | https://cloud.baidu.com/doc/BLS/s/Hm344rht7 |
| @otakustay/bce-sdk/bls | BlsClient              | getDownloadTaskLink         | https://cloud.baidu.com/doc/BLS/s/6m348wh16 |
| @otakustay/bce-sdk/bls | BlsClient              | describeDownloadTask        | https://cloud.baidu.com/doc/BLS/s/um347nkxz |
| @otakustay/bce-sdk/bos | BosClient              | listObjects                 | https://cloud.baidu.com/doc/BOS/s/bkcacfjvi |
| @otakustay/bce-sdk/bos | BosClient              | getObject                   | https://cloud.baidu.com/doc/BOS/s/xkc5pcmcj |
| @otakustay/bce-sdk/bos | BosClient              | getObjectAsBlob             | https://cloud.baidu.com/doc/BOS/s/xkc5pcmcj |
| @otakustay/bce-sdk/bos | BosClient              | getObjectAsStream           | https://cloud.baidu.com/doc/BOS/s/xkc5pcmcj |
| @otakustay/bce-sdk/bos | BosClient              | getObjectMeta               | https://cloud.baidu.com/doc/BOS/s/6kc5suqj3 |
| @otakustay/bce-sdk/bos | BosClient              | putObject                   | https://cloud.baidu.com/doc/BOS/s/Ikc5nv3wc |
| @otakustay/bce-sdk/bos | BosClient              | putObjectJson               | https://cloud.baidu.com/doc/BOS/s/Ikc5nv3wc |
| @otakustay/bce-sdk/bos | BosClient              | putObjectFromFile           | https://cloud.baidu.com/doc/BOS/s/Ikc5nv3wc |
| @otakustay/bce-sdk/bos | BosClient              | copyObject                  | https://cloud.baidu.com/doc/BOS/s/Lkc5p9g3w |
| @otakustay/bce-sdk/bos | BosClient              | deleteObject                | https://cloud.baidu.com/doc/BOS/s/bkc5tsslq |
| @otakustay/bce-sdk/cdn | CdnClient              | prefetch                    | https://cloud.baidu.com/doc/CDN/s/Rjwvyf0ff |
| @otakustay/bce-sdk/cdn | CdnClient              | purge                       | https://cloud.baidu.com/doc/CDN/s/ijwvyeyyj |
| @otakustay/bce-sdk/cfc | CfcClient              | createFunction              | https://cloud.baidu.com/doc/CFC/s/xjwvz450q |
| @otakustay/bce-sdk/cfc | CfcClient              | listFunctions               | https://cloud.baidu.com/doc/CFC/s/Zjwvz46l3 |
| @otakustay/bce-sdk/cfc | CfcClient              | getFunction                 | https://cloud.baidu.com/doc/CFC/s/Kjwvz45ri |
| @otakustay/bce-sdk/cfc | CfcClient              | deleteFunction              | https://cloud.baidu.com/doc/CFC/s/fjwvz472b |
| @otakustay/bce-sdk/cfc | CfcClient              | updateFunctionCode          | https://cloud.baidu.com/doc/CFC/s/jjwvz45ex |
| @otakustay/bce-sdk/cfc | CfcClient              | getFunctionConfiguration    | https://cloud.baidu.com/doc/CFC/s/9jwvz466u |
| @otakustay/bce-sdk/cfc | CfcClient              | updateFunctionConfiguration | https://cloud.baidu.com/doc/CFC/s/2jwvz44ns |
| @otakustay/bce-sdk/cfc | CfcClient              | setFunctionConcurrency      | https://cloud.baidu.com/doc/CFC/s/ok5dlgr72 |
| @otakustay/bce-sdk/cfc | CfcClient              | deleteFunctionConcurrency   | https://cloud.baidu.com/doc/CFC/s/3k5dlqspp |
| @otakustay/bce-sdk/cfc | CfcClient              | invokeFunction              | https://cloud.baidu.com/doc/CFC/s/vjwvz4e9n |
| @otakustay/bce-sdk/cfc | CfcClient              | listVersionsByFunction      | https://cloud.baidu.com/doc/CFC/s/Gjwvz4dyc |
| @otakustay/bce-sdk/cfc | CfcClient              | publishVersion              | https://cloud.baidu.com/doc/CFC/s/4jwvz4dn3 |
| @otakustay/bce-sdk/cfc | CfcClient              | listTriggers                | https://cloud.baidu.com/doc/CFC/s/Kjwvz499l |
| @otakustay/bce-sdk/cfc | CfcClient              | createTrigger               | https://cloud.baidu.com/doc/CFC/s/njwvz48yg |
| @otakustay/bce-sdk/cfc | CfcClient              | updateTrigger               | https://cloud.baidu.com/doc/CFC/s/zjwvz48js |
| @otakustay/bce-sdk/cfc | CfcClient              | deleteTrigger               | https://cloud.baidu.com/doc/CFC/s/hjwvz49o0 |
| @otakustay/bce-sdk/cfc | CfcConcurrencyClient   | setFunctionConcurrency      | https://cloud.baidu.com/doc/CFC/s/ok5dlgr72 |
| @otakustay/bce-sdk/cfc | CfcConcurrencyClient   | deleteFunctionConcurrency   | https://cloud.baidu.com/doc/CFC/s/3k5dlqspp |
| @otakustay/bce-sdk/cfc | CfcConfigurationClient | getFunctionConfiguration    | https://cloud.baidu.com/doc/CFC/s/9jwvz466u |
| @otakustay/bce-sdk/cfc | CfcConfigurationClient | updateFunctionConfiguration | https://cloud.baidu.com/doc/CFC/s/2jwvz44ns |
| @otakustay/bce-sdk/cfc | CfcFunctionClient      | createFunction              | https://cloud.baidu.com/doc/CFC/s/xjwvz450q |
| @otakustay/bce-sdk/cfc | CfcFunctionClient      | listFunctions               | https://cloud.baidu.com/doc/CFC/s/Zjwvz46l3 |
| @otakustay/bce-sdk/cfc | CfcFunctionClient      | getFunction                 | https://cloud.baidu.com/doc/CFC/s/Kjwvz45ri |
| @otakustay/bce-sdk/cfc | CfcFunctionClient      | deleteFunction              | https://cloud.baidu.com/doc/CFC/s/fjwvz472b |
| @otakustay/bce-sdk/cfc | CfcFunctionClient      | updateFunctionCode          | https://cloud.baidu.com/doc/CFC/s/jjwvz45ex |
| @otakustay/bce-sdk/cfc | CfcFunctionClient      | invokeFunction              | https://cloud.baidu.com/doc/CFC/s/vjwvz4e9n |
| @otakustay/bce-sdk/cfc | CfcTriggerClient       | listTriggers                | https://cloud.baidu.com/doc/CFC/s/Kjwvz499l |
| @otakustay/bce-sdk/cfc | CfcTriggerClient       | createTrigger               | https://cloud.baidu.com/doc/CFC/s/njwvz48yg |
| @otakustay/bce-sdk/cfc | CfcTriggerClient       | updateTrigger               | https://cloud.baidu.com/doc/CFC/s/zjwvz48js |
| @otakustay/bce-sdk/cfc | CfcTriggerClient       | deleteTrigger               | https://cloud.baidu.com/doc/CFC/s/hjwvz49o0 |
| @otakustay/bce-sdk/cfc | CfcVersionClient       | listVersionsByFunction      | https://cloud.baidu.com/doc/CFC/s/Gjwvz4dyc |
| @otakustay/bce-sdk/cfc | CfcVersionClient       | publishVersion              | https://cloud.baidu.com/doc/CFC/s/4jwvz4dn3 |
| @otakustay/bce-sdk/sts | StsClient              | getSessionToken             | https://cloud.baidu.com/doc/IAM/s/Qjwvyc8ov |
| @otakustay/bce-sdk/sts | StsClient              | assumeRole                  | https://cloud.baidu.com/doc/IAM/s/Qjwvyc8ov |
