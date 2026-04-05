#pragma once

#include <napi.h>
#include "openfiledialog.h" 

namespace DialogFile
{
    class FileDialogNapiWorker : public Napi::AsyncWorker
    {
    public:
        std::wstring hasil;
        FileDialogNapiWorker(Napi::Function &callback)
            : Napi::AsyncWorker(callback)
        {
        }

        DialogFileArg args;

        void parseConfig(Napi::Object obj)
        {
            args.filter = MyNapiTools::NapiToWString(obj.Get("filter"));
            args.ownerClassName = MyNapiTools::NapiToWString(obj.Get("ownerClassName"));
        }
        void Execute() override
        { 
            hasil = openFileDialog(args);
        }
        void OnOK() override
        {
            Napi::Env env = Env();
            Napi::String hasilNapi = MyNapiTools::WStringToNapi(env, hasil);
            Callback().Call({env.Null(), hasilNapi});
        }
    };
};