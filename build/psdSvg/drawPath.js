/* tslint:disable */
module.exports=function(ctx,layer){
  var vm=layer.vectorMask().export();
  drawPaths(ctx,paths(vm.paths,layer),layer);
  
}
function paths(paths,layer){
    var rtn=[];
    var startType=[0,3];
    var tmp=[];
    var nodeType=[1,2,4,5];
    var root=layer.node.root();
    var preKeys=["preceding","anchor","leaving"];
    for (var i=0;i<paths.length;i++){
      var p=paths[i];
      var rt=p.recordType;
      if (startType.indexOf(rt)>-1){
        rtn.push(tmp);
        tmp=[];
      }else if (nodeType.indexOf(rt)>-1){
        var obj={};
        preKeys.forEach(function(key){
          if (p[key]){
            obj[key]=vectConvert(p[key],layer,root);
          } 
        });
        obj.closed=p.closed;
        obj.linked=p.linked;
        tmp.push(obj);
      }
    }
    rtn.push(tmp);
    return rtn;
}
function vectConvert(obj,layer,root){
  var horiz=obj.horiz>1?0:obj.horiz;
  var vert=obj.vert>1?0:obj.vert;
  var rect=layer.node;
  if (layer.mask && layer.mask.disabled===false){
    rect=layer.mask;
  }
  return {
    horiz:root.width*horiz-rect.left,
    vert:root.height*vert-rect.top
  };

}

function drawPaths(ctx,paths,layer){
  ctx.beginPath();
  paths.forEach(function(path){
    if (path.length>0){
      ctx.moveTo(path[0].anchor.horiz,path[0].anchor.vert);
      for (var i=0;i<path.length;i++){
        var p0=path[i];
        var p1=path[i+1]|| path[0];
        ctx.bezierCurveTo(
          p0.leaving.horiz,
          p0.leaving.vert,
          p1.preceding.horiz,
          p1.preceding.vert,
          p1.anchor.horiz,
          p1.anchor.vert
        )
      }
      if (path[path.length-1].closed){
        ctx.closePath();
      }
      // stroke(ctx,layer);
    }
  });
  fill(ctx,layer);
}

function stroke(ctx,layer){
  var style="rgb(0,0,0)";
  if (layer.solidColor){
    var sc=layer.solidColor();
    style="rgb("+sc.color().join(",")+")";
  }
  ctx.strokeStyle=style;
  ctx.stroke();
}
function fill(ctx,layer){
  var fillStyle="rgb(0,0,0)";
  if (layer.solidColor){
    var sc=layer.solidColor();
    fillStyle="rgb("+sc.color().join(",")+")";
  }
  ctx.fillStyle=fillStyle;
  ctx.fill("evenodd");
}