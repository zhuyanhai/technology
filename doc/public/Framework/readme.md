<p class="lead">
    框架目录结构说明
</p>

####以站点为例

    [站点目录]
        
        - doc 站点使用描述、常规文档存放

        - public 站点对外的根目录
            - index.php 入口文件，所有请求必经
            － doc.php 文档访问入口

        - library 类库目录，包括：框架、用户为站点自定义的类、常用工具类、第三方类库
            - F 框架类目录
            - C 用户为站点自定义的类
            - T 第三方类库
            - Utils 常用工具类

        - app 应用程序目录
            - configs 站点配置目录
            - controllers 站点控制器目录
            - models 站点业务逻辑和数据逻辑目录
            - views 站点视图目录
            - Bootstrap.php 站点自定义引导程序

        - bin cli程序目录

        - runtime 运行时数据、以及运行时需要使用的配置【发布程序生成的】