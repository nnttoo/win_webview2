#pragma once

#include <windows.h>
#include <shellapi.h>
#include "WebView2.h"

bool IsWebView2Installed() {
    LPWSTR versionInfo = nullptr;
    HRESULT hr = GetAvailableCoreWebView2BrowserVersionString(nullptr, &versionInfo);

    bool result = true;

    // If error or no versionInfo, it means not installed
    if ( FAILED(hr) || versionInfo == nullptr) {
        int msgboxID = MessageBoxW(
            NULL,
            L"The Microsoft Edge WebView2 Runtime is not installed.\n\n"
            L"This application requires the WebView2 Runtime to function properly. "
            L"Would you like to download it now?",
            L"Runtime Required",
            MB_ICONWARNING | MB_YESNO | MB_DEFBUTTON1 | MB_TOPMOST
        );

        if (msgboxID == IDYES) {
            // Link to Evergreen Bootstrapper
            ShellExecuteW(NULL, L"open", L"https://developer.microsoft.com/en-us/microsoft-edge/webview2?form=MA13LH#download", NULL, NULL, SW_SHOWNORMAL);
        }
        
        // Optional: Exit if runtime is mandatory
        // exit(0); 
        result = false;
    }

    if (versionInfo) {
        CoTaskMemFree(versionInfo);
    }

    return result;
}
