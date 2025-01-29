#pragma once

#include <windows.h>
#include <stdlib.h> 
#include <stdlib.h>
#include <string>

void LogPrint(std::wstring str) {

	std::wcout << str << std::endl;
	str = str  + L"\n\n";
	LPCWSTR lpcwstr =str.c_str();
	OutputDebugStringW(lpcwstr);
}


void LogPrintA(std::string str) {

	std::cout << str << std::endl;
	str = str + "\n";
	LPCSTR lpcwstr = str.c_str();
	OutputDebugStringA(lpcwstr);
}
