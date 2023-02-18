import React, { useState } from 'react';
import Head from "next/head"
import Module from '../cpp_out/add';

const App = () => {

  const [test, settest] = useState();

  async function loadModule() {
    const module = await Module();
    const res = module.ccall("add", "number", ["number", "number"], [1, 2]);
    settest(res)
    console.log('add result:', res, module._add(1, 5));
    console.log("union", module._union_area())
    // ,module._add(1,5)
  }
  // loadModule();
  // async function tt(){
  //     const instance = await Module();
  //     // 直接使用
  //     // instance._add(1,5);
  //     // cwrap 注册后使用
  //     const add = instance.cwrap("add", "number",["number","number"]);
  //     console.log("cwrap: ", add(1,2),instance._add(1,5));
  //     // 直接使用ccall
  //     console.log("ccall: ", instance.ccall("add","number", ["number","number"], [1,2]));
  // }
  // tt();

  return (
    <div className="min-h-screen">
      <Head>
        <title>Degen EDA</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <button className="btn" onClick={() => loadModule()}>add(1+2)</button>
      <h1 className=" ">{test}</h1>
    </div>
  );
}
export default App


