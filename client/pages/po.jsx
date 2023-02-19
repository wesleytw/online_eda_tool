import React, { useState, useEffect, useRef } from 'react';
import Head from "next/head"
import Module from '../cpp_out/add';
// import Snap from "snapsvg";
import { offset } from 'svg-polygon-points';
const App = () => {
  const po = useRef()
  const [test, settest] = useState();
  const [first, setfirst] = useState()
  var p
  async function getSnap() {
    let { default: Snap } = await import('snapsvg-cjs')
    console.log("Snap", Snap)
    const s = Snap("#svg")
    let c = "110,10 110,230 80,30"
    p = s.polygon(c)
    p.attr({ fill: "yellow", stroke: "green" });
    var bigSquare = s.rect(100, 100, 200, 200);
    var topLeft = s.circle(100, 100, 7);
    var topRight = s.circle(300, 100, 7);
    var bottomRight = s.circle(300, 300, 7);
    var bottomLeft = s.circle(100, 300, 7);

    bigSquare.attr({
      fill: "#fff",
      stroke: "#000",
      strokeWidth: 5
    });
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
      // Inspect cursor to determine which resize/move process to use
      switch (this.attr("cursor")) {
        case "nw-resize":
          this[0].attr({
            x: e.offsetX,
            y: e.offsetY,
            width: this.ow - dx,
            height: this.oh - dy
          });

          this[1].attr({
            //topLeft nw
            cx: e.offsetX,
            cy: e.offsetY
          });

          this[2].attr({
            //topRight  ne
            cx: e.offsetX + (this.ow - dx),
            cy: e.offsetY
          });

          this[3].attr({
            //bottomRight   se
            cx: e.offsetX + (this.ow - dx),
            cy: e.offsetY + (this.oh - dy)
          });

          this[4].attr({
            //bottomLeft  sw
            cx: e.offsetX,
            cy: e.offsetY + (this.oh - dy)
          });
          break;

        case "ne-resize":
          this[0].attr({
            y: e.offsetY,
            width: e.offsetX - this.ox,
            height: this.oh - dy
          });

          this[1].attr({
            //topLeft nw
            cx: e.offsetX - this.ow - dx,
            cy: e.offsetY
          });

          this[2].attr({
            //topRight  ne
            cx: e.offsetX,
            cy: e.offsetY
          });

          this[3].attr({
            //bottomRight   se
            cx: e.offsetX,
            cy: e.offsetY + (this.oh - dy)
          });

          this[4].attr({
            //bottomLeft  sw
            cx: e.offsetX - this.ow - dx,
            cy: e.offsetY + (this.oh - dy)
          });
          break;

        case "se-resize":
          this[0].attr({
            width: e.offsetX - this.ox,
            height: e.offsetY - this.oy
          });

          this[1].attr(
            {
              //topLeft
              //no changes
            }
          );

          this[2].attr({
            //topRight
            cx: e.offsetX
          });

          this[3].attr({
            //bottomRight
            cx: e.offsetX,
            cy: e.offsetY
          });

          this[4].attr({
            //bottomLeft
            cy: e.offsetY
          });

          break;

        case "sw-resize":
          this[0].attr({
            x: e.offsetX,
            width: this.ow - dx,
            height: e.offsetY - this.oy
          });

          this[1].attr({
            cx: e.offsetX
          });

          this[3].attr({
            cy: e.offsetY
          });

          this[4].attr({
            //bottomLeft  works
            cx: e.offsetX,
            cy: e.offsetY
          });
          break;

        default:
          this[0].attr({
            x: e.offsetX - this.ow * 0.5,
            y: e.offsetY - this.oh * 0.5
          });

          this[1].attr({
            //topLeft
            cx: e.offsetX - this.ow * 0.5,
            cy: e.offsetY - this.oh * 0.5
          });

          this[2].attr({
            //topRight
            cx: e.offsetX + this.ow * 0.5,
            cy: e.offsetY - this.oh * 0.5
          });

          this[3].attr({
            //bottomRight
            cx: e.offsetX + this.ow * 0.5,
            cy: e.offsetY + this.oh * 0.5
          });

          this[4].attr({
            //bottomLeft
            cx: e.offsetX - this.ow * 0.5,
            cy: e.offsetY + this.oh * 0.5
          });
          this[5].attr({
            //bottomLeft
            // cx: e.offsetX - this.ow * 0.5,
            // cy: e.offsetY + this.oh * 0.5
            _x: "110,10 110,230 80,30",
            // points: offset(this[5].node.attributes[0].value, e.offsetX - this.ow, e.offsetY - this.oh)
            points: offset(c, e.offsetX - this.ow, e.offsetY - this.oh)
          });
          console.log("AAA", this[5].node.attributes[0].value, e.offsetX, e.offsetY, e.offsetX - this.ow)
          break;
      }
    };

    var dragEnd = function () {
      this.dragging = false;
    };

    var changeCursor = function (e, mouseX, mouseY) {
      // Don't change cursor during a drag operation
      if (this.dragging === true) {
        return;
      }

      // X,Y Coordinates relative to shape's orgin
      var relativeX = mouseX - this[0].attr("x");
      var relativeY = mouseY - this[0].attr("y");

      var shapeWidth = this[0].attr("width");
      var shapeHeight = this[0].attr("height");

      var resizeBorder = 10;

      // Change cursor
      if (relativeX < resizeBorder && relativeY < resizeBorder) {
        this.attr("cursor", "nw-resize");
      } else if (
        relativeX > shapeWidth - resizeBorder &&
        relativeY < resizeBorder
      ) {
        this.attr("cursor", "ne-resize");
      } else if (
        relativeX > shapeWidth - resizeBorder &&
        relativeY > shapeHeight - resizeBorder
      ) {
        this.attr("cursor", "se-resize");
      } else if (
        relativeX < resizeBorder &&
        relativeY > shapeHeight - resizeBorder
      ) {
        this.attr("cursor", "sw-resize");
      } else {
        this.attr("cursor", "move");
      }
    };
    var dropTargetGroup = s.group(
      bigSquare,
      topLeft,
      topRight,
      bottomRight,
      bottomLeft,
      p
    );
    dropTargetGroup.mousemove(changeCursor);
    dropTargetGroup.drag(dragMove, dragStart, dragEnd);
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
      <h1 className=" ">{test}</h1>
      <svg width="400" height="200">
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
      </svg>
      <svg
        id="svg"
        height="100vh"
        width="100vw"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
      />
    </div>
  );
}
export default App


