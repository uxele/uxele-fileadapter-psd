/* tslint:disable */
module.exports=toSvg;

var drawer=require("./drawPath");

function toSvg(layer){
  if (!layer.vectorMask){
    throw("toSvg can only render vector layer.");
  }
  var vm=layer.vectorMask();
  if (!vm.loaded){
    vm.load();
  }
  vm=vm.export();
  if (vm.disable){
    //TODO what to do?
  }
  var Context=require("./canvas2svg");
  var ctx=new Context(layer.width,layer.height);
  drawer(ctx,layer);
  return ctx.getSerializedSvg();
}


