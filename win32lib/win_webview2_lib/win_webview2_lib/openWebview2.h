#pragma once 

#include <windows.h>
#include <stdlib.h>
#include <string>
#include <tchar.h>
#include <wrl.h>
#include <wil/com.h> 
#include <sstream>
#include <iostream>
// <IncludeHeader>
// include WebView2 header
#include "WebView2.h"
#include "toolsString.h"


#include "resource.h" 


LRESULT CALLBACK WndProc(HWND, UINT, WPARAM, LPARAM);
static wil::com_ptr<ICoreWebView2Controller> webviewController;
static wil::com_ptr<ICoreWebView2> webview;


struct WebViewConfig
{
	int width;
	int height;
	std::wstring url;
	int modewindow;
	int maximized;
	std::wstring title;
	std::wstring windowclassname;
};

void realOpenWebview2(
	HWND hWnd,
	HINSTANCE hInstance,
	WebViewConfig config)
{


	std::wstring m_userDataFolder = GetAppDataPath();

	HRESULT hr = CreateCoreWebView2EnvironmentWithOptions(
		nullptr,
		m_userDataFolder.c_str(),
		nullptr,
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
						settings->put_AreDevToolsEnabled(FALSE);
						settings->put_AreDefaultContextMenusEnabled(FALSE);

						// Resize WebView to fit the bounds of the parent window
						RECT bounds;
						GetClientRect(hWnd, &bounds);

						webviewController->put_Bounds(bounds);



						// Schedule an async task to navigate to Bing
						webview->Navigate(config.url.c_str());
						webview->OpenDevToolsWindow();

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

void openWebview2(

	HINSTANCE hInstance,
	WebViewConfig webcongif

) {
	WNDCLASSEX wcex;
	HICON hIcon = LoadIcon(hInstance, MAKEINTRESOURCE(IDI_ICON1));


	std::wstring classname = webcongif.windowclassname;
	std::wstring wndClassnme = (classname != L"") ? classname : L"mywindowsClassName";

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
	wcex.lpszClassName = wndClassnme.c_str();
	wcex.hIconSm = hIcon;


	if (!RegisterClassEx(&wcex))
	{
		MessageBox(NULL,
			_T("Call to RegisterClassEx failed!"),
			_T("Windows Desktop Guided Tour"),
			NULL);

		return;
	}

	std::cout << "mulai membuka windows" << std::endl;
	std::wstring r;
	 
	if (webcongif.modewindow == 0) {

		webcongif.modewindow = WS_OVERLAPPEDWINDOW;
	}

	if (webcongif.maximized == 0) {

		webcongif.maximized = SW_NORMAL;
	}


	HINSTANCE hInst;
	// Store instance handle in our global variable
	hInst = hInstance;
	HWND hWnd = CreateWindowW(
		wndClassnme.c_str(),
		webcongif.title.c_str(),
		webcongif.modewindow,
		CW_USEDEFAULT, CW_USEDEFAULT,
		webcongif.width, webcongif.height,
		NULL,
		NULL,
		hInst,
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

	ShowWindow(hWnd, webcongif.maximized);
	UpdateWindow(hWnd);

	realOpenWebview2(
		hWnd,
		hInst,
		webcongif
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