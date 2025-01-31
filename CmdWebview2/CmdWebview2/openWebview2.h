#pragma once

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


#include "resource.h"
#include "tools.h" 
#include "json.hpp"
#include "json_helper.h"
#include "tools.h"

using json = nlohmann::json;
 

LRESULT CALLBACK WndProc(HWND, UINT, WPARAM, LPARAM);  
static wil::com_ptr<ICoreWebView2Controller> webviewController; 
static wil::com_ptr<ICoreWebView2> webview;


struct WebViewConfig
{
	int width = 800;
	int height = 400; 
	std::wstring url = L"";
	int modewindow = WS_OVERLAPPEDWINDOW;
	int maximized = SW_NORMAL;
	std::wstring title = L"auto";
	bool isDebugMode = false;
};


void realOpenWebview2(
	HWND hWnd,
	HINSTANCE hInstance,  
	WebViewConfig config)
{  
	 
	CreateCoreWebView2EnvironmentWithOptions(nullptr, nullptr, nullptr,
		Microsoft::WRL::Callback<ICoreWebView2CreateCoreWebView2EnvironmentCompletedHandler>(
			[hWnd, config](HRESULT result, ICoreWebView2Environment* env) -> HRESULT {

				// Create a CoreWebView2Controller and get the associated CoreWebView2 whose parent is the main window hWnd
				env->CreateCoreWebView2Controller(hWnd, Microsoft::WRL::Callback<ICoreWebView2CreateCoreWebView2ControllerCompletedHandler>(
					[hWnd, config](HRESULT result, ICoreWebView2Controller* controller) -> HRESULT {
						if (controller != nullptr) {
							webviewController = controller;
							webviewController->get_CoreWebView2(&webview);
						}

						// Add a few settings for the webview
						// The demo step is redundant since the values are the default settings
						wil::com_ptr<ICoreWebView2Settings> settings;
						webview->get_Settings(&settings);
						settings->put_IsScriptEnabled(TRUE);
						settings->put_AreDefaultScriptDialogsEnabled(FALSE);
						settings->put_IsWebMessageEnabled(TRUE);


						settings->put_AreDevToolsEnabled(config.isDebugMode);
						settings->put_AreDefaultContextMenusEnabled(config.isDebugMode);
						// Resize WebView to fit the bounds of the parent window
						RECT bounds;
						GetClientRect(hWnd, &bounds);

						webviewController->put_Bounds(bounds);



						// Schedule an async task to navigate to Bing
						webview->Navigate(config.url.c_str());

						// <NavigationEvents>
						// Step 4 - Navigation events
						// register an ICoreWebView2NavigationStartingEventHandler to cancel any non-https navigation
						EventRegistrationToken token;
						webview->add_NavigationStarting(Microsoft::WRL::Callback<ICoreWebView2NavigationStartingEventHandler>(
							[](ICoreWebView2* webview, ICoreWebView2NavigationStartingEventArgs* args) -> HRESULT {
								 
								/*
								wil::unique_cotaskmem_string uri;
								args->get_Uri(&uri);
								std::wstring source(uri.get());
								if (source.substr(0, 5) != L"https") {
									args->put_Cancel(true);
								}
								*/
								return S_OK;
							}).Get(), &token);
						if (config.title == L"auto") {
							webview->add_DocumentTitleChanged(Microsoft::WRL::Callback<ICoreWebView2DocumentTitleChangedEventHandler>(
								[hWnd](ICoreWebView2* webview, IUnknown* args) -> HRESULT {
									wil::unique_cotaskmem_string title;
									webview->get_DocumentTitle(&title);

									SetWindowTextW(hWnd, title.get());

									/*
									wil::unique_cotaskmem_string uri;
									args->get_Uri(&uri);
									std::wstring source(uri.get());
									if (source.substr(0, 5) != L"https") {
										args->put_Cancel(true);
									}
									*/
									return S_OK;
								}).Get(), &token);
						}
						

						return S_OK;
					}).Get());
				return S_OK;
			}).Get()); 
}

HICON LoadIconFromFile(const std::wstring& filePath) {
	return (HICON)LoadImage(NULL, filePath.c_str(), IMAGE_ICON, 0, 0, LR_LOADFROMFILE);
} 

void openWebview2JSON(

	HINSTANCE hInstance,
	json jsonIn

) {

	WebViewConfig config;
	config.width = JsonGetInt(jsonIn, "width", 800);
	config.height = JsonGetInt(jsonIn, "height", 600);
	config.url = JsonGetString(jsonIn, "url", L"https://github.com/nnttoo/cmd_webview2");
	config.modewindow = (JsonGetBool(jsonIn, "kiosk")) ? WS_POPUP : WS_OVERLAPPEDWINDOW; //
	config.maximized = (JsonGetBool(jsonIn, "maximize")) ? SW_MAXIMIZE : SW_NORMAL; //
	config.title = JsonGetString(jsonIn, "title", L"auto");
	config.isDebugMode = JsonGetBool(jsonIn, "isDebugMode");


	HICON hIcon = LoadIconFromFile(L"icon.ico");  


	WNDCLASSEX wcex;
	wcex.cbSize = sizeof(WNDCLASSEX);
	wcex.style = CS_HREDRAW | CS_VREDRAW;
	wcex.lpfnWndProc = WndProc;
	wcex.cbClsExtra = 0;
	wcex.cbWndExtra = 0;
	wcex.hInstance = hInstance;

	wcex.hIcon = hIcon;

	wcex.hCursor = LoadCursor(NULL, IDC_ARROW);
	wcex.hbrBackground = (HBRUSH)(COLOR_WINDOW + 1);
	wcex.lpszMenuName = NULL;
	wcex.lpszClassName = Webview2WNDClassname.c_str();
	wcex.hIconSm = hIcon;


	if (!RegisterClassEx(&wcex))
	{
		MessageBox(NULL,
			_T("Call to RegisterClassEx failed!"),
			_T("Windows Desktop Guided Tour"),
			NULL);

		return;
	}

	LogPrintA( "mulai membuka windows") ;  
	HINSTANCE hInst;
	// Store instance handle in our global variable
	hInst = hInstance;
	HWND hWnd = CreateWindowW(
		Webview2WNDClassname.c_str(),
		config.title.c_str(),
		config.modewindow,
		CW_USEDEFAULT, CW_USEDEFAULT,
		config.width, config.height,
		NULL,
		NULL,
		hInstance,
		NULL
	);

	if (!hWnd)
	{
		MessageBox(NULL,
			_T("Call to CreateWindow failed!"),
			_T("Windows Desktop Guided Tour"),
			NULL);

		return;
	}

	ShowWindow(hWnd, config.maximized);
	UpdateWindow(hWnd);

	realOpenWebview2(
		hWnd,
		hInst,
		config
	);

	// Main message loop:
	MSG msg;
	while (GetMessage(&msg, NULL, 0, 0))
	{
		TranslateMessage(&msg);
		DispatchMessage(&msg);
	}

	return;
}

LRESULT CALLBACK WndProc(HWND hWnd, UINT message, WPARAM wParam, LPARAM lParam)
{

	switch (message)
	{
	case WM_SIZE:
		if (webviewController != nullptr) {
			RECT bounds;
			GetClientRect(hWnd, &bounds);
			webviewController->put_Bounds(bounds);
		};
		break;
	case WM_DESTROY:
		PostQuitMessage(0);
		break;
	default:
		return DefWindowProc(hWnd, message, wParam, lParam);
		break;
	}

	return 0;
}