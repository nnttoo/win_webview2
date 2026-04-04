cmake_minimum_required(VERSION 3.15)
project(ww2_addon)

# Set standar C++ ke 17
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)

# 1. INITIALIZATION & CACHE SETUP
#set(FETCHCONTENT_BASE_DIR "${CMAKE_SOURCE_DIR}/external_deps")
include(FetchContent)

# Hilangkan warning timestamp
if(POLICY CMP0135)
  cmake_policy(SET CMP0135 NEW)
endif()

# 2. DECLARE DEPENDENCIES (WIL & WEBVIEW2)
FetchContent_Declare(
  wil
  URL https://www.nuget.org/api/v2/package/Microsoft.Windows.ImplementationLibrary/1.0.260126.7
)

FetchContent_Declare(
  webview2
  URL https://www.nuget.org/api/v2/package/Microsoft.Web.WebView2/1.0.3856.49
)

# Ambil datanya dulu
FetchContent_MakeAvailable(wil webview2)

# 3. SETUP WIL (Interface Header-only)
# Sekarang wil_SOURCE_DIR sudah tersedia
if(NOT TARGET wil)
    add_library(wil INTERFACE)
    target_include_directories(wil INTERFACE "${wil_SOURCE_DIR}/include")
endif()

# 4. PREPARE PATHS (NODE-API & WEBVIEW2)
execute_process(
    COMMAND node -p "require('node-addon-api').include"
    WORKING_DIRECTORY ${CMAKE_SOURCE_DIR}
    OUTPUT_VARIABLE NODE_ADDON_API_DIR
    OUTPUT_STRIP_TRAILING_WHITESPACE
)
string(REPLACE "\"" "" NODE_ADDON_API_DIR ${NODE_ADDON_API_DIR})

# WebView2 Logic
set(WV2_BASE "${webview2_SOURCE_DIR}/build/native")
if(CMAKE_SIZEOF_VOID_P EQUAL 8)
    set(WV2_ARCH "x64")
else()
    set(WV2_ARCH "x86")
endif()

set(WV2_INCLUDE "${WV2_BASE}/include")
set(WV2_LIB_PATH "${WV2_BASE}/${WV2_ARCH}/WebView2Loader.dll.lib")
set(WV2_DLL_PATH "${WV2_BASE}/${WV2_ARCH}/WebView2Loader.dll")

# 5. DEFINE TARGET & SOURCES
file(GLOB_RECURSE ALL_SOURCES "src/*.cpp")

# Buat file .node
add_library(${PROJECT_NAME} SHARED ${ALL_SOURCES} ${CMAKE_JS_SRC})
set_target_properties(${PROJECT_NAME} PROPERTIES PREFIX "" SUFFIX ".node")

# 6. INCLUDE & LINKING (TARGET-BASED)
target_include_directories(${PROJECT_NAME} PRIVATE 
    ${NODE_ADDON_API_DIR}
    ${CMAKE_JS_INC}
    "${WV2_INCLUDE}"
)

# Hubungkan semua library
# wil di sini akan memberikan path include otomatis karena sudah jadi INTERFACE
target_link_libraries(${PROJECT_NAME} 
    PRIVATE 
    ${CMAKE_JS_LIB} 
    wil 
    "${WV2_LIB_PATH}"
)

# 7. DEFINITIONS & POST-BUILD
target_compile_definitions(${PROJECT_NAME} PRIVATE NAPI_DISABLE_CPP_EXCEPTIONS)

# Copy DLL WebView2 ke folder output agar bisa di-require oleh Node.js
add_custom_command(TARGET ${PROJECT_NAME} POST_BUILD
    COMMAND ${CMAKE_COMMAND} -E copy_if_different
    "${WV2_DLL_PATH}"
    "$<TARGET_FILE_DIR:${PROJECT_NAME}>"
)
