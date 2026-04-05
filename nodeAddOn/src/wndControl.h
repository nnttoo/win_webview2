#pragma once
#include <windows.h>
#include <commdlg.h> // Penting untuk GetOpenFileName
#include <vector>
#include <string>
#include <shlobj.h>
#include <napi.h>
#include "napitools.h"

namespace WndControll
{
    struct WndControllArg
    {
        std::wstring wndClassName;
        std::wstring controlcmd;
        int top;
        int left;
        int width;
        int height;
    };

    WndControllArg parseNapi(Napi::Object obj)
    {
        WndControllArg arg;

        arg.wndClassName = MyNapiTools::NapiToWString(obj.Get("wndClassName"));
        arg.controlcmd = MyNapiTools::NapiToWString(obj.Get("controlcmd"));
        arg.width = MyNapiTools::NapiToInt(obj.Get("width"), 0);
        arg.height = MyNapiTools::NapiToInt(obj.Get("height"), 0);
        arg.top = MyNapiTools::NapiToInt(obj.Get("top"), 0);
        arg.left = MyNapiTools::NapiToInt(obj.Get("left"), 0);

        return arg;
    }

    std::wstring controlWindow(
        WndControllArg argmap)
    {

        std::wstring classname = argmap.wndClassName;
        std::wstring controlcmd = argmap.controlcmd;
        if (classname == L"")
            return L"noclassname";

        HWND hWndOwner = FindWindowW(classname.c_str(), NULL);

        std::wstring result = L"window not found";
        if (hWndOwner != NULL)
        {
            if (controlcmd == L"close")
            {

                PostMessage(hWndOwner, WM_CLOSE, 0, 0);
            } 

            else if (controlcmd == L"maximize")
            {
                ShowWindow(hWndOwner, SW_MAXIMIZE);
                SetForegroundWindow(hWndOwner);
            }
            else if (controlcmd == L"minimize")
            {
                ShowWindow(hWndOwner, SW_MINIMIZE);
            }

            else if (controlcmd == L"move")
            {

                int itop = argmap.top;
                int ileft = argmap.left;
                {
                    SetWindowPos(hWndOwner, NULL, ileft, itop, 0, 0, SWP_NOZORDER | SWP_NOSIZE);
                    SetForegroundWindow(hWndOwner);
                }
            }

            else if (controlcmd == L"resize")
            {

                int iheight = argmap.height;
                int iwidth = argmap.width;
                {
                    SetWindowPos(hWndOwner, NULL, 0, 0, iwidth, iheight, SWP_NOMOVE | SWP_NOZORDER);
                    SetForegroundWindow(hWndOwner);
                }
            }
            result = L"success";
        }

        return result;
    }
}
