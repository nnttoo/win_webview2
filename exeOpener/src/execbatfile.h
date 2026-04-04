#pragma once
 
#include <windows.h>
#include <iostream>
#include <fstream>
#include <filesystem> // Wajib C++17


std::wstring GetExecutablePath()
{
    wchar_t buffer[MAX_PATH];
    GetModuleFileNameW(NULL, buffer, MAX_PATH);
    std::wstring path(buffer);

    // Cari posisi backslash terakhir untuk memotong nama file .exe
    size_t lastSlash = path.find_last_of(L"\\/");
    return path.substr(0, lastSlash); // Return folder tempat .exe berada
}

bool FileExists(const std::wstring& filePath)
{
    // Konversi wstring menjadi objek path
    std::filesystem::path p(filePath);
    
    // std::ifstream sekarang bisa menerima objek path di C++17
    std::ifstream file(p);
    return file.good();
}

int runBatFile() {


    std::cout << "jalani file" << std::endl; 

    // Manipulasi path untuk mendapatkan path ke file batch di folder yang sama
    std::wstring exeDir = GetExecutablePath(); 
    std::wstring batPath = exeDir + L"\\index.bat";

    // Memeriksa keberadaan file batch
    if (!FileExists(batPath))
    {
        std::cout << "File batch tidak ditemukan." << std::endl; 
        return 0;
    }

    std::cout << "Execute bat file" << std::endl; 

    // Struktur untuk menyimpan informasi proses
    STARTUPINFOW si;
    si.dwFlags = STARTF_USESHOWWINDOW;
    si.wShowWindow = SW_HIDE;

    PROCESS_INFORMATION pi;
     

    // Membersihkan struktur
    ZeroMemory(&si, sizeof(si));
    si.cb = sizeof(si);
    ZeroMemory(&pi, sizeof(pi));

    // Membuat proses baru untuk menjalankan file batch
    if (CreateProcessW(NULL, const_cast<wchar_t*>(batPath.c_str()), NULL, NULL, FALSE, CREATE_NO_WINDOW, NULL, NULL, &si, &pi))
    {
        std::cout << "menunggu file" << std::endl; 

        // Menutup handle proses dan thread
        //WaitForSingleObject(pi.hProcess, INFINITE);
        CloseHandle(pi.hProcess);
        CloseHandle(pi.hThread);
    }
    else
    { 
        // Gagal membuat proses
        std::cout << "Gagal menjalankan file batch. Error: " << GetLastError() << std::endl;
    }
     
    return 0;

}