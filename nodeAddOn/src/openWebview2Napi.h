#pragma once
#include <napi.h>

#include "openWebview2.h"
#include "napitools.h"

#include "openWebview2Check.h"

namespace MyWebViewNapi
{
    class WebViewWorker : public Napi::AsyncWorker
    {

    private:
        MyWebView::WebViewConfig webconfig;
        std::string hasil;
        Napi::ThreadSafeFunction onVirtualHostRequested;
        MyWebView myweb;

        void getOnVirtualHostRequested(Napi::Object paramsArg)
        {
            if (paramsArg.Has("onVirtualHostRequested") && paramsArg.Get("onVirtualHostRequested").IsFunction())
            {
                Napi::Function cb = paramsArg.Get("onVirtualHostRequested").As<Napi::Function>();

                // Membuat ThreadSafeFunction
                onVirtualHostRequested = Napi::ThreadSafeFunction::New(
                    paramsArg.Env(),
                    cb,             // Callback asli dari JS
                    "ResourceName", // Nama bebas untuk debugging
                    0,              // Max queue size (0 = unlimited)
                    1               // Initial thread count
                );
            }

            if (!onVirtualHostRequested)
                return;

            webconfig.onVirtualHostRequested = [this](MyWebView::ResourceRequest *request)
            {
                auto callback = [this, request](Napi::Env env, Napi::Function jsCallback)
                {
                    auto replyFnLambada = [this, request](const Napi::CallbackInfo &info)
                    {
                        std::wcout << L"callback Is called" << std::endl;
                        auto *res = new MyWebView::ResourceResponse();
                        if (info[0].IsObject())
                        {
                            Napi::Object obj = info[0].As<Napi::Object>();

                            res->status = obj.Has("status") ? obj.Get("status").As<Napi::Number>().Int32Value() : 200;
                            res->contentType = obj.Has("contentType") ? MyNapiTools::NapiToWString(obj.Get("contentType")) : L"text/plain";

                            if (obj.Has("body") && obj.Get("body").IsBuffer())
                            {
                                Napi::Buffer<uint8_t> buf = obj.Get("body").As<Napi::Buffer<uint8_t>>();
                                res->body.assign(buf.Data(), buf.Data() + buf.Length());
                            }
                        }

                        PostMessageW(this->myweb.hWnd, WM_SEND_WEB_MESSAGE, (WPARAM)request, (LPARAM)res);

                        return info.Env().Undefined();
                    };

                    Napi::Function replyFn = Napi::Function::New(env, replyFnLambada);

                    // Konversi Request ke JS Object
                    Napi::Object jsReq = Napi::Object::New(env);
                    jsReq.Set("uri", MyNapiTools::WStringToNapi(env, request->uri));
                    jsReq.Set("method", MyNapiTools::WStringToNapi(env, request->method));

                    // Berikan Body ke JS (sebagai Buffer)
                    if (!request->body.empty())
                    {
                        jsReq.Set("body", Napi::Buffer<uint8_t>::Copy(env, request->body.data(), request->body.size()));
                    }

                    jsCallback.Call({jsReq, replyFn});

                    return env.Undefined();
                };

                this->onVirtualHostRequested.NonBlockingCall(callback);
            };
        }

    public:
        void parseConfig(Napi::Object paramsArg)
        {

            webconfig.wclassname = MyNapiTools::NapiToWString(paramsArg.Get("wclassname"));
            webconfig.url = MyNapiTools::NapiToWString(paramsArg.Get("url"));
            webconfig.title = MyNapiTools::NapiToWString(paramsArg.Get("title"));
            webconfig.virtualHostName = MyNapiTools::NapiToWString(paramsArg.Get("virtualHostName"));

            webconfig.height = paramsArg.Get("height").As<Napi::Number>().Int32Value();
            webconfig.width = paramsArg.Get("width").As<Napi::Number>().Int32Value();
            webconfig.modewindow = WS_OVERLAPPEDWINDOW;
            webconfig.maximized = SW_NORMAL;

            Napi::Boolean isKiosk = paramsArg.Get("isKiosk").As<Napi::Boolean>();
            if (isKiosk)
            {
                webconfig.modewindow = WS_POPUP;
            }

            Napi::Boolean isMaximize = paramsArg.Get("isMaximize").As<Napi::Boolean>();
            if (isMaximize)
            {
                webconfig.maximized = SW_MAXIMIZE;
            }

            webconfig.isDebugMode = paramsArg.Get("isDebug").As<Napi::Boolean>();
            getOnVirtualHostRequested(paramsArg);
        }

        WebViewWorker(Napi::Function &callback)
            : Napi::AsyncWorker(callback)
        {
        }

        // 1. Ini jalan di thread luar (tidak boleh sentuh objek V8/Napi)
        void Execute() override
        {

            if (!IsWebView2Installed())
            {
                hasil = "Open UI failed";
                return;
            }

            myweb.openWebview2(NULL, webconfig);

            std::wcout << webconfig.wclassname << std::endl;
            hasil = "Windows is closed ";
        }

        // 2. Ini jalan di thread utama Node.js setelah selesai
        void OnOK() override
        {
            Callback().Call({Env().Null(), Napi::String::New(Env(), hasil)});
            if (onVirtualHostRequested)
            {
                onVirtualHostRequested.Release();
            }
        }
    };

};