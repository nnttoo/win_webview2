#pragma once

#include <windows.h>
#include <iostream>
#include <fstream>
#include "logtools.h"
#include "tools.h"
#include "filereader.h"
#include "json.hpp"
#include "json_helper.h"
#include "openWebview2.h"
#include "openFolderDialog.h"
#include <thread>



using json = nlohmann::json;
class ExecBatFile {
     HANDLE pipeOutput, pipeInput, g_hChildStd_IN_Rd, g_hChildStd_IN_Wr;
     bool stillLooping = true;
     bool isMainPageOpenned = false;

     void createPipe() {
         SECURITY_ATTRIBUTES saAttr;
         saAttr.nLength = sizeof(SECURITY_ATTRIBUTES);
         saAttr.bInheritHandle = TRUE;
         saAttr.lpSecurityDescriptor = NULL;

         if (!CreatePipe(&pipeOutput, &pipeInput, &saAttr, 0)) {
             std::cerr << "CreatePipe failed with error " << GetLastError() << std::endl;
             return;
         }

         // Ensure the read handle to the pipe for STDOUT is not inherited.

         if (!SetHandleInformation(pipeOutput, HANDLE_FLAG_INHERIT, 0)) return;


         if (!CreatePipe(&g_hChildStd_IN_Rd, &g_hChildStd_IN_Wr, &saAttr, 0)) {
             LogPrint(L"error SetHandleInformation g_hChildStd_IN_Wr");
             return;
         }
         if (!SetHandleInformation(g_hChildStd_IN_Wr, HANDLE_FLAG_INHERIT, 0)) {
             LogPrint(L"error SetHandleInformation g_hChildStd_IN_Wr");
             return;
         }

     }

     void sendMessage(std::string content) {
         DWORD bytesWritten; 

         const char* buffer = content.c_str();  // Dapatkan pointer ke karakter dalam std::wstring
         size_t bufferSize = content.size() ;  // Ukuran dalam byte

         if (!WriteFile(g_hChildStd_IN_Wr, buffer, bufferSize, &bytesWritten, NULL)) {
             LogPrint(L"ini error broooo");
         }
     }

     bool executeWhenJson(std::string content) {
         std::string prefix = "WINWEBVIEW_JSON";

         if (!startsWith(content, prefix)) return false;
         std::string nstr = content.substr(prefix.length()); 

         json jsonData = json::parse(nstr);

         std::string fun = JsonGetStringA(jsonData, "fun", "");
         bool isMainPage = false;

         // HR 29 Januari 2025
         // Jika mainpage belum dibuka, maka jadikan page ini sebagai mainPage, dan akhiri process ketika 
         // webview ditutup
         if (!isMainPageOpenned) {
             isMainPageOpenned = true;
             isMainPage = true;
         }
         
         if (fun == "OpenWeb") {

             std::thread loopThread([jsonData, isMainPage, this] { 
                 
                 LogPrintA("Mencoba membuaka");
                 openWebview2JSON(storedHinstane, jsonData);
                 LogPrintA("Pageview ditutup");

                 if (isMainPage) {
                     sendMessage("WINWEBVIEW_MAINPAGEISCLOSED");
                     stillLooping = false;
                 }
             
             }); 
             loopThread.detach();

             return true;
         } 

         if (fun == "OpenDialogFIle") {

             std::thread mythread([jsonData,this] {
                    std::wstring result = openFileDialog(jsonData);
                    std::string resultA = wstringToString(result);
                    sendMessage("WIN_WEBVIEW2_RESULT"+resultA);
             });

             

             mythread.detach();
             return true;
         }

         if (fun == "OpenDialogFolder") {
             
             std::thread mythread([  this] {
                 std::wstring result = openDirDialog();
                 std::string resultA = wstringToString(result);
                 sendMessage("WIN_WEBVIEW2_RESULT" + resultA);
              });

             mythread.detach();
             return true;
         }


         return true;
     } 

     void readingLoop() {
         // Membaca output dari pipe
         char buffer[4096];  // Menggunakan wchar_t untuk output Unicode
         DWORD bytesRead;
         BOOL bSuccess = FALSE;
         while (stillLooping) {
             bSuccess = ReadFile(pipeOutput, buffer, 4096, &bytesRead, NULL);
             if (!bSuccess || bytesRead == 0) {
                 break;
             }

             buffer[bytesRead] = '\0';

             std::string msg(buffer);

             if (executeWhenJson(msg)) continue;

           
             LogPrintA("NODEJS : " + msg);
         }
     }

     int runBatFileInternal() {

         LogPrint(L"Menjalankan File ");
         createPipe();

         // Mendapatkan path eksekusi
         wchar_t  exePath[MAX_PATH];
         GetModuleFileName(NULL, exePath, MAX_PATH);

         // Manipulasi path untuk mendapatkan path ke file batch di folder yang sama
         std::wstring exeDir = exePath;
         size_t lastSlashIndex = exeDir.find_last_of(L"\\/");
         std::wstring batPath = exeDir.substr(0, lastSlashIndex + 1) + L"index.conf";

         std::wstring batContent = readFileToWString(batPath);

         if (batContent == L"") {
             LogPrintA("Gagal membaca file");
             return 0;
         } 
         

         // Struktur untuk informasi proses
         STARTUPINFO si;
         PROCESS_INFORMATION pi;

         ZeroMemory(&pi, sizeof(PROCESS_INFORMATION));
         ZeroMemory(&si, sizeof(STARTUPINFO));

         // Setup STARTUPINFO
         si.cb = sizeof(si);
         si.dwFlags |= STARTF_USESHOWWINDOW | STARTF_USESTDHANDLES;;
         si.wShowWindow = SW_HIDE;
         si.hStdError = pipeInput;
         si.hStdOutput = pipeInput;
         si.hStdInput = g_hChildStd_IN_Rd;

         std::wstring nodeCommand = L"node index.js";
         // Membuat proses baru untuk menjalankan file batch
         if (!CreateProcess(
             NULL,
             const_cast<wchar_t*>(batContent.c_str()),    // Command line
             NULL,                           // Process handle not inheritable
             NULL,                           // Thread handle not inheritable
             TRUE,                           // Set handle inheritance
             0,                              // No creation flags
             NULL,                           // Use parent's environment block
             NULL,                           // Use parent's starting directory 
             &si,                            // Pointer to STARTUPINFO structure
             &pi

         )) {
             std::cerr << "CreateProcess failed with error " << GetLastError() << std::endl;
             return 1;


         }
         else {

             CloseHandle(pipeInput);
             CloseHandle(g_hChildStd_IN_Rd);

             readingLoop();
             TerminateProcess(pi.hProcess, 0);
             // Menunggu proses selesai
             //WaitForSingleObject(pi.hProcess, INFINITE);
             LogPrint(L"Process berakhir");
             // Menutup handle proses dan pipe
             CloseHandle(pi.hProcess);
             CloseHandle(pi.hThread);
             CloseHandle(pipeOutput);
             CloseHandle(g_hChildStd_IN_Wr);
         }

         return 0;

     }

     public:

         HINSTANCE storedHinstane;
         static void runBatFile(HINSTANCE hinstance) {
             ExecBatFile exec; 
             exec.storedHinstane = hinstance;
             exec.runBatFileInternal();
         }

};