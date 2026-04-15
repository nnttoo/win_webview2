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
        Napi::ThreadSafeFunction onPostMessage;
        MyWebView myweb;

        void getCallBackOnMessage(Napi::Object paramsArg)
        {
            if (paramsArg.Has("onPostMessage") && paramsArg.Get("onPostMessage").IsFunction())
            {
                Napi::Function cb = paramsArg.Get("onPostMessage").As<Napi::Function>();

                // Membuat ThreadSafeFunction
                onPostMessage = Napi::ThreadSafeFunction::New(
                    paramsArg.Env(),
                    cb,             // Callback asli dari JS
                    "ResourceName", // Nama bebas untuk debugging
                    0,              // Max queue size (0 = unlimited)
                    1               // Initial thread count
                );
            }

            webconfig.onPostMessage = [this](std::wstring msg)
            {
                if (this->onPostMessage)
                {
                    // Kita kirim data 'msg' ke Main Thread lewat BlockingCall / NonBlockingCall
                    auto callback = [this, msg](Napi::Env env, Napi::Function jsCallback)
                    {
                        Napi::Function replyFn = Napi::Function::New(
                            env,
                            [this](const Napi::CallbackInfo &info)
                            {
                                std::wstring *replyMsg = new std::wstring(MyNapiTools::NapiToWString(info[0]));
                                PostMessageW(this->myweb.hWnd, WM_SEND_WEB_MESSAGE, (WPARAM)replyMsg, 0);
                            });

                        jsCallback.Call({MyNapiTools::WStringToNapi(env, msg),
                                         replyFn});
                    };

                    this->onPostMessage.NonBlockingCall(callback);
                }
            };
        }

    public:
        void parseConfig(Napi::Object paramsArg)
        {

            webconfig.wclassname = MyNapiTools::NapiToWString(paramsArg.Get("wclassname"));
            webconfig.url = MyNapiTools::NapiToWString(paramsArg.Get("url"));
            webconfig.title = MyNapiTools::NapiToWString(paramsArg.Get("title"));
            webconfig.virtualHostNameToFolderMapping = MyNapiTools::NapiToWString(paramsArg.Get("virtualHostNameToFolderMapping"));

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
            getCallBackOnMessage(paramsArg);
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
            onPostMessage.Release();
        }
    };

};