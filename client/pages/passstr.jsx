import React, { useState, useEffect } from 'react';
import Head from "next/head"
import Module from '../cpp_out/c_algo';

const App = () => {

  const [test, settest] = useState();
  const [first, setfirst] = useState()
  async function getSnap() {
    let { default: Snap } = await import('snapsvg-cjs')
    // console.log("Snap", Snap)
    const s = Snap("#svg")
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
      console.log("dragMove", this[0].node)
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
      bottomLeft
    );
    dropTargetGroup.mousemove(changeCursor);
    dropTargetGroup.drag(dragMove, dragStart, dragEnd);
  }
  useEffect(() => {
    getSnap()

  }, [])

  async function loadModule() {
    const module = await Module();
    const res = module.ccall("add", "number", ["number", "number"], [1, 2]);
    settest(res)
    let a = "POLYGON((2 1.3,2.4 1.7,2.8 1.8,3.4 1.2,3.7 1.6,3.4 2,4.1 3,5.3 2.6,5.4 1.2,4.9 0.8,2.9 0.7,2 1.3)(4.0 2.0, 4.2 1.4, 4.8 1.9, 4.4 2.2, 4.0 2.0))";
    let b = "POLYGON((4.0 -0.5 , 3.5 1.0 , 2.0 1.5 , 3.5 2.0 , 4.0 3.5 , 4.5 2.0 , 6.0 1.5 , 4.5 1.0 , 4.0 -0.5))";
    let a_ptr = module.allocateUTF8(a);
    let b_ptr = module.allocateUTF8(b);
    const area = module._get_union_area(a_ptr, b_ptr);
    console.log("area",area)
    module._free(a_ptr, a_ptr);//??????????????????  
    // var input = "hello";   //???????????????  
    // var input_ptr = module.allocateUTF8(input);  //????????????????????????  
    // var retPtr = module._reply(input_ptr);  //??????c??????  
    // var resValue = module.UTF8ToString(retPtr);  //??????????????????????????????  
    // document.getElementById("showtext").value = resValue;//??????  
    // module._free(input_ptr);//??????????????????  
    // console.log("OO", input_ptr, resValue)
  }

  return (
    <div className="min-h-screen">
      <Head>
        <title>Degen EDA</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <button className="btn" onClick={() => loadModule()}>add(1+2)</button>
      <h1 className=" ">{test}</h1>
      <svg width="400" height="200">
        <polygon
          id="po"
          // points="200,10 250,190 160,180"
          points={[[200, 10], [250, 190], [160, 180]]}
          style={{ fill: "lime", stroke: "purple", ["stroke-width"]: 1 }}
        />
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


