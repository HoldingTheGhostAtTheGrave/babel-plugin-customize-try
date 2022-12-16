# babel-plugin-customize-try  babel 插件

### 方法用途 ： 
    1. 主要是利用在项目中需要进行统一 的 错误 提交请求 

    2. catchs 自定义内容 方便调用 统一请求接口



### 说明 
* 1. 需要安装 一个 @babel/template babel 包
```js
    //  安装命令
    npm install babel-plugin-customize-try @babel/template 
```
* 2. 使用   需要添加 Try Catch 的方法上添加 一个 @babel-true-try 
    - 提示说明该方法 需要 try catch 对该方法进行报错处理
```js
    // babel.config.js | .babelrc
    plugins: [
        [ 'babel-plugin-customize-try', { 'catchs': ' console.log(error) ' } ],
    ]
```

### 参数文档

```js
    {
        "catchs": "",  // catch 中的内容 可根据需求进行匹配 没有默认值 或者 默认值为空
        "globalTry":true ,// 默认值 true 全局 匹配 函数添加 try catch 错误处理 
        "showName": '@babel-show-try', // globalTry 为 false 时 有效果  ， 表示 某一个函数需要自动添加 try catch
        "hideName": '@babel-hide-try', // globalTry 为 true 时 有效果  ， 表示 某一个函数不需要自动添加 try catch
    }
```