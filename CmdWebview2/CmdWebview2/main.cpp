// compile with: /D_UNICODE /DUNICODE /DWIN32 /D_WINDOWS /c

#include <windows.h>
#include <stdlib.h>
#include <string>
#include <tchar.h>
#include <wrl.h>
#include <wil/com.h> 
#include <sstream>
// <IncludeHeader>
// include WebView2 header
#include "WebView2.h"
// </IncludeHeader>
#include <vector>
#include <iostream> 
#include "tools.h"
#include "resource.h"
#include "argtools.h"
#include "openWebview2.h"
#include "openFolderDialog.h" 
#include "execbatfile.h"
#include "logtools.h" 
#include "MyPipe.h"


int WINAPI   WinMain(
	_In_ HINSTANCE hInstance,
	_In_opt_ HINSTANCE hPrevInstance,
	_In_ LPSTR lpCmdLine,
	_In_  int nCmdShow
)
{
	MyPipe* mypipe = new MyPipe();

	mypipe->isAlive = true;

	std::thread mythread([mypipe] {

		mypipe->createPipeForMain();
	});


	ExecBatFile::runBatFile(hInstance);

	LogPrintA("setelah exec");
	mypipe->isAlive = false;


	mythread.join();
	delete mypipe;
	/*ArgMap arg = ArgMap::parse(lpCmdLine);  
	std::wstring url = arg.getVal(L"url"); 

	LogPrint(url);


	std::wstring fun = arg.getVal(L"fun");  

	if (fun == L"openwebview") {
		openWebview2(hInstance,arg);
	}
	else if (fun == L"openFileDialog") {
		std::wstring result = openFileDialog(arg);
		std::wcout << L"result: " << result << std::endl; 
	}
	else if (fun == L"openFolderDialog") {
		std::wstring result = openDirDialog(arg);
		std::wcout << L"result: " << result << std::endl;
	}
	else {
		runBatFile();
	}*/
		 
	return 0;
} 
