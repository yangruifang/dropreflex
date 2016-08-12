$("#inner").dropload({
    loadUpFn:function(me){
       $.ajax({
       	  url:'data/update.json',
       	  type:"get",
       	  dataType:"json",
       	  success:function(result){
             data=result.lists,
             html="";
             $.each(data,function(i,obj){
                 html+='<a href="#">'
                          +'<img src="'+obj.pic+'">'
                          +'<h3>'+obj.title+'</h3>'
                          +'<span>'+obj.date+'</span>'
                       +'</a>';
             })
             setTimeout(function(){
             	$(".lists").html(html);
                me.reloadDom();
             },1000)
       	  }
       })
    },
    loadDownFn:function(me){
       $.ajax({
       	  url:'data/more.json',
       	  type:"get",
       	  dataType:"json",
       	  success:function(result){
             data=result.lists,
             html="";
             $.each(data,function(i,obj){
                 html+='<a href="#">'
                          +'<img src="'+obj.pic+'">'
                          +'<h3>'+obj.title+'</h3>'
                          +'<span>'+obj.date+'</span>'
                       +'</a>';
             })
             setTimeout(function(){
             	$(html).appendTo($(".lists"));
                me.reloadDom();
             },1000)
       	  }
       })
    }
});