#pragma once
#include <windows.h>
#include <string>
#include <sstream>
#include <iostream>
#include <fstream> 
#include "logtools.h"



bool FileExists(const std::wstring& filePath)
{
	std::ifstream file(filePath);
	return file.good();
}

std::wstring readFileToWString(const std::wstring& filePath) {
	if (!FileExists(filePath)) {
		return L"";
	}

	std::wifstream file(filePath); // Membuka file dengan wifstream
	file.imbue(std::locale(""));   // Mengatur locale agar mendukung Unicode

	if (!file.is_open()) {
		LogPrintA("Gagal Membaca file");
		return L"";
	}

	std::wostringstream ss;
	ss << file.rdbuf(); // Membaca isi file ke dalam stream
	return ss.str();    // Mengembalikan isi file sebagai std::wstring
}

std::string readFileToString(const std::wstring& filePath) {
    if (!FileExists(filePath)) {
        return "";
    }

    std::wifstream file(filePath); // Membuka file dengan wifstream
    file.imbue(std::locale(""));    // Mengatur locale agar mendukung Unicode

    if (!file.is_open()) {
        LogPrintA("Gagal Membaca file");
        return "";
    }

    std::ostringstream ss;
    ss << file.rdbuf();  // Membaca isi file ke dalam stream
    std::string result = ss.str();   // Mengambil isi stream sebagai std::string

    // Konversi dari wstring (berbasis wide character) ke string (berbasis byte)
    std::string output(result.begin(), result.end());

    return output;
}