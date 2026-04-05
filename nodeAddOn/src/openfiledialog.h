#pragma once

#include <windows.h>
#include <commdlg.h> // Penting untuk GetOpenFileName
#include <vector>
#include <string>

namespace DialogFile
{

    struct DialogFileArg
    {
        std::wstring filter;
        std::wstring ownerClassName;
    };

    std::wstring openFileDialog(DialogFileArg argmap)
    {
        std::wstring result = L"";

        // 1. Inisialisasi COM
        HRESULT hr = CoInitializeEx(NULL, COINIT_APARTMENTTHREADED | COINIT_DISABLE_OLE1DDE);
        if (FAILED(hr))
            return L"";

        IFileOpenDialog *pFileOpen;
        hr = CoCreateInstance(CLSID_FileOpenDialog, NULL, CLSCTX_ALL,
                              IID_IFileOpenDialog, reinterpret_cast<void **>(&pFileOpen));

        if (SUCCEEDED(hr))
        {
            // 2. Menangani Filter (Jauh lebih manusiawi)
            if (!argmap.filter.empty())
            {
                std::vector<COMDLG_FILTERSPEC> fileTypes;
                size_t pos = 0;
                std::wstring token;
                std::wstring fullFilter = argmap.filter;
                std::vector<std::wstring> parts;

                // Split string berdasarkan '|'
                size_t start = 0, end;
                while ((end = fullFilter.find(L'|', start)) != std::wstring::npos)
                {
                    parts.push_back(fullFilter.substr(start, end - start));
                    start = end + 1;
                }
                parts.push_back(fullFilter.substr(start));

                // Masukkan ke array COMDLG_FILTERSPEC (Nama, Ekstensi)
                for (size_t i = 0; i + 1 < parts.size(); i += 2)
                {
                    fileTypes.push_back({parts[i].c_str(), parts[i + 1].c_str()});
                }

                if (!fileTypes.empty())
                {
                    pFileOpen->SetFileTypes((UINT)fileTypes.size(), fileTypes.data());
                }
            }

            // 3. Set Owner Window
            HWND hWndOwner = NULL;
            if (!argmap.ownerClassName.empty())
            {
                hWndOwner = FindWindowW(argmap.ownerClassName.c_str(), NULL);
            }

            // 4. Tampilkan Dialog
            hr = pFileOpen->Show(hWndOwner);

            if (SUCCEEDED(hr))
            {
                IShellItem *pItem;
                hr = pFileOpen->GetResult(&pItem);
                if (SUCCEEDED(hr))
                {
                    PWSTR pszFilePath;
                    hr = pItem->GetDisplayName(SIGDN_FILESYSPATH, &pszFilePath);
                    if (SUCCEEDED(hr))
                    {
                        result = pszFilePath;
                        CoTaskMemFree(pszFilePath);
                    }
                    pItem->Release();
                }
            }
            pFileOpen->Release();
        }

        CoUninitialize();
        return result;
    }
}
