// dllmain.cpp : Defines the entry point for the DLL application.

#include "framework.h"
#include <iostream>
#include <string>
#include <locale>
#include <codecvt>
#include "openWebview2.h"

std::wstring convertString(char* c) {
    std::wstring_convert<std::codecvt_utf8<wchar_t>> converter;
    std::wstring wideString = converter.from_bytes(c);
    return wideString;
}

extern "C" MYLIBRARY_API int OpenWebview( char* url, CallbackType cb) {

    HMODULE hInst = GetModuleHandle(L"win_webview2_lib.dll"); 
    cb(const_cast<char*>( "ini skadar nyobain ya masbro"));
    openWebview2(hInst, convertString(url));

    return 0;
}

