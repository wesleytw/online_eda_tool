import React, { useState, useEffect } from 'react';
import Head from "next/head"
import Module from '../cpp_out/c_algo';
import { offset } from 'svg-polygon-points';

// let polys = ["10,10 10,210 310,210 310,10", "110,10 110,210 510,210 510,10"]
let polys = ["0,0 0,100 100,100 100,0 0,0", "0,0 0,100 100,100 100,0 0,0"]

let pointsNow = { p1: polys[0], p2: polys[1] }
let p1, p2
let s1, s2
const App = () => {
  const [test, settest] = useState("0");
  const [svgs, setsvgs] = useState({ p1: "300 0 , 300 100 , 400 100 , 400 0 , 300 0", p2: "300 0 , 300 200 , 400 200 , 300 0" })

  async function getSnap() {
    let { default: Snap } = await import('snapsvg-cjs')
    // console.log("Snap", Snap)
    s1 = Snap("#s1")
    s2 = Snap("#s2")
    p1 = s1.polygon(polys[0])
    p1.attr({ fill: "yellow", stroke: "green", id: "p1", fillOpacity: "0.6" });
    p2 = s2.polygon(polys[1])
    p2.attr({ fill: "blue", stroke: "green", id: "p2", fillOpacity: "0.6" });
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
      // console.log("dragMove", this, this[0].node, e)
      // console.log(s1.node.innerHTML.polygon)
      pointsNow[this[0].node.attributes.id.value] = this[0].node.attributes.points.value
      union()
      // Inspect cursor to determine which resize/move process to use
      switch (this.attr("cursor")) {
        default:
          this[0].attr({
            //bottomLeft
            // cx: e.offsetX - this.ow * 0.5,
            // cy: e.offsetY + this.oh * 0.5
            _x: polys[0],
            // points: offset(this[5].node.attributes[0].value, e.offsetX - this.ow, e.offsetY - this.oh)
            points: offset(polys[0], e.offsetX, e.offsetY)
          });
          // console.log("AAA", this[0].node.attributes[0].value, e.offsetX, e.offsetY, e.offsetX - this.ow)
          break;
      }
    };

    var dragEnd = function () {
      this.dragging = false;
      console.log("dragEnd", this, this[0].node.attributes.points.value, this[0].node.attributes.id.value)
      // pointsNow[this[0].node.attributes.id.value] = this[0].node.attributes.points.value
      // union()
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
    console.log("showPoints", pointsNow)
  }
  useEffect(() => {
    getSnap()

  }, [])

  async function union() {
    const module = await Module();
    // let a = "POLYGON((-11 19.3,2.4 1.7,2.8 1.8,3.4 1.2,3.7 1.6,3.4 2,4.1 3,5.3 2.6,5.4 1.2,4.9 0.8,2.9 0.7,2 1.3)(4.0 2.0, 4.2 1.4, 4.8 1.9, 4.4 2.2, 4.0 2.0))";
    // let b = "POLYGON((4.0 -0.5 , 3.5 1.0 , 2.0 1.5 , 3.5 2.0 , 4.0 3.5 , 4.5 2.0 , 6.0 1.5 , 4.5 1.0 , 4.0 -0.5))";
    // pointsNow.p1 = "(2 1.3,2.4 1.7,2.8 1.8,3.4 1.2,3.7 1.6,3.4 2,4.1 3,5.3 2.6,5.4 1.2,4.9 0.8,2.9 0.7,2 1.3)(4.0 2.0, 4.2 1.4, 4.8 1.9, 4.4 2.2, 4.0 2.0)"
    let a = "POLYGON((" + pointsNow.p1.replaceAll(",", " ") + "))"
    let b = "POLYGON((" + pointsNow.p2.replaceAll(",", " ") + "))"
    let da = "POLYGON((" + pointsNow.p1.replaceAll(",", ".").replaceAll(" ", " , ").replaceAll(".", " ") + "))"
    let db = "POLYGON((" + pointsNow.p2.replaceAll(",", ".").replaceAll(" ", " , ").replaceAll(".", " ") + "))"
    let a_ptr = await module.allocateUTF8(da);
    let b_ptr = await module.allocateUTF8(db);
    const area = await module._get_union_area(a_ptr, b_ptr);
    settest(area)
    // console.log(pointsNow.p1,area,"POLYGON((" + pointsNow.p1.replace(","," ") + "))")
    // console.log(pointsNow, a, b, a_ptr, b_ptr, area)
    await module._free(a_ptr, b_ptr);
  }

  async function submit_union(e) {
    e.preventDefault()
    console.log(svgs)
    const module = await Module();
    let a = "POLYGON((" + svgs.p1 + "))"
    let b = "POLYGON((" + svgs.p2 + "))"
    let a_ptr = await module.allocateUTF8(a);
    let b_ptr = await module.allocateUTF8(b);
    const area = await module._get_union_area(a_ptr, b_ptr);
    settest(area)
    // console.log(pointsNow.p1,area,"POLYGON((" + pointsNow.p1.replace(","," ") + "))")
    console.log(
      //  a, b,
      a_ptr, b_ptr, area)
    await module._free(a_ptr, b_ptr);
  }

  async function typing(event) {
    const name = event.target.name;
    const value = event.target.value;
    setsvgs(values => ({ ...values, [name]: value }))
  }

  return (
    <div className="min-h-screen p-4">
      <Head>
        <title>Degen EDA</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      {/* <button className="btn normal-case m-4" onClick={() => union()}>UNION (blue||yellow)</button> */}
      <div className=" font-mono">
        <h1 className=" text-5xl mx-4 bg-white">Demo 1</h1>
        <p className=" mx-4 bg-white">This section shows how JavaScript calculate the union area through WebAssembly.
          <br /> Area calculation algorithm is based on <a href="" className=" underline">Boost C++ graph library</a>.
          <br /> Observation: the speed of calculation is extremly faster than pure JS implementation.
          <br /> Usage: drag the blue and the yellow blocks to get the union area of these two blocks, or input the specific coordinates of the green and red blocks.
        </p>
        <h1 className=" text-3xl bg-white font-bold mx-4">area:{test}</h1>
        <svg width="50vw" height="400px" className=' m-4 border-2'>
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
          <polygon points={svgs.p1} fill='#008000' fill-opacity="0.4" stroke="#008000" id="p1" ></polygon>
          <polygon points={svgs.p2} fill='#dc0909' fill-opacity="0.4" stroke="#dc0909" id="p2" ></polygon>
        </svg>
        <form action="" className=" w-full" onSubmit={submit_union}>
          <div className="form-control m-4 w-3/5">
            <label className="input-group input-group-sm">
              <span>green(100*100)</span>
              <input name="p1" type="text" value={"" || svgs.p1} onChange={(e) => typing(e)} placeholder="Type here" className="w-full input input-bordered input-sm" />
            </label>
          </div>
          <div className="form-control m-4 w-3/5">
            <label className="input-group input-group-sm">
              <span>red</span>
              <input name="p2" type="text" value={"" || svgs.p2} onChange={(e) => typing(e)} placeholder="Type here" className="w-full  input input-bordered input-sm" />
            </label>
          </div>
          <input type="submit" value="(red||green) area " className='btn mx-4' />
        </form>
      </div>
      <div className=" font-mono my-4">
        <h1 className=" text-5xl mx-4 bg-white">Demo 2</h1>
        <img src="/proj1.png" alt="" className=" mx-4 w-[500px]" />
        <p className=" m-4 mb-0 pb-4 bg-white">
          Solution: <br />
          step 1. <br />
          use MULTIPOLYGON to group all blockages. <br />
          step 2. <br />
          use boost::geometry::envelope to get the enclosing rectangle. <br />
          step 3. <br />
          set the pins and display SVG. <br />
          Source code: <a href="https://github.com/wesleytw/course_projects/blob/master/proj1/formal_proj/proj1.cpp" className=" underline">https://github.com/wesleytw/course_projects/blob/master/proj1/formal_proj/proj1.cpp</a>
        </p>
        <img src="/s1.png" alt="" className=" mx-4 w-[600px]" />
      </div>
    </div>
  );
}
export default App


