// dllmain.cpp : Defines the entry point for the DLL application.

#include "framework.h"
#include <iostream>
#include <string>
#include <locale>
#include <codecvt>
#include "openWebview2.h"
#include "toolsString.h"

#include <iostream>





extern "C" MYLIBRARY_API void OpenWebview(const char* url,
    int width,
    int height,
    bool maximize,
    bool kiosk,
    const char* title,
    const char* windowclassname,
    const char* windowParentclassname,
    CallbackType cb

) {

    HMODULE hInst = GetModuleHandle(L"win_webview2_lib.dll"); 

    std::wstring apppath = GetAppDataPath();
    cb(ConvertWStringToUTF8(apppath));

    WebViewConfig config;
    config.width = width;
    config.height = height;
    config.title = ConvertCharPtrToWString(title);
    config.url = ConvertCharPtrToWString(url);



    config.modewindow = (kiosk)? WS_POPUP : WS_OVERLAPPEDWINDOW;
    config.maximized = (maximize)? SW_MAXIMIZE : SW_NORMAL;

    std::cout<< ConvertWStringToUTF8(config.url) << std::endl;

    openWebview2(hInst, config);
     
}

