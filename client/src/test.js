const Module = require('../src/test')

async function go() {

  // const module2 = await Module;

  const polys = ["110,10 110,230 180,10 180,230", "150,10 150,230 220,10 220,230"]
  console.log(polys.length)
  var input = "hello";   //生成字符串  
  var input_ptr = allocateUTF8(input);  //生成字符串的指针  
  // var retPtr = Module._reply(input_ptr);  //调用c方法  
  // var resValue = UTF8ToString(retPtr);  //将返回指针转成字符串  
}
go()