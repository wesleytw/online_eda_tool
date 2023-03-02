// use boost union to combine polygons and use envelop to find outter shape
// emcc proj1.cpp -o ../client/cpp_out/proj1.js -s EXPORTED_RUNTIME_METHODS=cwrap,ccall,allocateUTF8,UTF8ToString -s EXPORTED_FUNCTIONS=_free,_malloc,_get_union_area,_reply,_add,_sub,_union_area,_print_int,_print_arr -sENVIRONMENT=web -s MODULARIZE=1 -s EXPORT_ES6=1 -s USE_ES6_IMPORT_META=0

#include <iostream>
#include <fstream> // svg
#include <boost/geometry.hpp>
#include <boost/geometry/geometries/box.hpp>
#include <boost/geometry/geometries/point_xy.hpp>
#include <boost/geometry/geometries/polygon.hpp>
#include <boost/foreach.hpp>

using namespace std;
typedef boost::geometry::model::d2::point_xy<double> point;
typedef boost::geometry::model::polygon<point> polygon;
typedef boost::geometry::model::multi_polygon<polygon> multi_polygon;
typedef boost::geometry::model::box<point> box;

void getMultiSvgs(multi_polygon);
void get5Uni(string, string, string, string, string);
tuple<multi_polygon, box> getMaxUnion(const string *arr);
tuple<string *, string *> parser(); // return type: address of string array
void setPins(const string *pins, multi_polygon mp, box box);

int num_layers, num_polys, num_rects, num_texts;

int main()
{
  auto [arr_polys, arr_rects] = parser();
  auto [mp, box] = getMaxUnion(arr_polys);
  setPins(arr_rects, mp, box); // arr_rects  == pins

  return 0;
}

tuple<multi_polygon, box> getMaxUnion(const string *arr)
{
  string multi_polys;
  for (int i = 0; i < num_polys; i++)
  {
    multi_polys = multi_polys + "((" + arr[i] + ")),";
  }
  multi_polys = "MULTIPOLYGON(" + multi_polys + ")";

  boost::geometry::model::multi_polygon<polygon> mp;
  boost::geometry::read_wkt(multi_polys, mp);
  getMultiSvgs(mp);

  boost::geometry::model::box<point> box;
  boost::geometry::envelope(mp, box);
  std::ofstream box_svg("box.svg");
  boost::geometry::svg_mapper<point> box_mapper(box_svg, 100, 100);
  box_mapper.add(box);
  box_mapper.map(box, "fill-opacity:0.8;fill:rgb(0,0,220);stroke:rgb(0,0,230);stroke-width:2");
  box_mapper.add(mp);
  box_mapper.map(mp, "fill-opacity:0.5;fill:rgb(160,0,0);stroke:rgb(200,20,0);stroke-width:2");
  return {mp, box};
}

void get5Uni(string s1, string s2, string s3, string s4, string s5)
{
  polygon p1, p2, p3, p4, p5;
  boost::geometry::read_wkt(
      "POLYGON((0  0,  0 10,  10 10,  10 0,  0  0))", p1);
  boost::geometry::read_wkt(
      "POLYGON((12  3,   12  30,   32 30,  32  3,   12 3))", p2);
  boost::geometry::model::multi_polygon<polygon> output;
  boost::geometry::union_(p1, p2, output);
  boost::geometry::model::box<point> box;
  boost::geometry::envelope(output, box);
  std::ofstream box_svg("box.svg");
  boost::geometry::svg_mapper<point> box_mapper(box_svg, 100, 100);
  box_mapper.add(box);
  box_mapper.map(box, "fill-opacity:0.5;fill:rgb(160,0,0);stroke:rgb(0,200,0);stroke-width:2");
  box_mapper.add(p1);
  box_mapper.map(p1, "fill-opacity:0.5;fill:rgb(10,0,0);stroke:rgb(0,200,0);stroke-width:2");
  box_mapper.add(p2);
  box_mapper.map(p2, "fill-opacity:0.5;fill:rgb(10,0,0);stroke:rgb(0,200,0);stroke-width:2");
}

void getMultiSvgs(multi_polygon mp)
{
  std::ofstream mp_svg("mp.svg");
  boost::geometry::svg_mapper<point> mp_mapper(mp_svg, 100, 100);
  mp_mapper.add(mp);
  mp_mapper.map(mp, "fill-opacity:0.5;fill:rgb(160,0,0);stroke:rgb(200,20,0);stroke-width:2");
}

void setPins(const string *arr, multi_polygon mp, box box)
{
  string multi_pins;
  for (int i = 0; i < num_rects; i++)
  {
    multi_pins = multi_pins + "((" + arr[i] + ")),";
  }
  multi_pins = "MULTIPOLYGON(" + multi_pins + ")";
  boost::geometry::model::multi_polygon<polygon> pins;
  boost::geometry::read_wkt(multi_pins, pins);

  std::ofstream with_pins_svg("with_pins.svg");
  boost::geometry::svg_mapper<point> with_pins_mapper(with_pins_svg, 100, 100);
  with_pins_mapper.add(box);
  with_pins_mapper.map(box, "fill-opacity:0.8;fill:rgb(0,0,220);stroke:rgb(0,0,230);stroke-width:2");
  with_pins_mapper.add(mp);
  with_pins_mapper.map(mp, "fill-opacity:0.5;fill:rgb(160,0,0);stroke:rgb(200,20,0);stroke-width:2");
  with_pins_mapper.add(pins);
  with_pins_mapper.map(pins, "fill-opacity:0.5;fill:rgb(0,110,0);stroke:rgb(0,110,0);stroke-width:2");
  // with_pins_mapper.text(point(5,5), "(5,5)", "fill-opacity:0.5;fill:rgb(0,0,0);",1,1);
}

tuple<string *, string *> parser() // return type: address of string array
{
  cout << "number_of_polygons ";
  cin >> num_polys;
  string *arr_polys = new string[num_polys];
  for (int i = 0; i < num_polys; i++)
  {
    cout << i + 1 << " ";
    getline(cin >> ws, arr_polys[i]); // not stop by white space(std::ws)
  }
  cout << "end_of_polygons" << endl;
  cout << "number_of_rectangles: ";
  cin >> num_rects;
  string *arr_rects = new string[num_rects];
  for (int i = 1; i <= num_rects; i++)
  {
    cout << i << " ";
    getline(cin >> ws, arr_rects[i]); // not stop by white space(std::ws)
  }
  cout << "end_of_rectangles" << endl;
  return {arr_polys, arr_rects};
}

// number_of_layers 1
// layer 1   M1
// end_of_layer
// number_of_polygons  5
// 1    0  0,  0 10,  10 10,  10 0,  0  0
// 1   12  3,   12  30,   32 30,  32  3,   12 3
// 1   30  0,   30  5,    40  5,    40 0,    30 0
// 1    0 40,    0  50,    6  50,    6  40,   0 40
// 1   30  42,  30 50,   40  50,  40 42,  30 42
// end_of_polygon
// number_of_rectangles  3
// 1  0 20, 0 24, 3 24, 3 20, 0 20
// 1  13 46, 13 50, 17 50, 17 46, 13 46
// 1  38 10, 38 13, 40 13, 40 10, 38 10
// end_of_rectangle
// number_of_texts   3
// 1  C    21  21
// 1  A   14  47
// 1  B   39  12
// end_of_text
