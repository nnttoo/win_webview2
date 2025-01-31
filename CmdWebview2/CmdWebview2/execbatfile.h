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
	PROCESS_INFORMATION pi;
	bool stillLooping = true;
	HANDLE pipeOutput, pipeInput, g_hChildStd_IN_Rd, g_hChildStd_IN_Wr;

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

	}; 

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
		STARTUPINFO si; 

		ZeroMemory(&pi, sizeof(PROCESS_INFORMATION));
		ZeroMemory(&si, sizeof(STARTUPINFO));

		// Setup STARTUPINFO
		si.cb = sizeof(si);
		si.dwFlags |= STARTF_USESHOWWINDOW | STARTF_USESTDHANDLES;;
		si.wShowWindow = SW_HIDE;
		si.hStdError = pipeInput;
		si.hStdOutput = pipeInput;
		si.hStdInput = g_hChildStd_IN_Rd;



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
			LogPrintA("CreateProcess failed with error ");
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

	void closeExecBat() {
		stillLooping = false;
		TerminateProcess(pi.hProcess, 0);
	}

	void runBatFile(HINSTANCE hinstance) {
		storedHinstane = hinstance;
		runBatFileInternal();
	}

};