# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [0.12.12](https://github.com/otakustay/bce-sdk/compare/v0.12.11...v0.12.12) (2024-02-06)


### Bug Fixes

* 修复对BOS对象处理时的URL错误 ([3c17ef2](https://github.com/otakustay/bce-sdk/commit/3c17ef287f5395396012cceaa0f4e869ffde4f68))

### [0.12.11](https://github.com/otakustay/bce-sdk/compare/v0.12.10...v0.12.11) (2024-02-06)


### Bug Fixes

* 更新BOS的请求地址解决认证失败问题 ([f784efc](https://github.com/otakustay/bce-sdk/commit/f784efc4203899198dbb049a189afc29ff226c47))

### [0.12.10](https://github.com/otakustay/bce-sdk/compare/v0.12.8...v0.12.10) (2023-05-06)


### Bug Fixes

* 兼容NodeJS 20要求duplex参数 ([#4](https://github.com/otakustay/bce-sdk/issues/4)) ([7d2a320](https://github.com/otakustay/bce-sdk/commit/7d2a3206f80bfbb50b5f3fc14d21281d020b4e71))

### [0.12.8](https://github.com/otakustay/bce-sdk/compare/v0.12.7...v0.12.8) (2023-03-03)


### Features

* **sts:** 导出更多STS的类型 ([26f42f6](https://github.com/otakustay/bce-sdk/commit/26f42f6b948886e4370ccd6705e0b6a9bb7fea30))
* 兼容NodeJS 16版本 ([2ca3e66](https://github.com/otakustay/bce-sdk/commit/2ca3e666df746a389b14fc21fb7813c4370e46c5))

### [0.12.7](https://github.com/otakustay/bce-sdk/compare/v0.12.6...v0.12.7) (2023-01-10)


### Bug Fixes

* **bos:** 修复签名算法与BOS的key处理冲突 ([fdaee25](https://github.com/otakustay/bce-sdk/commit/fdaee25a86d8a69e0ba82530f41e90aac39302dc))

### [0.12.6](https://github.com/otakustay/bce-sdk/compare/v0.12.5...v0.12.6) (2023-01-10)


### Bug Fixes

* **auth:** 修复URL中有中文的签名算法 ([75b023a](https://github.com/otakustay/bce-sdk/commit/75b023a33e4aa2a26d151d5eb4832fa170909a0f))

### [0.12.5](https://github.com/otakustay/bce-sdk/compare/v0.12.4...v0.12.5) (2023-01-09)


### Bug Fixes

* **bos:** 修复key中包含特殊字符时的逻辑 ([fd69fb2](https://github.com/otakustay/bce-sdk/commit/fd69fb28d01b5f107e985b77fa5b3efd2b395279))

### [0.12.4](https://github.com/otakustay/bce-sdk/compare/v0.12.3...v0.12.4) (2022-12-22)


### Features

* **bls:** 支持V2版本queryLogRecord接口 ([3a9119f](https://github.com/otakustay/bce-sdk/commit/3a9119f91e026e9c6a2f6c99b4af7bdf9689bd69))

### [0.12.3](https://github.com/otakustay/bce-sdk/compare/v0.12.2...v0.12.3) (2022-12-08)


### Bug Fixes

* **http:** 错误地使用了sessionToken ([1195947](https://github.com/otakustay/bce-sdk/commit/1195947e0e0afd8341829c3be76d5a2a3effc2cc))

### [0.12.2](https://github.com/otakustay/bce-sdk/compare/v0.12.1...v0.12.2) (2022-09-20)


### Features

* **bos:** 支持getObjectMeta ([#2](https://github.com/otakustay/bce-sdk/issues/2)) ([36408a0](https://github.com/otakustay/bce-sdk/commit/36408a051653a9703a762c2b7dd2da17d60dea0a))
* **bos:** 支持在bucket层级操作object ([00f64b4](https://github.com/otakustay/bce-sdk/commit/00f64b48d54aa75e45e11058aa412b21c509090e))

### [0.12.1](https://github.com/otakustay/bce-sdk/compare/v0.12.0...v0.12.1) (2022-09-14)


### Bug Fixes

* **bos:** 导出bucket和object的client类型 ([32fb023](https://github.com/otakustay/bce-sdk/commit/32fb023e49c0a246c3da487c24fa9d144cf981b6))

## [0.12.0](https://github.com/otakustay/bce-sdk/compare/v0.11.0...v0.12.0) (2022-09-07)


### ⚠ BREAKING CHANGES

* 更新license字段为Apache-2.0

* 更新license字段为Apache-2.0 ([ea49c35](https://github.com/otakustay/bce-sdk/commit/ea49c3500aab17244d580faf22be811fcebd3968))

### [0.11.1](https://github.com/otakustay/bce-sdk/compare/v0.11.0...v0.11.1) (2022-09-07)

## [0.11.0](https://github.com/otakustay/bce-sdk/compare/v0.10.1...v0.11.0) (2022-09-07)


### ⚠ BREAKING CHANGES

* **bos:** 放弃对浏览器的兼容

### Features

* **bos:** 支持绑定bucket和object调用API ([7d1d4e0](https://github.com/otakustay/bce-sdk/commit/7d1d4e08c28b04b23353ea2f76cc1b057384a8ce))
* 支持浏览器环境使用 ([bf0940a](https://github.com/otakustay/bce-sdk/commit/bf0940aa237eb3cc1e36967d28a9cf2d5bb03e6a))

### [0.10.1](https://github.com/otakustay/bce-sdk/compare/v0.10.0...v0.10.1) (2022-09-06)

## [0.10.0](https://github.com/otakustay/bce-sdk/compare/v0.9.2...v0.10.0) (2022-09-06)


### ⚠ BREAKING CHANGES

* 使用Node原生的fetch函数

### Features

* 支持STS认证 ([7495311](https://github.com/otakustay/bce-sdk/commit/7495311fb1687caedbae25e60e7ce4b6d1a70fb9))


* 使用Node原生的fetch函数 ([f40e20a](https://github.com/otakustay/bce-sdk/commit/f40e20a4fbfdc6324cd8521088bba2fa16c7f374))

### [0.9.2](https://github.com/otakustay/bce-sdk/compare/v0.9.1...v0.9.2) (2022-09-05)


### Features

* **sts:** 实现STS服务 ([#3](https://github.com/otakustay/bce-sdk/issues/3)) ([ce14ecb](https://github.com/otakustay/bce-sdk/commit/ce14ecb2bf2cc85e4428ea6d22459e7365dd14ba))
* 同时发布ES和CJS版本 ([7072459](https://github.com/otakustay/bce-sdk/commit/7072459fe50b2153bd64a6df78668c1a04e0ad02))

### [0.9.1](https://github.com/otakustay/bce-sdk/compare/v0.9.0...v0.9.1) (2022-09-05)


### Bug Fixes

* 发布前运行CI检查 ([820bc68](https://github.com/otakustay/bce-sdk/commit/820bc68d93190246a31166e76aa0449e489dbe2d))

## [0.9.0](https://github.com/otakustay/bce-sdk/compare/v0.8.0...v0.9.0) (2022-09-03)


### ⚠ BREAKING CHANGES

* 请求失败时抛出异常
* 发布为CommonJS格式

### Features

* **bos:** 实现BOS上传对象 ([#2](https://github.com/otakustay/bce-sdk/issues/2)) ([2ac0cca](https://github.com/otakustay/bce-sdk/commit/2ac0cca745701ce1e1a45485b8376d53f663330b))
* **bos:** 实现BOS删除对象 ([#2](https://github.com/otakustay/bce-sdk/issues/2)) ([bafc42d](https://github.com/otakustay/bce-sdk/commit/bafc42d267b09f17128e41d700fbf7dc26c41fc5))
* 请求失败时抛出异常 ([49776c9](https://github.com/otakustay/bce-sdk/commit/49776c98928fec7640d784116f15c2165399b21f))


### Bug Fixes

* 发布为CommonJS格式 ([11d7bd0](https://github.com/otakustay/bce-sdk/commit/11d7bd05eec5575973cbb3ca2ffbf78a301c60d6))

## 0.8.0 (2022-09-03)


### Features

* **bls:** 实现BLS的日志查询功能 ([#1](https://github.com/otakustay/bce-sdk/issues/1)) ([1770d9c](https://github.com/otakustay/bce-sdk/commit/1770d9c1302bc1c6ab1102ea43d15e7881fb08b7))
* **bos:** 实现BOS对象列表功能 ([#2](https://github.com/otakustay/bce-sdk/issues/2)) ([2550e46](https://github.com/otakustay/bce-sdk/commit/2550e466a5567f6a7ea14521a714e432ce778fd4))
* **bos:** 实现BOS获取单个对象 ([#2](https://github.com/otakustay/bce-sdk/issues/2)) ([594ae59](https://github.com/otakustay/bce-sdk/commit/594ae5905ad9f7c9123e3aa3bc677d21eac147bd))
* 添加请求与签名的基类 ([888b7de](https://github.com/otakustay/bce-sdk/commit/888b7ded3de6c47cd792ff091eb9160aeeb8f1ec))
