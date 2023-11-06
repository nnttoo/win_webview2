#!/bin/sh

# ini digunakan untuk mencopy file dari
# folder relese visual studio ke folder bin

binfolder="./win_webview2_node/bin"
binWin32=$binfolder/Win32
binX64=$binfolder/x64

mkdir $binfolder
mkdir $binWin32
mkdir $binX64

 
releaseWin32="./win32lib/win_webview2_lib/Release"
releasex64="./win32lib/win_webview2_lib/x64/Release"


cp $releaseWin32/WebView2Loader.dll $binWin32/
cp $releaseWin32/win_webview2_lib.dll $binWin32/

cp $releasex64/WebView2Loader.dll $binX64/ 
cp $releasex64/win_webview2_lib.dll $binX64/ 