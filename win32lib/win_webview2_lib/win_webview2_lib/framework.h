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

typedef void (*CallbackType)(const char* s);
extern "C" MYLIBRARY_API void OpenWebview(
	const char* url,
	int width,
	int height,
	bool maximize,
	bool kiosk,
	const char* title,
	const char* windowclassname,
	const char* windowParentclassname,
	CallbackType cb);