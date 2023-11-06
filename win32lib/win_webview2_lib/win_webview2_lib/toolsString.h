#pragma once


#include <windows.h>
#include <shlobj.h>
#include <knownfolders.h>
#include <string>


char* ConvertWStringToUTF8(const std::wstring& wstr) {
    int bufferSize = WideCharToMultiByte(CP_UTF8, 0, wstr.c_str(), -1, NULL, 0, NULL, NULL);
    char* utf8String = new char[bufferSize];
    WideCharToMultiByte(CP_UTF8, 0, wstr.c_str(), -1, utf8String, bufferSize, NULL, NULL);
    return utf8String;
}

 
std::wstring GetAppDataPath() {
    PWSTR appDataPath = nullptr;
    if (SUCCEEDED(SHGetKnownFolderPath(FOLDERID_LocalAppData, 0, NULL, &appDataPath))) {
        int bufferSize = wcslen(appDataPath);
        std::wstring result(appDataPath, appDataPath + bufferSize);
        CoTaskMemFree(appDataPath);
        return result + L"\\Temp\\win_webview2_node";
    }

    return L"";
}

std::wstring ConvertCharPtrToWString(const char* charPtr) {
    int bufferSize = MultiByteToWideChar(CP_UTF8, 0, charPtr, -1, NULL, 0);
    wchar_t* wideString = new wchar_t[bufferSize];
    MultiByteToWideChar(CP_UTF8, 0, charPtr, -1, wideString, bufferSize);

    std::wstring wstr(wideString);

    delete[] wideString; // Jangan lupa membebaskan memori

    return wstr;
}
 
