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


#define PIPE_NAME L"\\\\.\\pipe\\MyNamedPipe"

class MyPipe {
    public :
        bool isAlive = false;

        void createPipeForMain() {
            HANDLE hPipe;
            char buffer[4096];
            DWORD bytesRead, bytesWritten;

            hPipe = CreateNamedPipe(
                PIPE_NAME,
                PIPE_ACCESS_DUPLEX,  // Bisa baca & tulis
                PIPE_TYPE_BYTE | PIPE_WAIT,
                1, 0, 0, 0,
                NULL
            );

            if (hPipe == INVALID_HANDLE_VALUE) {
            
                LogPrintA("gagal membuat pipe");

                return;
            }

            LogPrintA("Menunggu Client");

            ConnectNamedPipe(hPipe, NULL);
            LogPrintA( "Client terhubung!\n");
            while (isAlive) {

                ReadFile(hPipe, buffer, sizeof(buffer), &bytesRead, NULL);
                buffer[bytesRead] = '\0';


                std::string msg(buffer);

                LogPrintA("Pesan dari Node " + msg) ;

                // Kirim balasan ke client
                const char* reply = "Halo juga dari server!";
                WriteFile(hPipe, reply, strlen(reply), &bytesWritten, NULL);
            }

            // Baca dari client
           

            CloseHandle(hPipe);

            LogPrintA("Pipe DItutup");
            return;
        }
};
