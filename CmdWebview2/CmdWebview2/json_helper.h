#pragma once

#include "json.hpp"

using json = nlohmann::json;

std::wstring JsonGetString(json jsonIn, const std::string& name, const std::wstring& defaultStr) {
	std::wstring result = defaultStr;
	try {
		std::string resultA = jsonIn[name];
		result = ConvertToWideString(resultA);
	}
	catch (const char* e) {
		result = defaultStr;
	}

	return result;
}


std::string JsonGetStringA(json jsonIn, const std::string& name, const std::string& defaultStr) {
	std::string result = defaultStr;
	try {
		result = jsonIn[name]; 
	}
	catch (const char* e) {

	}

	return result;
}

int JsonGetInt(json jsonIn, const std::string& name, const int& defaultInt) {
	int result = defaultInt;
	try {
		result = jsonIn[name];
	}
	catch (const char* e) {

	}

	return result;
}

bool JsonGetBool(json jsonIn, const std::string& name) {
	bool result = false;
	try {
		result = jsonIn[name];
	}
	catch (const char* e) {

	}
	return result;
}