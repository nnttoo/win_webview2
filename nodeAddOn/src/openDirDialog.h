#pragma once

#include <windows.h>
#include <commdlg.h> // Penting untuk GetOpenFileName
#include <vector>
#include <string>
#include <shlobj.h>

namespace DialogDir
{
    struct DialogDirArg
    {
        std::wstring filter;
        std::wstring ownerClassName;
    };

    std::wstring openDirDialog(DialogDirArg argmap) {
        std::wstring result = L"";

        // 1. Inisialisasi COM (Penting!)
        HRESULT hr = CoInitializeEx(NULL, COINIT_APARTMENTTHREADED | COINIT_DISABLE_OLE1DDE);
        if (FAILED(hr)) return L"";

        IFileOpenDialog *pFileOpen;

        // 2. Buat instance FileOpenDialog
        hr = CoCreateInstance(CLSID_FileOpenDialog, NULL, CLSCTX_ALL, 
                              IID_IFileOpenDialog, reinterpret_cast<void**>(&pFileOpen));

        if (SUCCEEDED(hr)) {
            // 3. SET MODE PILIH FOLDER (Kuncinya di sini)
            DWORD dwOptions;
            if (SUCCEEDED(pFileOpen->GetOptions(&dwOptions))) {
                pFileOpen->SetOptions(dwOptions | FOS_PICKFOLDERS);
            }

            // 4. Set Owner Window (Opsional)
            HWND hWndOwner = NULL;
            if (!argmap.ownerClassName.empty()) {
                hWndOwner = FindWindowW(argmap.ownerClassName.c_str(), NULL);
            }

            // 5. Tampilkan Dialog
            hr = pFileOpen->Show(hWndOwner);

            if (SUCCEEDED(hr)) {
                IShellItem *pItem;
                hr = pFileOpen->GetResult(&pItem);
                if (SUCCEEDED(hr)) {
                    PWSTR pszFilePath;
                    // Ambil path sistem file-nya
                    hr = pItem->GetDisplayName(SIGDN_FILESYSPATH, &pszFilePath);
                    if (SUCCEEDED(hr)) {
                        result = pszFilePath;
                        CoTaskMemFree(pszFilePath); // Bebaskan string temporary
                    }
                    pItem->Release();
                }
            }
            pFileOpen->Release();
        }

        CoUninitialize(); // Selesai dengan COM
        return result;
    }
}