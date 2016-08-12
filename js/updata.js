;(function($){
	//创建构造函数
	function Updata(opt,inner){
		//默认参数
		var dft={
			Down:{
				Dname:"dname",
				topdown:"<div class='topdown'>↓下拉刷新</div>",
				centerdown:"<div class='centerdown'>释放更新</div>",
				bottomdown:"<div class='bottomdown'><i class='ic'></i>正在加载中...</div>"
			},
			Up:{
				Uname:"uname",
				topdown:"<div class='topdown'>上拉加载</div>",
				centerdown:"<div class='centerdown'>释放加载</div>",
				bottomdown:"<div class='bottomdown'><i class='ic'></i>正在加载中...</div>"
			},
			_height:50,
			downfn:null,
			upfn:null
		}
		//拓展参数
		this.setting=$.extend({},dft,opt);
		this.init(inner);
		this.inner=inner;
		this.inhove=false;
	}
	Updata.prototype={	
		init:function(inner){
			_this=this;
			$(inner)
			.on("touchstart",function(e){
				getTouches(e);
				touchstartfn(e,_this);
			})
			.on("touchmove",function(e){
				getTouches(e);
				touchmovefn(e,_this);
			})
			.on("touchend",function(e){
				touchendfn(_this);
			})
		}
	}
	//解决兼容问题所需要用的
	function getTouches(e){
		if(e.touches){
			e.touches=e.originaEventTouches;
		}
	}
	//touchstatr函数
	function touchstartfn(e,fn){		
		fn.clientY=e.touches[0].clientY;
		//获取滚动条距离上边的距离
		fn.scrolltop=fn.inner.scrollTop();
		fn.innerH=fn.inner.height();
		fn.listH=fn.inner.children().height();
	}
	//touchmove函数
	function touchmovefn(e,fn){		
		fn.move=e.touches[0].clientY-fn.clientY;
		if(fn.move>0){
			fn.direction="down";//向下刷新
		}else{
			fn.direction="up";//向上加载
		}
		//判断一下，只有这个downfn这个函数存在，并且这个是向下刷新，同时滚动条距离上边的距离是0的时候，才执行向下刷新
		if(fn.setting.downfn && fn.direction=="down" && fn.scrolltop==0){
			var Dname=fn.setting.Down.Dname;
			var dis=fn.setting._height;
			//在#inner前面添加下拉刷新，必须保证这个容器中不存在的时候才能加上，所以初始的时候先赋值为false,并且执行后直接赋值true
			if(!fn.inhove){
				fn.downhtml=$("<div class='"+fn.setting.Down.Dname+"'></div>");
				fn.inner.prepend(fn.downhtml);
				fn.inhove=true;
			}
			var absY=Math.abs(fn.move);
			//根据拖拽的距离判断不同的内容
			if(absY<fn.setting._height){
				fn.downhtml.html(fn.setting.Down.topdown);
				offsetY=absY;
			}else if(absY>dis && absY<dis*2){
				fn.downhtml.html(fn.setting.Down.centerdown);
				offsetY=dis+(offsetY-dis)*0.5;
			}else{
				offsetY=dis+dis*0.5+(absY-dis*2)*0.2;
			}
			$('.'+Dname).css("height",offsetY+"px");
		}
		//向上加载
		if(fn.setting.upfn && fn.direction=="up" && fn.listH<=fn.innerH+fn.scrolltop){
			var uname=fn.setting.Up.Uname;
			var dis=fn.setting._height;
			//在#inner前面添加下拉刷新，必须保证这个容器中不存在的时候才能加上，所以初始的时候先赋值为false,并且执行后直接赋值true
			if(!fn.inhove){
				fn.uphtml=$("<div class='"+uname+"'></div>");
				fn.inner.append(fn.uphtml);
				fn.inhove=true;
			}
			var absY=Math.abs(fn.move);
			//根据拖拽的距离判断不同的内容
			if(absY<dis){
				fn.uphtml.html(fn.setting.Up.topdown);
				offsetY=absY;
			}else if(absY>dis && absY<dis*2){
				fn.uphtml.html(fn.setting.Up.centerdown);
				offsetY=dis+(offsetY-dis)*0.5;
			}else{
				offsetY=dis+dis*0.5+(absY-dis*2)*0.2;
			}
			$('.'+uname).css("height",offsetY+"px");
		}
	}
	//touchend函数
	function touchendfn(fn){
		var absY=Math.abs(fn.move);	
		//通过判断有没有存在创建的那个div,再去执行离开事件
		if(fn.inhove){
			//再次判断是下拉更新，还是上拉加载的时候需要离开
			if(fn.direction=="down"){//下拉更新
				fn.dom=fn.downhtml;
				fn.bottomdown=fn.setting.Down.bottomdown;
			}else{//上拉加载
				fn.dom=fn.uphtml;
				fn.bottomdown=fn.setting.Up.bottomdown;
			}
			//判断我们移动的距离是否是超过五十，如果超过，让正在进行加载或更新内容加入，如果
			//滑动小于，就让它高度直接为0，当动画结束后，再去删除刚刚添加的，并让fn.inhove为flase
			if(absY>=fn.setting._height){
				fn.dom.html(fn.bottomdown);
				//设置fn.dom高度为_height
				fn.dom.css("height",50+"px");
			}else{
				//首先设置添加盒子为0，再去删除
				fn.dom
				.css({"height":0+"px"})
				.on("webkitTransitionEnd",function(){
					$(this).remove();
					fn.inhove=false;
				})
			}
			//加动画
			addtransition(fn.dom,1000);
		}
	}
	function addtransition(ele,time){
		ele.css({"-webkit-transition":"height "+time+"ms"})
	}
//封装插件
	$.fn.updata=function(opt){
		//调用构造函数
		new Updata(opt,$(this));
	}
})(Zepto)