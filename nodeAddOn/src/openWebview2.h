#pragma once

#include <windows.h>
#include <stdlib.h>
#include <string>
#include <tchar.h>
#define WIL_SUPPRESS_EXCEPTIONS
#include <wrl.h>
#include <wil/com.h>
#include <sstream>
// <IncludeHeader>
// include WebView2 header
#include <WebView2.h>
#include "logtool.h"

#include "tools.h"
#include <shlobj.h>
#include <iostream>
#include <wrl.h>

class MyWebView
{

public:
	struct WebViewConfig
	{
		int width;
		int height;
		std::wstring url;
		int modewindow;
		int maximized;
		std::wstring title;
		bool isDebugMode = false;
		std::wstring wclassname;
	};
	Microsoft::WRL::ComPtr<ICoreWebView2Controller> webviewController;
	Microsoft::WRL::ComPtr<ICoreWebView2> webview;

	void realOpenWebview2(
		HWND hWnd,
		HINSTANCE hInstance,
		WebViewConfig config)
	{

		PWSTR localAppData = nullptr;
		SHGetKnownFolderPath(FOLDERID_LocalAppData, 0, NULL, &localAppData);

		std::wstring userDataFolder =
			std::wstring(localAppData) +
			L"\\cmdWebView_" + config.wclassname + L".WebView2";

		LogPrint(userDataFolder);

		CreateCoreWebView2EnvironmentWithOptions(
			nullptr,
			userDataFolder.c_str(),
			nullptr,
			Microsoft::WRL::Callback<ICoreWebView2CreateCoreWebView2EnvironmentCompletedHandler>(
				[this, hWnd, config](HRESULT result, ICoreWebView2Environment *env) -> HRESULT
				{
					// Create a CoreWebView2Controller and get the associated CoreWebView2 whose parent is the main window hWnd
					env->CreateCoreWebView2Controller(
						hWnd,
						Microsoft::WRL::Callback<ICoreWebView2CreateCoreWebView2ControllerCompletedHandler>(
							[this, hWnd, config](HRESULT result, ICoreWebView2Controller *controller) -> HRESULT
							{
								if (controller != nullptr)
								{
									this->webviewController = controller;
									this->webviewController->get_CoreWebView2(this->webview.ReleaseAndGetAddressOf());
								}

								// Add a few settings for the webview
								// The demo step is redundant since the values are the default settings
								Microsoft::WRL::ComPtr<ICoreWebView2Settings> settings;
								this->webview->get_Settings(&settings);
								settings->put_IsScriptEnabled(TRUE);
								settings->put_AreDefaultScriptDialogsEnabled(FALSE);
								settings->put_IsWebMessageEnabled(TRUE);
								settings->put_AreDefaultContextMenusEnabled(FALSE);
								// Resize WebView to fit the bounds of the parent window

								settings->put_AreDevToolsEnabled(config.isDebugMode);
								settings->put_AreDefaultContextMenusEnabled(config.isDebugMode);

								RECT bounds;
								GetClientRect(hWnd, &bounds);

								this->webviewController->put_Bounds(bounds);

								// Schedule an async task to navigate to Bing
								this->webview->Navigate(config.url.c_str());

								// <NavigationEvents>
								// Step 4 - Navigation events
								// register an ICoreWebView2NavigationStartingEventHandler to cancel any non-https navigation
								EventRegistrationToken token;
								this->webview->add_NavigationStarting(
									Microsoft::WRL::Callback<ICoreWebView2NavigationStartingEventHandler>(
										[](ICoreWebView2 *webview, ICoreWebView2NavigationStartingEventArgs *args) -> HRESULT
										{
											return S_OK;
										})
										.Get(),
									&token);

								// if (config.title == L"auto")
								// {
								// 	this->webview->add_DocumentTitleChanged(
								// 		Microsoft::WRL::Callback<ICoreWebView2DocumentTitleChangedEventHandler>(
								// 			[this, hWnd](ICoreWebView2 *webview, IUnknown *args) -> HRESULT
								// 			{
								// 				wil::unique_cotaskmem_string title;
								// 				this->webview->get_DocumentTitle(&title);

								// 				SetWindowTextW(hWnd, title.get());
								// 				return S_OK;
								// 			})
								// 			.Get(),
								// 		&token);
								// }

								return S_OK;
							})
							.Get());
					return S_OK;
				})
				.Get());
	}

	HICON LoadIconFromFile(const std::wstring &filePath)
	{
		return (HICON)LoadImageW(NULL, filePath.c_str(), IMAGE_ICON, 0, 0, LR_LOADFROMFILE);
	}

	void openWebview2(

		HINSTANCE hInstance,
		WebViewConfig config

	)
	{
		WNDCLASSEXW wcex;

		HICON hIcon = LoadIconFromFile(JoinToDllPath(L"icon.ico"));

		wcex.cbSize = sizeof(WNDCLASSEXW);
		wcex.style = CS_HREDRAW | CS_VREDRAW;
		wcex.lpfnWndProc = WndProc;
		wcex.cbClsExtra = 0;
		wcex.cbWndExtra = 0;
		wcex.hInstance = hInstance;

		wcex.hIcon = hIcon;

		wcex.hCursor = LoadCursor(NULL, IDC_ARROW);
		wcex.hbrBackground = (HBRUSH)(COLOR_WINDOW + 1);
		wcex.lpszMenuName = NULL;
		wcex.lpszClassName = config.wclassname.c_str();
		wcex.hIconSm = hIcon;

		if (!RegisterClassExW(&wcex))
		{
			MessageBox(NULL,
					   _T("Call to RegisterClassEx failed!"),
					   _T("Windows Desktop Guided Tour"),
					   NULL);

			return;
		}
 
		std::wcout << config.title << std::endl;
		std::wstring r;

		// config.wclassname = wndClassnme;
		// config.width = 800;
		// config.height = 600;
		// config.url = L"https://github.com/nnttoo/cmd_webview2";
		// config.modewindow = WS_OVERLAPPEDWINDOW;
		// config.maximized = SW_NORMAL;
		// config.title = L"auto";
		// config.isDebugMode = FALSE;

		HINSTANCE hInst;
		// Store instance handle in our global variable
		hInst = hInstance;
		HWND hWnd = CreateWindowW(
			config.wclassname.c_str(),
			config.title.c_str(),
			config.modewindow,
			CW_USEDEFAULT, CW_USEDEFAULT,
			config.width, config.height,
			NULL,
			NULL,
			hInstance,
			this);

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
			config);

		// Main message loop:
		MSG msg;
		while (GetMessage(&msg, NULL, 0, 0))
		{
			TranslateMessage(&msg);
			DispatchMessage(&msg);
		}

		return;
	}

	static LRESULT CALLBACK WndProc(HWND hWnd, UINT message, WPARAM wParam, LPARAM lParam)
	{
		MyWebView *self = (MyWebView *)GetWindowLongPtr(hWnd, GWLP_USERDATA);
		;

		switch (message)
		{
		case WM_NCCREATE:
		{
			CREATESTRUCT *cs = (CREATESTRUCT *)lParam;
			MyWebView *self = (MyWebView *)cs->lpCreateParams;
			SetWindowLongPtr(hWnd, GWLP_USERDATA, (LONG_PTR)self);
			// WAJIB: Panggil DefWindowProcW dulu agar judul & frame diproses sistem
			if (!DefWindowProcW(hWnd, message, wParam, lParam))
			{
				return FALSE;
			}
			return TRUE;
		}
		case WM_SIZE:
			if (self->webviewController != nullptr)
			{
				RECT bounds;
				GetClientRect(hWnd, &bounds);
				self->webviewController->put_Bounds(bounds);
			};
			break;
		case WM_DESTROY:
			PostQuitMessage(0);
			break;
		default:
			return DefWindowProcW(hWnd, message, wParam, lParam);
			break;
		}

		return 0;
	}
};
