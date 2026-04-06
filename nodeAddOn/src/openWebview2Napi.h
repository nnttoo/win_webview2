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

    public:
        void parseConfig(Napi::Object paramsArg)
        {

            webconfig.wclassname = MyNapiTools::NapiToWString(paramsArg.Get("wclassname"));
            webconfig.url = MyNapiTools::NapiToWString(paramsArg.Get("url"));
            webconfig.title = MyNapiTools::NapiToWString(paramsArg.Get("title"));

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
        }

        WebViewWorker(Napi::Function &callback)
            : Napi::AsyncWorker(callback)
        {
        }

        // 1. Ini jalan di thread luar (tidak boleh sentuh objek V8/Napi)
        void Execute() override
        {

            if(!IsWebView2Installed()){
                hasil = "Open UI failed";
                return;
            }

            MyWebView myweb;
            myweb.openWebview2(NULL, webconfig);

            std::wcout << webconfig.wclassname << std::endl;
            hasil = "Windows is closed ";
        }

        // 2. Ini jalan di thread utama Node.js setelah selesai
        void OnOK() override
        {
            Callback().Call({Env().Null(), Napi::String::New(Env(), hasil)});
        }
    };

};