#include <string>
#include <napi.h>

std::string helloUser(std::string name)
{
    return "Hello " + name + "!";
}

Napi::String getHello(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();

    std::string user = helloUser("Jacob");

    return Napi::String::New(env, user);
} 

Napi::Object Init(Napi::Env env, Napi::Object exports) {
    // set a key on exports
    exports.Set(
        Napi::String::New(env, "getHello"),
        Napi::Function::New(env, getHello)
    );

    return exports;
}

NODE_API_MODULE(hello, Init)
