#pragma once

#include <windows.h>
#include <string>
/// <summary>
/// 
/// pastte MYLIBRARY_EXPORTS di pengaturan
/// c++ preprocesor->prepocesor definitin

/// @author Haryanto
/// </summary>


#ifdef MYLIBRARY_EXPORTS
#define MYLIBRARY_API __declspec(dllexport)
#else
#define MYLIBRARY_API __declspec(dllimport)
#endif

typedef void (*CallbackType)(char* s);
extern "C" MYLIBRARY_API int OpenWebview(char* url, CallbackType cb);