#pragma once


#include <windows.h> 
#include "tools.h" 
#include <shlobj.h>

#include "json_helper.h"

std::wstring replacePipeWithNull(const std::wstring& str) {
    std::wstring result = str;  // Salin string asli
    for (size_t i = 0; i < result.length(); ++i) {
        if (result[i] == L'|') {
            result[i] = L'\0';  // Ganti '|' dengan karakter null
        }
    }
    return result;
}

std::wstring openFileDialog(
    nlohmann::json argJson

) {

    LogPrintA("membuka file dialog");

    std::wstring result;
    // Inisialisasi dialog
     
    std::wstring wfilter = L"All File|*.*||";
    wfilter = JsonGetString(argJson, "filter", wfilter);
    wfilter = replacePipeWithNull(wfilter );


    LogPrint(wfilter);

    LogPrintA("membuka file dialog");
    
    /*
    Find window owner by class name
    */  
    HWND hWndOwner = FindWindowW(Webview2WNDClassname.c_str(), NULL);

    TCHAR szFile[260] = { 0 };

    OPENFILENAME ofn;
    ZeroMemory(&ofn, sizeof(ofn));

    ofn.lStructSize = sizeof(ofn);
    ofn.hwndOwner = NULL;
    ofn.lpstrFile = szFile;
    ofn.nMaxFile = sizeof(szFile);
    ofn.lpstrFilter = wfilter.c_str();
    ofn.nFilterIndex = 1;
    ofn.lpstrFileTitle = NULL;
    ofn.nMaxFileTitle = 0;
    ofn.lpstrInitialDir = NULL;
    ofn.Flags = OFN_PATHMUSTEXIST | OFN_FILEMUSTEXIST;

    // Membuka dialog File Open
    if (GetOpenFileName(&ofn) == TRUE) { 

        result = ofn.lpstrFile; 
    }


    return result;

}

std::wstring openDirDialog() {
    BROWSEINFO bi;
    TCHAR szDir[MAX_PATH];

      
    HWND hWndOwner = FindWindowW(Webview2WNDClassname.c_str(), NULL);

    ZeroMemory(&bi, sizeof(bi));
    bi.hwndOwner = hWndOwner;
    bi.pidlRoot = NULL;
    bi.pszDisplayName = szDir;
    bi.lpszTitle = TEXT("Pilih Direktori");
    bi.ulFlags = BIF_RETURNONLYFSDIRS | BIF_NEWDIALOGSTYLE;

    std::wstring result;
    // Membuka dialog File Dialog
    LPITEMIDLIST pidl = SHBrowseForFolder(&bi);
    if (pidl != NULL) {
         

        // Mengambil path direktori terpilih
        if (SHGetPathFromIDList(pidl, szDir)) {

            result = szDir; 
        }
        // Hapus PIDL setelah digunakan
        CoTaskMemFree(pidl);
    }

    return result;
     
}