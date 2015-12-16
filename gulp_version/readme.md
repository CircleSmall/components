#   gulp 版本号插件

> 如果是html文件： 过滤引用的css/js/image 的url,并加上版本号

> 如果是css 文件, 则会过滤background 的 url 


```
    var version = require("./version");
    var version_num = new Date().getTime().toString();
    //合并css
	gulp.task('css-concat', function() {
	    return gulp.src(configCss.src)
	        .pipe(concat(configCss.name))
	        .pipe(version(version_num)) //使用方式与其他插件一致
	        .pipe(minifyCSS())
	        .pipe(gulp.dest(configCss.output));
	});
```

