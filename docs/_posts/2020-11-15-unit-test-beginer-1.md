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
Awesome, 我们第一个测试已经通过了。

现在让我们快进到几个月以后，假定有另一个同事修改了`sum`函数：
```js
module.exports = function sum(a, b) {
  return a - b;
};
```
为了演示，请你也做同样的修改。
现在，该同事需要在提交代码之前运行测试：`npm run test`.

然后我们可以看到如下结果：
```bash
FAIL  ./sum.spec.js
  ● sum suite › Should add 2 positive numbers together and return the result

    expect(received).toBe(expected)

    Expected value to be (using ===):
      3
    Received:
      -1

      at Object.<anonymous> (sum.spec.js:5:27)
      at Promise.resolve.then.el (node_modules/p-map/index.js:42:16)
      at process._tickCallback (internal/process/next_tick.js:103:7)

  sum suite
    ✕ Should add 2 positive numbers together and return the result (9ms)

Test Suites: 1 failed, 1 total
Tests:       1 failed, 1 total
Snapshots:   0 total
Time:        1.148s
Ran all test suites.
```
通过检查以上信息，我们可以很容易地推断出：
- `sum.spec.js`中的第5行出错了，并且从stack trace中可以看到具体错误：`at Object.<anonymous> (sum.spec.js:5:27)`.
- 仔细核对以上错误会发现，出错的代码为：`expect(sum(1,2)).toBe(3);`.
- 检查控制台输出我们会发现：我们期待的输出值为`3`但是我们得到的输出却为`-1`.
由此可见，`unit tests` 既可以防止出现回归错误又可以使我们的代码和文档保持一致。

现在请将`a-b`改回到`a+b`.

## 测试覆盖率
我们已经完成了第一个测试，但是如果要覆盖到`sum`函数的所有分支的话，我们还有很多的场景没有被测试到。
从测试函数的角度而言，我们不仅需要考虑到我们今天实现的函数，而且我们还应该考虑该如何进行演进。我们需要做到的是发现所有导致case不能正常通过的改动，即使有人在之后修改了函数的实现并且添加了新的检查和分支。

那么，就让我们添加更多的case来提高我们的覆盖率吧。

在`sum.spec.js`中添加如下代码：
```js
const sum = require("./sum.js");

describe("sum suite", function() {
  test("Should add 2 positive numbers together and return the result", function() {
    expect(sum(1, 2)).toBe(3);
  });

  test("Should add 2 negative numbers together and return the result", function() {
    expect(sum(-1, -2)).toBe(-3);
  });

  test("Should add 1 positive and 1 negative numbers together and return the result", function() {
    expect(sum(-1, 2)).toBe(1);
  });

  test("Should add 1 positive and 0 together and return the result", function() {
    expect(sum(0, 2)).toBe(2);
  });

  test("Should add 1 negative and 0 together and return the result", function() {
    expect(sum(0, -2)).toBe(-2);
  });
});
```
我们在之前的case下边又添加了4条新的case。注意我们是如何修改我们输入的数值，又是如何尝试去覆盖边界情况.（例如：+ 0 的情况）

再次运行我们的测试： `npm run test`. 我们可以得到下面的输出：
```bash
PASS  ./sum.spec.js
  sum suite
    ✓ Should add 2 positive numbers together and return the result (6ms)
    ✓ Should add 2 negative numbers together and return the result (1ms)
    ✓ Should add 1 positive and 1 negative numbers together and return the result (1ms)
    ✓ Should add 1 positive and 0 together and return the result (1ms)
    ✓ Should add 1 negative and 0 together and return the result

Test Suites: 1 passed, 1 total
Tests:       5 passed, 5 total
Snapshots:   0 total
Time:        0.842s, estimated 1s
Ran all test suites.
```

## UT中的异常处理
当我们考虑测试中未覆盖到的场景的时候，你是否想到函数处理异常的情况？
如果我们出入的是数字以外的参数会怎么样呢？

在`sum.spec.js`中添加下边的case：
```js
test("Should raise an error if one of the inputs is not a number", function() {
  expect(() => sum("0", -2)).toThrowError("Both arguments must be numbers");
});
```
我们来看一下这个case做了什么：
首先，我们使用一个匿名函数来包装了我们的被测函数： `() => sum("0", -2)`
.这是因为任何一个未被捕获的异常都会导致测试的失败。

在我们的例子中，当我们传入的参数不是数字时，`sum`函数会抛出异常。在这里我们认为抛出异常是期望行为，所以测试结果应该是`passing`而不是`failure`.

因此，我们使用匿名函数来包装`sum("0", -2)`,并且引入一个新的匹配器：`toThrowError`([https://facebook.github.io/jest/docs/expect.html#tothrowerror](https://facebook.github.io/jest/docs/expect.html#tothrowerror)).

再次运行测试，我们会得到如下错误：
```bash
FAIL  ./sum.spec.js
  ● sum suite › Should raise an error if one of the inputs is not a number

    expect(function).toThrowError(string)

    Expected the function to throw an error matching:
      "Both arguments must be numbers"
    But it didn't throw anything.

      at Object.<anonymous> (sum.spec.js:25:36)
      at Promise.resolve.then.el (node_modules/p-map/index.js:42:16)
      at process._tickCallback (internal/process/next_tick.js:103:7)
```

测试结果明确指出问题：
- 期望结果是：'to throw an error matching:"Both arguments must be numbers"'，而实际得到的结果却是：'it didn't throw anything'.
- 通过stack trace: `at Object.<anonymous> (sum.spec.js:25:36)`，我们可以找到出错的函数和它对应的参数。根据提示中的行号和列号，我们可以看到断言：`expect(() => sum("0",-2)).toThrowError('Both arguments must be numbers')`.

结论就是：我们的测试没有覆盖到这个bug。 那我们现在就着手来修复它吧。

修改我们的代码(`sum.js`),让它能够检测到错误的参数类型并抛出异常：
```js
module.exports = function sum(a, b) {
  if (typeof a !== "number" || typeof b !== "number") {
    throw new Error("Both arguments must be numbers");
  }
  return a + b;
};
```
再次运行测试，我们就可以得到`passing`的结果啦。

Note:
在我们的教程中，我们在`sum`函数实现之前，先添加了测试用例，然后导致了我们结果失败。接着我们去`sum`函数中添加代码逻辑来修复测试中发现的错误，知道结果变为`passing`。 在添加新的代码或修复已有问题的时候，你应该遵循以上流程。

## 提高测试效率
进行到此处，你可能发现每当我们修改了代码，都需要手动去运行我们的测试。这将极大地影响我们的开发效率。幸运的是，大部分的runner都可以去监控磁盘文件的变化，并自动触发测试运行。

修改`package.json`来开启该功能：
```json
 "scripts": {
    "test": "jest --watch"
  }
```
再次运行测试，我们会发现在测试结束后runner不再退出，而且当我们修改`sum.js`或者`sum.spec.js`后，测试将会自动运行。

## 下面开始技术总结
- 将测试相关依赖包安装到项目(不要使用全局安装)。这样可以同时运行多个项目且每个项目可独立升级。同时，这也更方便我们将项目的配置分享给他人。
- 将测试运行命令写入到`NPM script`中，这样就不需要去记住这些复杂的测试命令。并且这样可以将测试抽象出来，不论使用的什么样的测试runner都可以用相同的方式运行测试。
- 每一个代码文件都应该有一个与之对应的`.spec`文件，并且最好和该文件放在同一目录下。这样便于快速找到测试相关信息，且有助于其他开发者对组件的了解。
- `test`语句中的描述信息是非常重要的：确保它能够很清晰地描述出期望的条件。 可参照模板：'Should [what's to be expected] when [under which circumstances]'。
- 每条测试只应该测试一种行为。不要将多个测试场景放到一条测试中，而是应该为每一个测试场景创建相应的case，并清楚地命名和描述它们。
- 总是在实现或修改代码前，先创建一个`FAILING`的测试。