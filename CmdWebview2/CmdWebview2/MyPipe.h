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
#include "execbatfile.h"
#include <thread>

 

class MyPipe {

    HANDLE hPipeReader;
    HANDLE hPipeSender;
    bool isMainPageOpenned = false; 

    bool executeWhenJson(std::string content) {
        std::string prefix = "WINWEBVIEW_JSON";

        if (!startsWith(content, prefix)) return false;
        std::string nstr = content.substr(prefix.length());

        json jsonData = json::parse(nstr);

        std::string fun = JsonGetStringA(jsonData, "fun", "");
        bool isMainPage = false;

       

        if (fun == "OpenWeb") {

           // HR 29 Januari 2025
           // Jika mainpage belum dibuka, maka jadikan page ini sebagai mainPage, dan akhiri process ketika 
           // webview ditutup
            if (!isMainPageOpenned) {
                isMainPageOpenned = true;
                isMainPage = true;
            }

            std::thread loopThread([jsonData, isMainPage, this] {

                LogPrintA("Mencoba membuaka"); 
                openWebview2JSON(storedHinstane, jsonData);
                LogPrintA("Pageview ditutup");


                if (isMainPage) {
                    closeAllPipe();
                }

            });
            loopThread.detach();

            return true;
        }

        if (fun == "OpenDialogFIle") {

            std::thread mythread([jsonData, this] {
                std::wstring result = openFileDialog(jsonData);
                std::string resultA = wstringToString(result);
                sendMessage("WIN_WEBVIEW2_RESULT" + resultA);
                });



            mythread.detach();
            return true;
        }

        if (fun == "OpenDialogFolder") {

            std::thread mythread([this] {
                std::wstring result = openDirDialog();
                std::string resultA = wstringToString(result);
                sendMessage("WIN_WEBVIEW2_RESULT" + resultA);
                });

            mythread.detach();
            return true;
        }


        return true;
    }

    void sendMessage(std::string content) {
        DWORD bytesWritten;

        const char* buffer = content.c_str(); 
        size_t bufferSize = content.size();   

        LogPrintA("Send MEssage " + content);
        if (!WriteFile(hPipeSender, buffer, bufferSize, &bytesWritten, NULL)) {
            LogPrint(L"ini error broooo");
        }
    }

    void createPipeForSend() {
        std::wstring pipeSenderName = PIPE_NAME + L"Sender"; 
        hPipeSender = CreateNamedPipe(
            pipeSenderName.c_str(),
            PIPE_ACCESS_OUTBOUND,
            PIPE_TYPE_BYTE | PIPE_WAIT,
            1, 0, 0,
            0, NULL
        );
        if (hPipeReader == INVALID_HANDLE_VALUE) {

            LogPrintA("gagal membuat pipe");

            return;
        }

        ConnectNamedPipe(hPipeSender, NULL);
        LogPrintA("Client Sender terhubung!\n"); 
    }

    void closeAllPipe() {
        LogPrintA("Coba tutup pipe");

        isAlive = false;

        CancelIoEx(hPipeSender, NULL);
        CancelIoEx(hPipeReader, NULL); 

        execBatFile->closeExecBat();

        LogPrintA("closeAllPipe DONE");
    }

    void createPipeForRead() { 
        char buffer[1024];
        DWORD bytesRead, bytesWritten;
        while (isAlive) {

            hPipeReader = CreateNamedPipe(
                PIPE_NAME.c_str(),
                PIPE_ACCESS_INBOUND, // untuk membaca kalau PIPE_ACCESS_DUPLEX untuk dua arah
                PIPE_TYPE_BYTE | PIPE_WAIT,
                1, 0, 0,
                0, NULL
            );

            if (hPipeReader == INVALID_HANDLE_VALUE) {

                LogPrintA("gagal membuat pipe");

                return;
            }

            ConnectNamedPipe(hPipeReader, NULL);
            LogPrintA("Client terhubung!\n");

            bool readResult = ReadFile(hPipeReader, buffer, sizeof(buffer), &bytesRead, NULL);
            if (!readResult) break;
            buffer[bytesRead] = '\0';
            std::string msg(buffer);
            LogPrintA("Pesan dari Node " + msg);
            executeWhenJson(msg);

            DisconnectNamedPipe(hPipeReader);
            CloseHandle(hPipeReader);
            LogPrintA("After executeWhenJson");
        } 
        LogPrintA("Pipe hPipeReader DItutup");
        return;
    }

    public :

        bool isAlive = false;
        std::wstring PIPE_NAME = L"\\\\.\\pipe\\MyNamedPipe";
        HINSTANCE storedHinstane;
        ExecBatFile* execBatFile = NULL;

        void setEnvironment() {
            PIPE_NAME += GetMillisecondInstr();
            SetEnvironmentVariable(L"PIPE_PATH", PIPE_NAME.c_str());
        }

        

        void createPipeForMain() {

            createPipeForSend();
            createPipeForRead(); 
        }
};
