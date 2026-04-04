#include <napi.h>
#include "openWebview2Napi.h"
#include "openfiledialogNapi.h"
#include "napitools.h"  
#include "openDirDialogNapi.h"

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

    MyWebViewNapi::WebViewWorker *worker = new MyWebViewNapi::WebViewWorker(callback);

    worker->parseConfig(paramsArg);
    worker->Queue();

    return info.Env().Undefined();
}

Napi::Value napiOpenFileDialog(const Napi::CallbackInfo &info)
{

    // Ambil environment dari callback info
    Napi::Env env = info.Env();
    if (info.Length() < 1 || !info[0].IsObject())
    {
        Napi::TypeError::New(env, "Harus mengirim satu objek konfigurasi").ThrowAsJavaScriptException();
        return env.Undefined();
    }

    Napi::Object paramsArg = info[0].As<Napi::Object>();
    Napi::Function callback = paramsArg.Get("callback").As<Napi::Function>();

    DialogFile::FileDialogNapiWorker *worker = new DialogFile::FileDialogNapiWorker(callback);
    worker->parseConfig(paramsArg);
    worker->Queue();

    return env.Undefined();
}

Napi::Value napiOpenDirDialog(const Napi::CallbackInfo &info)
{
     Napi::Env env = info.Env();
    if (info.Length() < 1 || !info[0].IsObject())
    {
        Napi::TypeError::New(env, "Harus mengirim satu objek konfigurasi").ThrowAsJavaScriptException();
        return env.Undefined();
    }

    Napi::Object paramsArg = info[0].As<Napi::Object>();
    Napi::Function callback = paramsArg.Get("callback").As<Napi::Function>();

    DialogDir::NapiWorker * worker = new DialogDir::NapiWorker(callback);
    worker->parseConfig(paramsArg);
    worker->Queue(); 

    return env.Undefined();
}

// 2. Registrasi fungsi ke objek 'exports' (seperti module.exports)
Napi::Object Init(Napi::Env env, Napi::Object exports)
{
    exports.Set(Napi::String::New(env, "openWeb"), Napi::Function::New(env, openWeb));
    exports.Set(Napi::String::New(env, "openFileDialog"), Napi::Function::New(env, napiOpenFileDialog));
    exports.Set(Napi::String::New(env, "openFolderDialog"), Napi::Function::New(env, napiOpenDirDialog));
    return exports;
}

// 3. Makro untuk inisialisasi module
NODE_API_MODULE(addon, Init)
