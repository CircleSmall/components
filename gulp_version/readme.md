#   gulp �汾�Ų��

> �����html�ļ��� �������õ�css/js/image ��url,�����ϰ汾��

> �����css �ļ�, ������background �� url 


```
    var version = require("./version");
    var version_num = new Date().getTime().toString();
    //�ϲ�css
	gulp.task('css-concat', function() {
	    return gulp.src(configCss.src)
	        .pipe(concat(configCss.name))
	        .pipe(version(version_num)) //ʹ�÷�ʽ���������һ��
	        .pipe(minifyCSS())
	        .pipe(gulp.dest(configCss.output));
	});
```

