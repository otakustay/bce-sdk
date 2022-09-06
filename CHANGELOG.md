# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

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
