---
title: Centos中升级Python后导致yum无法使用怎么办？
date: 2019-01-12 10:38:18
categories:
    - python
tags:
    - linux
    - centos
author: Dyang
---

>CentOS 中自带了Python运行环境，然而自带的Python版本往往并不是我们需要的版本，此时我们会对Python进行升级。升级过后很多人却发现yum却无法使用了，那我们应该如何修复这个问题呢？ <br/>
*本文使用的系统环境为centos7.5*
<!-- more -->
# 问题描述
Python 升级后yum无法使用主要分为两种具体情况：

1. 安装了一个新的Python环境，加上系统自带的Python环境，出现了多个Python环境并存的情况。
2. 安装了新的Python环境并删除了系统自带的Python环境

以上两种情况都可能造成用户在使用yum命令时显示`No module named yum`的错误。

# 问题分析
## 问题1的修复方案
当遇到yum出错的时候，我们的第一反应就是去Google一下该报错信息。Google到的结果就是说yum运行的Python版本不对，需要将yum的执行Python环境指向系统自带的Python环境。
即修改yum文件的第一行路径指向系统Python：
```python
# !/usr/bin/python26
```
该方法可以修复由第一种情况导致的yum问题。

## 修复问题2时遇到的新问题
然而当你是由于第二种情况导致的yum出现问题的时候，你会发现一些新的问题：
- 首先，系统自带的Python环境已经被删除掉了，无法将yum的Python运行环境指向原环境。
- 根据第一种问题的解法，很多人会自然地想到再重新安装一个和之前系统环境相同版本的Python，如：系统自带Python版本为2.7.5，那么就重新安装一个2.7.5的Python，然后将yum的环境指向2.7.5。然而这样并不能解决该问题。

*明明已经安装了和系统自带Python环境相同的版本，为什么还是不行呢？* 

## 让我们来找找真正的原因

我们先来看看yum的报错信息`No module named yum`。经常使用Python的朋友应该会觉得很熟悉，当我们在Python环境中`import`某个模块时，若该Python环境下没有找到该Python模块，则会抛出`No module named xx`的错误。

如果还保留了系统自带Python的朋友可以在site-package目录下找到叫yum的文件夹，故可以确定该问题的原因就是缺少了yum模块。

既然是少了yum的Python模块，我们直接通过`pip install yum`或在Pypi下载一个yum就可以了么？答案是否定的，因为Pypi上并没有叫做yum的模块。

那我们要怎么样才能把yum模块安装到Python环境中呢？

# 解决问题
我们需要从系统镜像中提取并安装Python和yum相关的package。
1. 首先到centos官网下载**对应版本**的ISO镜像（minial版本就可以了）。
    如果不知道自己的系统是哪个版本，可以通过下面命令查看：
    ```bash
    $ cat /etc/centos-release
    ```
2. 使用解压缩软件提取镜像中的内容。
3. 从`Package`目录下复制如下rpm包到任意一个文件夹
    ```bash
    python*.rpm
    yum*.rpm
    rpm*.rpm
    ```
4. 进入该文件夹，运行如下命令安装所有的rpm包
    ```bash
    $ rpm -ivh --nodeps --replacepkgs python*
    $ rpm -ivh --nodeps --replacepkgs yum*
    $ rpm -ivh --nodeps --replacepkgs rpm*
    ```
    *注意：如果安装过程中出现缺少依赖的错误，请按照同样方式从Package文件夹中提取相应rpm包并安装*
5. 安装完成后运行`python -V`查看版本，若发现版本与新装Python版本不同，可以通过以下命令查看Python命令的软连接是否指向了正确的路径
    ```bash
    $ ls -l /usr/bin/python*
    ```
6. 找到对应版本后，可将yum文件的运行环境指向该路径，既修改yum文件的第一行,例如
    ```python
    #!/usr/bin/python27
    ```
7. 再次运行`yum`命令，发现错误不在了，一切回到正常。

>在实际操作中，小编遇到了一个奇怪的问题：
>即使我通过`rpm -e --nodeps python`删除掉了本机上的Python环境，当系统Python包安装完成后，运行`python -V`会发现Python版本依然是之前安装过的某个版本，而不是最新安装的版本。经过调查发现，其实是之前某个版本的Python被安装到了`/usr/local/bin/python27`下，删除该版本即可。