# bos-ui

### 目前已移植的组件列表:

1. Alert组件
2. Badge组件
3. BreadCrumb组件
4. button组件
5. Card组件
6. checkbox组件
7. Collapse折叠组件
8. Dialog组件
9. dateTimePicker时间日期选择器
9. elementUI的一套图标库
10. Input，inputNumber组件
11. Menu导航菜单组件
12. Select菜单组件
13. Tag标签组件
14. Tooltip小标签组件
15. Carousel轮播图组件
16. DropDown下拉菜单组件（表现上有bug，和select似乎有重复）
17. Form表单组件
18. Loading组件
19. message,提示消息组件
20. messageBox弹出框组件
21. notification侧边弹出提示框组件
22. pagination分页组件，（显示存在一个问题）
23. picker选择器组件
23. popover组件
24. progress进度条组件
25. radio单选框组件
26. range滑动条组件
27. step步骤组件
28. Switch选择器组件
29. table表格组件（在移动端具体作用不明，表现也不好）
30. Tabs标签页组件
31. Trees树形组件

### 项目结构

BOS-UI

    --bos-ui-lib            bosui库
    --node_modules          UI库依赖文件
    --packages              UI库组件源码
    --src                   UI库工具函数源码
    --theme-default         UI库css源码
    --package.json          
    --webpack.config.js     webpack配置文件
    --yarn.lock

### 编译方法
1. 在项目主目录下，运行```npm run build```指令。
2. 在theme-default目录下，运行```gulp build```指令。

生成的库文件，存放在bos-ui-lib文件夹下。


### 工具链
#### PostCSS-Salad
样式的处理使用基于PostCSS的CSS解决方案。[PostCSS-Salad][http://elemefe.github.io/postcss-salad/]
PostCSS-Salad提供下一代的CSS语法规则，包括自定义变量、自定义媒体查询、自定义选择器、选择器嵌套等。
postcss-salad配置文件：

```json
{
  "browsers": ["ie > 8", "last 2 versions"],
  "features": {
    "bem": {
      "shortcuts": {
        "component": "b",
        "modifier": "m",
        "descendent": "e"
      },
      "separators": {
        "descendent": "__",
        "modifier": "--"
      }
    }
  }
}
```
本项目中主要使用了postcss-bem插件，自动处理css中的连接符。@b代表-,@e代表__,@m代表--

```css
@component-namespace bos {
  @b badge {
    position: relative;
    vertical-align: middle;
    display: inline-block;

    @e content {
      background-color: var(--badge-fill);

      @m fixed {
        position: absolute 0 calc(var(--badge-size) / 2 + 1) * *;
        transform: translateY(-50%) translateX(100%);
        @when dot {
          right: 5px;
        }
      }
      @when dot {
        size: 8px 8px;
        padding: 0;
        right: 0;
        border-radius: 50%;
      }
    }
  }
}
```
上例中，"@component-namespace bos"定义了所有类名的前缀为bos
"@b badge"会被编译为"-bagde"
"@e content"会被编译为"__content"
"@m fixed"会被编译为"--fixed"
"@when"
var.css中存放所有预先定义好的变量，在其他文件中引入以var(变量名)的方式使用，如上例中的"var(--badge-fill)"

#### gulp
gulpfile.js
```javascript
var fs = require('fs')
var gulp = require('gulp');
var path = require('path');
var postcss = require('gulp-postcss');
var concat = require('gulp-concat');
var cssmin = require('gulp-cssmin');
var merge = require('merge-stream');
var salad = require('postcss-salad')(require('./salad.config.json'));

function getFolders(dir) {
  return fs.readdirSync(dir)
    .filter(function (file) {
      return fs.statSync(path.join(dir, file)).isFile()
    });
}


gulp.task('compile', function () {
  return gulp.src('./src/*.css')
    .pipe(postcss([salad]))
    .pipe(cssmin())
    .pipe(gulp.dest('./lib'))
});

gulp.task('copyfont', function () {
  return gulp.src('./src/fonts/**')
    .pipe(gulp.dest('../bos-ui-test/lib/fonts/'));
});

gulp.task('tolib', ['compile'], function () {
  var folders = getFolders('./lib/');
  var tasks = folders.map(function (folder) {
    folder = folder.split('.')[0]
    if(folder!='index'){
      return gulp.src( `./lib/${folder}.css`)
      .pipe(gulp.dest(`../bos-ui-test/lib/${folder}/`))
    }else{
      return gulp.src( `./lib/${folder}.css`)
      .pipe(gulp.dest(`../bos-ui-test/lib/` ))
    }
    
  });
  
  return merge(tasks);

})
gulp.task('build', ['compile', 'copyfont', 'tolib']);
```
compile任务，从src文件夹中获取所有css文件，通过postcss-salad插件，将文件编译成浏览器能够识别的css格式，
然后再通过cssmin插件压缩代码，最后输出到lib文件夹中。

#### webpack
webpack是UI库的打包工具，本项目通过webpack,将所有的UI组件打包成一个bos-ui.bundle.js文件，使用时，只需要将该文件和index.css引入即可。
本项目中主要用到了一下几个loader:
```javascript 

loaders: [{
      test: /\.vue$/,
      loader: 'vue-loader',

    }, {
      test: /\.(js|jsx|babel|es6)$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
      query: {
        presets: ['es2015'],
        plugins: ['transform-vue-jsx']
      }

    }, {
      test: /\.(png|svg|jpg|gif)$/,
      loader: 'url-loader?limit=8192&name=./[name].[ext]?[hash]'
    }, {
      test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
      loader: 'url-loader?limit=8192&name=./[name].[ext]?[hash]'
    }]



vue-loader 用于解析vue文件，babel-loader用于解析js，url-loader用于解析小图片和字体文件，并以base64的形式存在bundle中
部分代码中存在jsx代码，则需要调用transform-vue-jsx插件给loader添加解析jsx的能力。
详细配置在项目根目录下webpack.config.js

### 添加组件的流程

1. 在/package中添加组件，并在/src/index.js文件中引入组件，完成组件的注册
2. 在根目录下完成执行npm run build打包组件
3. 将分离后的css放入/theme-default/src中，并在/theme-default/src/index.css中引入css文件
4. 在/theme-default目录下执行gulp build，编译并压缩css文件

本项目中，bos-ui.bundle.js和index.css直接输出到了测试工程bos-ui-lib文件夹中。

### 使用UI库

引入生成的bos-ui.bundle.js和index.css即可使用
```javascript
import bosUI from '../lib/bos-ui.bundle.js'

import '../lib/index.css'

Vue.use(bosUI)
```