#include <napi.h>
#include "openWebview2.h"

class WebViewWorker : public Napi::AsyncWorker
{
public:
    WebViewWorker(Napi::Function &callback)
        : Napi::AsyncWorker(callback)
    {
    }

    
    MyWebView::WebViewConfig webconfig;

    // 1. Ini jalan di thread luar (tidak boleh sentuh objek V8/Napi)
    void Execute() override
    {

        MyWebView myweb;
        myweb.openWebview2(NULL, webconfig);

        std::wcout << webconfig.wclassname << std::endl;
        hasil = "Windows is closed " ;
    }

    // 2. Ini jalan di thread utama Node.js setelah selesai
    void OnOK() override
    {
        Callback().Call({Env().Null(), Napi::String::New(Env(), hasil)});
    }

private:
    std::string hasil;
};

// 1. Definisikan fungsi logika C++
Napi::Value openWeb(const Napi::CallbackInfo &info)
{
    Napi::Env env = info.Env();

    if (info.Length() < 1 || !info[0].IsObject())
    {
        Napi::TypeError::New(env, "Harus mengirim satu objek konfigurasi").ThrowAsJavaScriptException();
        return env.Undefined();
    }

    Napi::Object paramsArg = info[0].As<Napi::Object>(); 
    Napi::Function callback = paramsArg.Get("callback").As<Napi::Function>();

    WebViewWorker *worker = new WebViewWorker(callback);
    MyWebView::WebViewConfig webconfig;

    webconfig.wclassname = ConvertToWideString( paramsArg.Get("wclassname").As<Napi::String>().Utf8Value());  
    webconfig.url = ConvertToWideString( paramsArg.Get("url").As<Napi::String>().Utf8Value());
    webconfig.title = ConvertToWideString( paramsArg.Get("title").As<Napi::String>().Utf8Value());

    webconfig.height = paramsArg.Get("height").As<Napi::Number>().Int32Value();
    webconfig.width = paramsArg.Get("width").As<Napi::Number>().Int32Value();
    webconfig.modewindow = WS_OVERLAPPEDWINDOW;
    webconfig.maximized = SW_NORMAL;

    Napi::Boolean isKiosk = paramsArg.Get("isKiosk").As<Napi::Boolean>();
    if(isKiosk){
        webconfig.modewindow = WS_POPUP;
    }

    Napi::Boolean isMaximize = paramsArg.Get("isMaximize").As<Napi::Boolean>();
    if(isMaximize){
        webconfig.maximized = SW_MAXIMIZE;
    }

    webconfig.isDebugMode = paramsArg.Get("isDebug").As<Napi::Boolean>();


    worker->webconfig = webconfig;
    worker->Queue();

    return info.Env().Undefined();
}

// 2. Registrasi fungsi ke objek 'exports' (seperti module.exports)
Napi::Object Init(Napi::Env env, Napi::Object exports)
{
    exports.Set(Napi::String::New(env, "openWeb"), Napi::Function::New(env, openWeb));
    return exports;
}

// 3. Makro untuk inisialisasi module
NODE_API_MODULE(addon, Init)
