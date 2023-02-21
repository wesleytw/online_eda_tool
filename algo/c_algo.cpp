// emcc t.cpp -o test/t.html
// #define WASM_EXPORT __attribute__((visibility(“default”)))
// WASM_EXPORT
// int add(int a, int b) {
//   return a + b;
// }
// https://www.boost.org/doc/libs/1_53_0/libs/geometry/doc/html/geometry/reference/algorithms/union_.html
// emcc union.cpp -o test/union.html
#include <iostream>
#include <vector>
#include <string>

#include <boost/geometry.hpp>
#include <boost/geometry/geometries/point_xy.hpp>
#include <boost/geometry/geometries/polygon.hpp>
#include <boost/geometry/io/wkt/wkt.hpp>
#include <boost/foreach.hpp>

using namespace std;
extern "C"
{
  string print_str();
  void print_int(int a);
  void print_arr(char *buf);
  double fixed_union_area();
  double union_area(string a, string b);
}
// string a = "POLYGON((2 1.3,2.4 1.7,2.8 1.8,3.4 1.2,3.7 1.6,3.4 2,4.1 3,5.3 2.6,5.4 1.2,4.9 0.8,2.9 0.7,2 1.3)(4.0 2.0, 4.2 1.4, 4.8 1.9, 4.4 2.2, 4.0 2.0))";
// string b = "POLYGON((4.0 -0.5 , 3.5 1.0 , 2.0 1.5 , 3.5 2.0 , 4.0 3.5 , 4.5 2.0 , 6.0 1.5 , 4.5 1.0 , 4.0 -0.5))";
// string a = "POLYGON((110 10 110 210 310 210 310 10))";
int main()
{
fixed_union_area();
  // int a[5] = {1000, 2, 3, 17, 50};
  // cout << print_str();
  // print_int(2);
  // // print_arr(a);
  // cout << union_area("POLYGON((110,10 110,210 310,210 310,10))", "POLYGON((110,10 110,210 310,210 310,10))");
  // cout << union_area(a, a);
  // fixed_union_area();
  return 0;
}

extern "C"
{
  double get_union_area(const char *a, const char *b)
  {
    printf("w_re%sand%s\n", a, b);
    double area = union_area(a, b);
    printf("w_area");
    printf("w_area:%f", area);
    return area;
  }
  const char *reply(const char *chr)
  {
    // cout << "reply: " <<chr;
    printf("w_re%s\n", chr);
    return "hi man";
  }
  string print_str()
  {
    return "hi ";
  }
  void print_int(int a)
  {
    cout << "a_int: " << a;
  }
  void print_arr(char *buf)
  {
    // cout << "a_arr: " << a[0];
    cout << "a_arr: " << buf;
  }
  int add(int a, int b)
  {
    cout << "a_add: " << a + b << endl;
    return a + b;
  }
  int sub(int x, int y)
  {
    return x - y;
  }
  double fixed_union_area()
  {
    typedef boost::geometry::model::polygon<boost::geometry::model::d2::point_xy<double>> polygon;

    polygon green, blue;

    boost::geometry::read_wkt(
        // "POLYGON((2 1.3,2.4 1.7,2.8 1.8,3.4 1.2,3.7 1.6,3.4 2,4.1 3,5.3 2.6,5.4 1.2,4.9 0.8,2.9 0.7,2 1.3)(4.0 2.0, 4.2 1.4, 4.8 1.9, 4.4 2.2, 4.0 2.0))"
                        "POLYGON((0 2.6,5.4 1.2,4.9 0.8,2.9 0.7,2 1.3)(4.0 2.0, 4.2 1.4, 4.8 1.9, 4.4 2.2, 4.0 2.0))"

        // "POLYGON((0 0 0 10 10 210 310 10))"
        , green);

    boost::geometry::read_wkt(
        // "POLYGON((4.0 -0.5 , 3.5 1.0 , 2.0 1.5 , 3.5 2.0 , 4.0 3.5 , 4.5 2.0 , 6.0 1.5 , 4.5 1.0 , 4.0 -0.5))"
                "POLYGON((5.3 2.6,5.4 1.2,4.9 0.8,2.9 0.7,2 1.3)(4.0 2.0, 4.2 1.4, 4.8 1.9, 4.4 2.2, 4.0 2.0))"

        // "POLYGON((19 37 19 237 319 237 319 37))"
        , blue);

    std::vector<polygon> output;
    boost::geometry::union_(green, blue, output);

    int i = 0;
    std::cout << "fixed green || blue:" << std::endl;
    BOOST_FOREACH (polygon const &p, output)
    {
      std::cout << "area: " << i++ << ": " << boost::geometry::area(p) << std::endl;
      return boost::geometry::area(p);
    }
    return 0;
  }
}

double union_area(string a, string b)
{
  typedef boost::geometry::model::polygon<boost::geometry::model::d2::point_xy<double>> polygon;

  polygon green, blue;

  boost::geometry::read_wkt(a, green);

  boost::geometry::read_wkt(b, blue);

  std::vector<polygon> output;
  boost::geometry::union_(green, blue, output);

  int i = 0;
  // std::cout << "green || blue:" << std::endl;
  BOOST_FOREACH (polygon const &p, output)
  {
    // std::cout << "area: " << i++ << ": " << boost::geometry::area(p) << std::endl;
    return boost::geometry::area(p);
  }
  return 0;
}

//////// works ///////
// emccact
// emcc add.cpp -o out/add.js -s EXPORTED_FUNCTIONS=_add,_sub -s EXPORTED_RUNTIME_METHODS=cwrap,ccall -sENVIRONMENT=web -s MODULARIZE=1 -s EXPORT_ES6=1 -s USE_ES6_IMPORT_META=0
// emcc add.cpp -o ../client/cpp_out/add.js -s EXPORTED_FUNCTIONS=_add,_sub -s EXPORTED_RUNTIME_METHODS=cwrap,ccall -sENVIRONMENT=web -s MODULARIZE=1 -s EXPORT_ES6=1 -s USE_ES6_IMPORT_META=0
// emcc add.cpp -o ../client/cpp_out/add.js -s EXPORTED_FUNCTIONS=_add,_sub,_union_area -s EXPORTED_RUNTIME_METHODS=cwrap,ccall -sENVIRONMENT=web -s MODULARIZE=1 -s EXPORT_ES6=1 -s USE_ES6_IMPORT_META=0
// emcc add.cpp -o ../client/cpp_out/add.js -s EXPORTED_FUNCTIONS=_add,_sub,_union_area,_print_int,_print_arr -s EXPORTED_RUNTIME_METHODS=cwrap,ccall -sENVIRONMENT=web -s MODULARIZE=1 -s EXPORT_ES6=1 -s USE_ES6_IMPORT_META=0
// emcc add.cpp -o ../client/cpp_out/add.js -s EXPORTED_FUNCTIONS=_free,_malloc,_reply,_add,_sub,_union_area,_print_int,_print_arr -s EXPORTED_RUNTIME_METHODS=cwrap,ccall,allocateUTF8,UTF8ToString -sENVIRONMENT=web -s MODULARIZE=1 -s EXPORT_ES6=1 -s USE_ES6_IMPORT_META=0

// emcc add.cpp -o ../client/cpp_out/add.js -s EXPORTED_RUNTIME_METHODS=cwrap,ccall,allocateUTF8,UTF8ToString -s EXPORTED_FUNCTIONS=_free,_malloc,_reply,_add,_sub,_union_area,_print_int,_print_arr -sENVIRONMENT=web -s MODULARIZE=1 -s EXPORT_ES6=1 -s USE_ES6_IMPORT_META=0
// emcc c_algo.cpp -o ../client/cpp_out/c_algo.js -s EXPORTED_RUNTIME_METHODS=cwrap,ccall,allocateUTF8,UTF8ToString -s EXPORTED_FUNCTIONS=_free,_malloc,_get_union_area,_reply,_add,_sub,_union_area,_print_int,_print_arr -sENVIRONMENT=web -s MODULARIZE=1 -s EXPORT_ES6=1 -s USE_ES6_IMPORT_META=0

//////// works ///////

// function _malloc() {
//   abort("malloc() called but not included in the build - add '_malloc' to EXPORTED_FUNCTIONS");
// }
// function _free() {
//   // Show a helpful error since we used to include free by default in the past.
//   abort("free() called but not included in the build - add '_free' to EXPORTED_FUNCTIONS");
// }
