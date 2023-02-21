import React, { useState, useEffect, useRef } from 'react';
import Head from "next/head"
import Module from '../cpp_out/add';
// import Snap from "snapsvg";
import { offset } from 'svg-polygon-points';
const App = () => {
  const po = useRef()
  const [test, settest] = useState();
  const [first, setfirst] = useState()
  let polys = ["110,10 110,230 180,230 180,10", "150,10 150,230 220,230 220,10"]
  let pointsNow = { p1: polys[0], p2: polys[1] }
  let p1, p2
  let s1, s2
  async function getSnap() {
    let { default: Snap } = await import('snapsvg-cjs')
    console.log("Snap", Snap)
    s1 = Snap("#s1")
    s2 = Snap("#s2")
    p1 = s1.polygon(polys[0])
    p1.attr({ fill: "yellow", stroke: "green", id: "p1" });
    p2 = s2.polygon(polys[1])
    p2.attr({ fill: "yellow", stroke: "green", id: "p2" });
    var dragStart = function (x, y, e) {
      // console.log("dragStart",this)

      // Save some starting values
      this.ox = this[0].attr("x");
      this.oy = this[0].attr("y");
      this.ow = this[0].attr("width");
      this.oh = this[0].attr("height");

      this.dragging = true;
    };

    var dragMove = function (dx, dy, x, y, e) {
      console.log("dragMove", this, this[0].node, e)
      // console.log(s1.node.innerHTML.polygon)

      // Inspect cursor to determine which resize/move process to use
      switch (this.attr("cursor")) {
        default:
          this[0].attr({
            //bottomLeft
            // cx: e.offsetX - this.ow * 0.5,
            // cy: e.offsetY + this.oh * 0.5
            _x: polys[0],
            // points: offset(this[5].node.attributes[0].value, e.offsetX - this.ow, e.offsetY - this.oh)
            points: offset(polys[0], e.offsetX - this.ow, e.offsetY - this.oh)
          });
          // console.log("AAA", this[0].node.attributes[0].value, e.offsetX, e.offsetY, e.offsetX - this.ow)
          break;
      }
    };

    var dragEnd = function () {
      this.dragging = false;
      console.log("dragEnd", this, this[0].node.attributes.points.value, this[0].node.attributes.id.value)
      pointsNow[this[0].node.attributes.id.value] = this[0].node.attributes.points.value
    };

    var changeCursor = function (e, mouseX, mouseY) {
      // Don't change cursor during a drag operation
      if (this.dragging === true) {
        return;
      }

      this.attr("cursor", "move");
    }
    var sGroup = s1.group(
      p1
    );
    sGroup.mousemove(changeCursor);
    sGroup.drag(dragMove, dragStart, dragEnd);

    var s2Group = s2.group(
      p2
    );
    s2Group.mousemove(changeCursor);
    s2Group.drag(dragMove, dragStart, dragEnd);

  }

  let showPoints = function () {
    console.log("showPoints",
      // this, 
      // this[0].node.attributes[0].points
      pointsNow
    )

  }

  useEffect(() => {
    getSnap()

  }, [])


  // const handleClick = (e: React.MouseEvent) => {
  //   console.log('clicked', e.currentTarget)
  // }
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
      <button className="btn" onClick={() => {
        let pa = [...po.current.points].map(seg => `${seg.x},${seg.y}`).join(' ')
        let n = offset(pa, 9, 6)
        console.log(po.current
          // ,po.current.points
          , pa
          , n
          // ,p.attr.points
        );
        // po.current.points=n
        po.current.setAttribute("points", n);

      }}>po</button>
      <button className="btn" onClick={() => showPoints()}>consloe.log svg points</button>
      <h1 className=" ">{test}</h1>
      <svg width="100vw" height="100vh">
        <polygon
          id="po"
          ref={po}
          // points="200,10 250,190 160,180"
          points={[[200, 10], [250, 190], [160, 180]]}
          style={{ fill: "lime", stroke: "purple", strokeWidth: 1 }}
        />
        {/* <polygon
          id="po2"
          // ref={po}
          points="20 1 250 190 160 180"
          // points={[[200, 10], [250, 190], [160, 180]]}
          style={{ fill: "lime", stroke: "purple", strokeWidth: 1 }}
        /> */}
        <svg
          id="s1"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
        />
        <svg
          id="s2"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
        />
      </svg>
    </div>
  );
}
export default App


