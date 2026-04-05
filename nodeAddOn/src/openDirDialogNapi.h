#pragma once

#include "openDirDialog.h" 
#include <napi.h>
#include "napitools.h"

namespace DialogDir{

    class NapiWorker : public Napi::AsyncWorker
    {
    public:
        std::wstring hasil;
        NapiWorker(Napi::Function &callback)
            : Napi::AsyncWorker(callback)
        {
        }

        DialogDirArg args;

        void parseConfig(Napi::Object obj)
        {
            args.filter = MyNapiTools::NapiToWString(obj.Get("filter"));
            args.ownerClassName = MyNapiTools::NapiToWString(obj.Get("ownerClassName"));
        }
        void Execute() override
        { 
            hasil = openDirDialog(args);
        }
        void OnOK() override
        {
            Napi::Env env = Env();
            Napi::String hasilNapi = MyNapiTools::WStringToNapi(env, hasil);
            Callback().Call({env.Null(), hasilNapi});
        }
    };

}