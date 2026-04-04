#pragma once
#include <napi.h>
#include <string>

namespace MyNapiTools
{
    std::wstring NapiToWString(Napi::Value val)
    {
        if (val.IsString())
        {
            std::u16string u16 = val.As<Napi::String>().Utf16Value();
            return std::wstring(u16.begin(), u16.end());
        }
        return L""; // Kembalikan string kosong jika bukan string
    }

    Napi::String WStringToNapi(Napi::Env env, const std::wstring &wstr)
    {
        return Napi::String::New(env, (const char16_t *)wstr.c_str());
    }
}
