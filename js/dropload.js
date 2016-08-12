;(function($){
   var DropLoad=function($ele,opt){
      var _defaults={
      	 domUp:{
      	 	domClass:"dropload-up",
      	 	domReresh:'<div class="dropload-refresh">↓下拉刷新</div>',
      	 	domUpdate:'<div class="dropload-update">释放更新</div>',
      	 	domLoad:'<div class="dropload-load"><div class="loading"></div>加载中...</div>'
      	 },
      	 domDown:{
      	 	domClass:"dropload-down",
      	 	domReresh:'<div class="dropload-refresh">↑上拉加载</div>',
      	 	domUpdate:'<div class="dropload-update">释放加载</div>',
      	 	domLoad:'<div class="dropload-load"><div class="loading"></div>加载中...</div>'
      	 },
      	 distance:50,
      	 loadUpFn:null,
      	 loadDownFn:null
      }
      this.opt=$.extend({},_defaults,opt);
      this.$ele=$ele;       // inner那个盒子
      this.insertDom=false;    // 是否插入DOM结构
      this.init();
   }

   DropLoad.prototype.init=function(){
      var $ele=this.$ele,_this=this;
      $ele.on("touchstart",function(e){
          touchFn(e);
          fnTouchStart(e,_this);
      })
      $ele.on("touchmove",function(e){
          touchFn(e);
          fnTouchMove(e,_this);
      })
      $ele.on("touchend",function(e){
          touchFn(e);
          fnTouchEnd(_this);
      })
   }
   
   // 按下
   function fnTouchStart(e,me){
   	   me._startY=e.touches[0].clientY;
   	   // 获取滚动条的位置
   	   me.scrollTop=me.$ele.scrollTop();
   	   // inner的高
   	   me.loadingHeight=me.$ele.height();
       // 列表页的高
       me.listHeight=me.$ele.children().height();
   }

   // 移动
   function fnTouchMove(e,me){
       me._moveY=e.touches[0].clientY-me._startY;
       if(me._moveY>0){
          me.direction="up";
       }else{
          me.direction="down";
       }

       var _absMoveY=Math.abs(me._moveY),distance=me.opt.distance;

       // 刷新
       if(me.opt.loadUpFn && me.direction=="up" && me.scrollTop==0){
           if(!me.insertDom){
               me.$domUp=$('<div class="'+me.opt.domUp.domClass+'"></div>');
               me.$ele.prepend(me.$domUp);
               me.insertDom=true;
           }
           e.preventDefault();
           // 判断拉动距离<指定距离
           if(_absMoveY<distance){
           	  // 拉动距离
           	  me._offsetY=_absMoveY;
              me.$domUp.html(me.opt.domUp.domReresh);
           }else if(_absMoveY>=distance && _absMoveY<distance*2){
              me._offsetY=distance+(_absMoveY-distance)*0.5;
              me.$domUp.html(me.opt.domUp.domUpdate);
           }else{
           	  me._offsetY=distance+distance*0.5+(_absMoveY-distance*2)*0.2;
           }
           // 改变div的高度
           me.$domUp.css("height",me._offsetY+'px');
           // 取消transition过渡
           fnTransition(me.$domUp,0);
       }
       //console.log(me.loadingHeight+','+me.scrollTop+','+me.listHeight);
       // 加载
       if(me.opt.loadDownFn && me.direction=="down" && me.listHeight<=(me.loadingHeight+me.scrollTop)){
           e.preventDefault();
           if(!me.insertDom){
               me.$domDown=$('<div class="'+me.opt.domDown.domClass+'"></div>');
               me.$ele.append(me.$domDown);
               me.insertDom=true;
           }
           // 判断拉动距离<指定距离
           if(_absMoveY<distance){
           	  // 拉动距离
           	  me._offsetY=_absMoveY;
              me.$domDown.html(me.opt.domDown.domReresh);
           }else if(_absMoveY>=distance && _absMoveY<distance*2){
              me._offsetY=distance+(_absMoveY-distance)*0.5;
              me.$domDown.html(me.opt.domDown.domUpdate);
           }else{
           	  me._offsetY=distance+distance*0.5+(_absMoveY-distance*2)*0.2;
           }
           // 改变div的高度
           me.$domDown.css("height",me._offsetY+'px');
           // 改变滚动条的位置
           me.$ele.scrollTop(me.scrollTop+me._offsetY);
            // 取消transition过渡
           fnTransition(me.$domDown,0);
       }
   }

   // 滑动结束
   function fnTouchEnd(me){
      me._moveY=Math.abs(me._moveY);
      if(me.insertDom){
         // 刷新还是加载
         if(me.direction=="up"){
            me.$resultDom=me.$domUp;     // 新增的那个盒子
            me.$loadDom=me.opt.domUp.domLoad;  // 加载的那个盒子
         }else{
            me.$resultDom=me.$domDown;
            me.$loadDom=me.opt.domDown.domLoad;
         }
         // 拉动的距离
         if(me._moveY>=50){
            me.$resultDom.html(me.$loadDom).css("height","50px");
            // 执行回调函数
            callback(me);
         }else{
            me.$resultDom.css("height",0).on("webkitTransitionEnd",function(){
            	$(this).remove();
            	me.insertDom=false;
            })
         }
         fnTransition(me.$resultDom,300);
         me._moveY=0;
      }
   }

   function touchFn(e){
   	   if(!e.touches){
           e.touches=e.originalEvent.touches;
   	   }
   }

   // 回调函数
   function callback(me){
      if(me.direction=="up"){
         me.opt.loadUpFn(me);
      }else{
         me.opt.loadDownFn(me);
      }
   }

   // 动画 
   function fnTransition($ele,num){
       $ele.css({
       	  '-webkit-transition':"height "+num+"ms",
       	  'transition':"height "+num+"ms"
       })
   }

   // 初始化
   DropLoad.prototype.reloadDom=function(){
   	  var me=this;
      if(this.$resultDom){
         this.$resultDom.css("height",0).on("webkitTransitionEnd",function(){
             $(this).remove();
             me.insertDom=false;
         })
      }
   }

   $.fn.dropload=function(opt){
       new DropLoad($(this),opt);
   }

})(Zepto)

/*var Animate=function(){
	this.name="kitty";
}

Animate.prototype.say=function(){
	alert("I am"+this.name)
}

var cat=new Animate();
var dog=new Animate();
console.log(cat);
console.log(dog);*/