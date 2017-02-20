/*页面逻辑控制*/
var submit = getElementsByClassName('btn')[0],
//动画效果控制
    inputDiv = document.getElementById("mod_input"),
	outputDiv = document.getElementById("mod_output"),
	inputWidth = 47,
	outputWidth = 47,
	inputInterval,
	outputInterval;
	
inputDiv.onclick = function () {
	if(inputWidth > 50 && outputWidth < 40){
		return
	}else{
		if(outputInterval){
			clearInterval(outputInterval);
		}
		if(inputInterval){
			clearInterval(inputInterval);
		}
		inputInterval = setInterval(function(){
			if(inputWidth > 50 && outputWidth < 40){
				clearInterval(inputInterval);
			}else{
				inputDiv.style.width = inputWidth++ + '%';
				outputDiv.style.width = outputWidth-- + '%';
			}
		},10);
	};
}

outputDiv.onclick = function () {
	if(outputWidth > 50 && inputWidth < 40){
		return;
	}else{
		if(outputInterval){
			clearInterval(outputInterval);
		}
		if(inputInterval){
			clearInterval(inputInterval);
		}
	};
	outputInterval = setInterval(function(){
		if(outputWidth > 50 && inputWidth < 40){
			clearInterval(outputInterval);
		}else{
			inputDiv.style.width = inputWidth-- + '%';
			outputDiv.style.width = outputWidth++ + '%';
		}
	},10);
}


//提交函数
function submitFun(){
	//主程序开始校验
	var html = document.getElementById("input").value;
	var output = document.getElementById("output");
	if(html.length > 0){
		var newCheck = new htmlCheck(html);
		output.value = newCheck.init();
	}else {
		output.value = '请先输入html';
	};
}

submit.onclick = submitFun;

//通过类名得到节点
function getElementsByClassName (str,root,tag){ //三个参数(第一个必选，后两个可选)：类名，父容器，标签名

 if(root){ 
 	//传入了父容器的参数
    root = typeof root == "string" ? document.getElementById(root) : root; 
  } else { 
  	//没有传入父容器的参数，默认父容器body
    root = document.body; 
 } 
  tag = tag || "*"; //默认标签式所有标签
  var els = root.getElementsByTagName(tag),arr = [];  
  //遍历每个标签
  for(var i=0,n=els.length;i<n;i++){ 
  	//以空格为断点分割类名，并遍历
    for(var j=0,k=els[i].className.split(" "),l=k.length;j<l;j++){ 
      if(k[j] == str){ 
	  	//如果存在类名，把节点加入arr数组中，并break
		arr.push(els[i]); 
		break; 
	} 
   } 
 } 
 return arr; 
}; 