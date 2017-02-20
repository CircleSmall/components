//html校验函数
var htmlCheck = (function(){
	//配置文件
	var config = {
		//在打开标签内部闭合的标签（eg:img）
		empty : "area,base,basefont,br,col,frame,hr,img,input,isindex,link,meta,param,embed,!doctype",

		//块级标签
		block  : "address,applet,blockquote,button,center,dd,del,dir,div,dl,dt,fieldset,form,frameset,hr,iframe,ins,isindex,li,map,menu,noframes,noscript,object,ol,p,pre,script,table,tbody,td,tfoot,th,thead,tr,ul,h1,h2,h3,h4,h5,h6",

		//行内标签
		inline : "a,abbr,acronym,applet,b,basefont,bdo,big,br,button,cite,code,del,dfn,em,font,i,iframe,img,input,ins,kbd,label,map,object,q,s,samp,script,select,small,span,strike,strong,sub,sup,textarea,tt,u,var,option",

		//特殊标签
		special : "script,style,html,head,body,title",
		
		//html5新标签
		nerTag : "article,aside,audio,canvas,command,datalist,details,summary,embed,figure,figcaption,footer,header,hgroup,keygen,mark,meter,nav,output,progress,section,source,time,video",
		
		//特殊的块级元素（内部包含内联元素）
		specialBlock : "h1,h2,h3,h4,h5,h6,p,dt"
	}
	function htmlCheck(html){
	
		this.html = html;
		
		//解析配置文件
		this.empty = makeMap(config.empty);
		this.block = makeMap(config.block);
		this.inline = makeMap(config.inline);
		this.special = makeMap(config.special);
		this.nerTag = makeMap(config.nerTag);
		this.allTag = mix(this.empty,this.block,this.inline,this.special,this.nerTag);//所有标签
		this.specialBlock = makeMap(config.specialBlock);
		
		//栈空间
		this.stack = [];
		
		//返回信息
		this.message = 0;//默认是无错误
		
		//控制注释范围的变量
		this.note = false;
		
		//控制标签范围的变量
		this.tag = false;
		this.tagContent = '';
		
		//当前行
		this.line = 0;
		
	};
	htmlCheck.prototype = {
		init : function(){
			//初始化函数
			var me = this,
				lines = me.html.split(/[\n\r]/),//行数组
				stack = me.stack;
			for(var i = 0 , l = lines.length ; i < l ; i++){
				if(me.message)return me.message;
				me.line = i+1;//赋值当前行
				//先处理注释
				if((lines[i].indexOf('<!--') > -1) &&( lines[i].indexOf('-->') < 0)){
					if(me.noteFn(lines[i]))continue;
				}
				if(me.note){
					if(me.noteFn(lines[i]))continue;
				}
				//if(lines[i].indexOf('>') < 0){
				//	me.tag = true;
				//	if(me.tagFn(lines[i]))continue;
				//}
				me.parseLine(lines[i]);
			}
			if(me.message)return me.message;
			if(stack.length > 0){
				return message = "第" + stack[stack.length-1].line + "行  存在未正确闭合的标签" + stack[stack.length-1].mark;
			}
			return me.message? me.message : '无错误';
		},
		parseLine: function(lineStr){
			//解析当前行
			var me = this,
				//marks = lineStr.match(/<([\u4E00-\u9FA5\/A-Za-z0-9\s;'"!-=_]+)>/g);//用正则过滤当前行
				marks = lineStr.match(/<([^>]+)>/g);
			
			for(var m in marks){

				if(me.message)return me.message;
				
				//边界条件判断
				if((marks[m].indexOf('<!') == 0) && (marks[m].toLowerCase().indexOf('doctype') < 0)){
					var reg = /<!--[\s\S]*-->/g;
					if(!(reg.test(marks[m]))){return me.message =  "第" + me.line + "行   注释错误";}//处理一行内的注释
					marks[m] = marks[m].replace(reg,'');//删除注释
					continue;
				}
				mark = marks[m].replace(/[<>]/g,'').split(/\s+/)[0].toLowerCase(),//取得标签名
				me.condition(mark);
			}
		},
		condition : function (mark) {
		//核心的业务逻辑（处理每个标签，考虑各种边界条件）
			var me = this,
				allTag = me.allTag,
				empty = me.empty,
				stack = me.stack,
				line = me.line;
		
			if(allTag[mark] || allTag[mark.replace(/[\/]/g,'')]){
				var isClose = mark.indexOf('/') == 0 ? true : false;
				
				//核心操作（压栈、入栈）
				if(me.empty[mark]){
					//如果是像img这样在标签内闭合的标签,不压栈
				}else if(isClose){
					//如果是闭合标签
					mark = mark.replace(/[\/]/g,'');
					if(empty[mark]){
						return me.message = "第" + line + "行  " + mark + "标签不用闭合";
					}else if(stack.length == 0){
						return me.message = "第" + line + "行  多出了一个闭合标签" + mark;
					}else if(stack[stack.length-1].mark == mark){
						//如果是上一个打开标签的闭合标签
						stack.pop();//出栈
					}else {
						return me.message = "第" + stack[stack.length -1].line + "行的 " + stack[stack.length -1].mark + " 标签 与 第" + line + "行的 " + mark + " 标签 不匹配";
					}
				}else{
					//入站前检查嵌套规则
					if(me.nestFn(mark) == 0){
						//入栈
						stack.push({
							line : line,
							mark : mark
						});
					}else {
						return me.message;
					}
					
				}
			}else if(true){
				//存在不合法的标签
				return me.message = "第" + me.line + "行  存在拼写错误的标签" + mark ;
			}
		},
		noteFn : function(lineStr){
			var me = this,
				stack = me.stack,
				result = true;
			if(!me.note){
				me.parseLine(lineStr.slice(0,lineStr.indexOf('<!--')));//拿到注释开始的内容
				stack.push({
					mark : '<!--',
					line : me.line
				});
				me.note = true;
			}else{
				if(lineStr.indexOf('-->') > -1){
					//如果存在注释闭合符
					if(stack[stack.length-1].mark == '<!--'){
						stack.pop();
					}else{
						message = "第" + stack[stack.length-1].line + "注释未正确闭合";
					}
					me.parseLine(lineStr.slice(lineStr.indexOf('-->')+3));
					me.note = false;
				}
			}
			return result;
		},
		tagFn : function(lineStr){
			//处理跨行标签
			var me = this,
				stack = me.stack,
				result = true;
			
			if(me.tag){
				if(lineStr.indexOf('>') < 0){
					//如果当前行没有标签闭合符号
					me.tag = true;
					me.tagContent += lineStr;
				}else {
					me.tag = false;
					me.tagContent += lineStr.slice(0,lineStr.indexOf('>'));
					parseLine(me.tagContent);
					parseLine(lineStr.slice(lineStr.indexOf('>')+1));
					result = true;
				}
			}
			
			return result;
		},
		nestFn : function (mark){
			//标签嵌套规则
			var me = this,
				stack = me.stack,
				isblock = this.block[mark],//是否是块级元素
				isinline = this.inline[mark],//是否是行内元素
				message = 0;
			
			for(var i = 0 , l = stack.length ; i < l ; i++){
				var current = stack[i].mark;
				if(isblock){
					//块级元素
					if(me.specialBlock[current]){
						message =  "第" + me.line + "行的标签" + mark + " 不应该在" + current +  "标签里";
						me.message = message;
					}
				}else if(isinline){
					//
				}
			}
			return message;
			
		} 
	}
	function makeMap(str){
		var obj = {}, items = str.split(",");
		for ( var i = 0; i < items.length; i++ )
			obj[ items[i] ] = true;
		return obj;
	}
	//所有参数生成一个新的集合对象
	function mix() {
		var re = {};
		for ( var i = 0; i < arguments.length; i++) {
			var o = arguments[i];
			for ( var p in o) {
				if (o[p] != undefined) {
					re[p] = o[p];
				}
			}
		}
		return re;
	}
	return htmlCheck;
})();

