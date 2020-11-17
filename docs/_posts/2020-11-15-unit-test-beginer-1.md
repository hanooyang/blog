---
title: unit test 入门指南 - 函数测试
date: 2020-11-15 11:48:18
categories:
    - javascript
tags:
    - test
author: Dyang
---

> 本文翻译自：https://www.jstwister.com/post/unit-testing-beginners-guide-testing-functions/

如果你正打算使用unit test来测试你的代码而不知道如何开始，或者想要了解ut的最佳实践，这篇文章或许就是你正寻找的东西。

在这个系列中，我将带领你从基本原则开始进入单元测试的世界，到最后你将掌握一些目前你可能不知道的高级技巧。

系好安全带，准备出发。

在开始本教程之前，你需要先安装以下依赖：

- [NodeJs](https://nodejs.org/en/download/) - 你可能已经安装过了
- [Jest](https://jestjs.io/) - 这将是我们会使用到的单元测试框架

为了确保我们能够顺利开始，你需要完成如下的步骤：

1. 确保NodeJs已经安装: `node -v`. 请确保你的`Node`版本>= 6.x.
2. 新建一个名为`unit-testing-functions`的文件夹
3. 进入该文件夹（`cd unit-testing-functions`）并初始化项目（`npm init --yes`）
4. 现在你应该可以在该目录下看到`package.json`文件
5. 安装`Jest`: `npm i jest --save-dev`
6. 你可以通过该命令验证`Jest`是否正确安装: `./node_modules/.bin/jest -v`

一切准备就绪，让我们开始单元测试之旅。

我们将从简单的函数开始我们的学习，并且随着学习的深入，我们将在系列课程的后边涉及到更加复杂的场景。

## 准备被测代码

首先创建一个简单的函数:

在`unit-testing-functions`文件夹下新建文件: `sum.js`并定义以下函数：

```js
module.exports = function sum(a, b) {
  return a + b;
};
```

该函数将会是我们的被测对象。在单元测试中，我们希望能够有尽可能多的输入类型，以确保覆盖到所有的分支条件。

虽然目前我们的函数中并没有分支条件，但我们还是需要改变输入参数来确保该函数在今后的修改中也能够正确运行。

## 认识测试文件

每个代码文件都应该有一个与之对应的`Spec`文件， 该文件通常和代码文件放在一起。让我们新建一个 `sum.spec.js`。

在`spec`文件中，我们将放置测试代码。

为了方便管理和产生报告，包括`jest`在内的测试框架都将测试代码放置在`test suit`里边，每个`test suit`都由一个或多个测试组成 。

现在，让我们在`sum.spec.js`中添加第一个测试。

```js
const sum = require("./sum.js");

describe("sum suite", function() {
  test("Should add 2 positive numbers together and return the result", function() {
    expect(sum(1, 2)).toBe(3);
  });
});
```

是不是不太明白上边的代码？没关系，下边我们一一解释：

这一步做了什么呢？

```js
const sum = require("./sum.js");
```

这一步，我们引入被测对象。`jest`是运行在`NodeJs`端， 所以我们在这里使用了`module.exports`来导出函数并使用`require`在其他文件中引用。

下一步，我们定义了一个`test suit`，所有和`sum`函数相关的测试将被放到这里：

```js
describe("sum suite", function() {
  // Define here the individual tests
});
```

最后，我们添加了第一个测试（在接下来的教程中，我们会添加更多的测试）：

```js
test("Should add 2 positive numbers together and return the result", function() {
  expect(sum(1, 2)).toBe(3);
});
```

关于下面这一部分的代码你可能还是不太清楚，没关系，让我们来解释一下：

```js
expect(sum(1, 2)).toBe(3);
```

这是我们单元测试的一个基本要素，我们称之为`assertion`(断言)。

断言是描述程序应有行为的一种基本方法。在我们的例子里边，我们期望调用`sum (1, 2)` 能够得到结果3。

例子中的`toBe`被称为`matcher`(匹配器)。`jest`提供了很多的`matcher`，每一个`matcher`都向我们提供某方面验证的帮助，例如：判断某些测试中对象是否相等。

那`expect`是怎么来的呢？我们并没有在文件中引用它。

这是因为`jest`将`describe`, `test`, `expect`等函数注册成为了全局变量，所以我们不需要再单独引入他们。[这里](https://jestjs.io/docs/en/api)可以查看完整的函数列表。

## 运行我们的测试用例

你可以选择在我们的工作目录(`unit-testing-functions`)下直接调用`jest`：`./node_modules/.bin/jest`

另外一种更好的跨平台解决方案是定义`NPM script`。现在打开`package.json`，找到下面这一段：

```json
"scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  }
```

修改为：

```json
"scripts": {
    "test": "jest"
  }
```

可以看到，我们并没有指定`jest`的全路径，这是因为`NPM`会先从`./node_modules/.bin/`查找可执行文件。

现在我们开始运行`NPM script`: `npm run test`；

你可以看到如下的输出：

```bash
PASS  ./sum.spec.js
  sum suite
    ✓ Should add 2 positive numbers together and return the result (6ms)

Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
Snapshots:   0 total
Time:        1.089s
Ran all test suites.
```





