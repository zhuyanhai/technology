<p class="lead">
    这里是技术文档库.
</p>

<hr/>

###书写Markdown的语法，请参考如下：

####概述

    字符串转义：
    & = &amp;

####标题

    # 这是 H1
    ## 这是 H2
    ### 这是 H3
    依次类推 1 - 6 个 #

####区块引用 Blockquotes

    >区块引用

####区块引用可以嵌套（例如：引用内的引用），只要根据层次加上不同数量的 > ：

    >区块引用
    >>嵌套区块引用

####列表

    无序列表使用星号、加号或是减号作为列表标记：

    * Red
    * Green
    * Blue

    + Red
    + Green
    + Blue

    - Red
    - Green
    - Blue

    有序列表则使用数字接着一个英文句点：

    1. a
    2. b
    3. c

####嵌套列表

    注意只能两级
    * Red
      * Green
    * Blue

####链接

    添加链接跳转 [an example] = 链接名字 | http://example.com/ = href | "Title" = a标签属性title
    This is [an example](http://example.com/ "Title") inline link.

####强调

    *single asterisks* = em
    **double asterisks** = strong

####图片

    ![Alt text](http://upload.utan.com/path/to/img.jpg)
    ![Alt text](http://upload.utan.com/path/to/img.jpg "Optional title")

####反斜杠

    Markdown 支持以下这些符号前面加上反斜杠来帮助插入普通的符号：
    \   反斜线
    `   反引号
    *   星号
    _   底线
    {}  花括号
    []  方括号
    ()  括弧
    #   井字号
    +   加号
    -   减号
    .   英文句点
    !   惊叹号