---
title: KOA2 中使用mongoose的异步方法
date: 2018-12-08 10:58:26
categories:
    - frontEnd
tags:
    - javascript
    - nodejs
    - mongodb
author: Dyang
---


>在创建个人博客的时候在后端选择上使用了koa2, 数据库选择的是mongodb. 所以mogoose就成为了后端连接db的选择
<!--more-->

参考mongoose官方文档的快速开始后就迅速开工
```js
const mongoose = require('mongoose');
const Article = mongoose.model('Article', articleSchema);

const saveArticle = async ctx => {
    new Article({name: 'test'}).save(err => {
        if(err) {
            console.log(err);
        }
    });
    // response
    ctx.body = 'success';
}
```
调试过后发现一切正常，👌 那我们继续写查询article的方法
```js
const getArticleList = async ctx => {
    Article.find({}, function(err, docs) {
        if(err) {
            console.log(err);
        } else {
            ctx.body = docs;
        }
    })
}
```
感觉一切都没问题，结果一调试，`Not Found`.
什么情况？难道路由出问题了？
仔细检查了一遍，发现路由并没有问题，而且从日志上看，请求确实收到了，那就只有一种解释了：ctx.body没有返回。

再回去看看我们的ctx.body是在回调函数中设置的，为了验证docs确实有值，我们在回调函数中添加`console.log(docs)`后再次访问该API，发现console内是有输出的，然而页面上拿到的响应还是`Not Found`.

实验得出结论：find()是一个异步方法。 😓绕了一圈发现居然是因为异步的问题，😖

那我们就对它做一下处理
```js
const getArticleList = async ctx => {
    let result = [];
    await Article.find({}, function(err, docs) {
        if(err) {
            console.log(err);
        } else {
            result = docs;
        }
    });
    ctx.body = result;
}
```
这下该没问题了吧，赶紧去试一下。咦！What? `Not Found`的问题没有了，但是返回值一直是`[]`。那这就说明await完全没有起作用啊。

跑mongoose官网上去一看，find方法的返回值竟然不是Promise。
>Mongoose async operations, like .save() and queries, return **thenables**. This means that you can do things like MyModel.findOne({}).then() and await MyModel.findOne({}).exec() if you're using async/await.

按照官方的说法是Mongoose的异步方法返回的都是thenable。什么是thenable呢？也就是说他不是一个完全的promise，但是返回的这个thenable对象是有一个then方法可以调用的。

难怪刚才我们await不生效，原来它根本就不是Promise。那我们该肿么办呢？继续看了一下官网的介绍，发现`query.exec()`方法返回的是Promise，这就解释了上边的`await MyModel.findOne({}).exec() if you're using async/await.`

继续改造
```js
const getArticleList = async ctx => {
    const doc = await Article.find().exec();
    ctx.body = doc;
}
```

测试通过，一切正常。🎉
