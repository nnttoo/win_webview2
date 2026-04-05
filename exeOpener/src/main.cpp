#include <windows.h>
#include "splash.h"
#include "execbatfile.h"
#include <iostream> 
#include <io.h>
#include <fcntl.h>
#include <iostream>
  

int CALLBACK WinMain(
	_In_ HINSTANCE hInstance,
	_In_ HINSTANCE hPrevInstance,
	_In_ LPSTR     lpCmdLine,
	_In_ int       nCmdShow
)
{   
    std::cout << "jalani file" << std::endl;

    std::wstring filepath = GetExecutablePath() + L"\\splash.png";
    runBatFile();

    if (FileExists(filepath))
    {
        showSplashScreen(filepath);
    }

    return 0;
}
