cmake_minimum_required(VERSION 3.10)
project(appLauncher)
if(MINGW)
    # Static linking agar tidak butuh libgcc_s_dw2-1.dll dan libstdc++-6.dll
    add_link_options(-static -static-libgcc -static-libstdc++)
endif()
set(CMAKE_CXX_STANDARD 17)

# 1. Definisikan Executable dulu
add_executable(appLauncher WIN32 src/main.cpp)
 
# 2. Link library
target_link_libraries(appLauncher gdiplus)

# 3. Tentukan lokasi sumber dan tujuan
set(ASSET_SOURCE "${CMAKE_CURRENT_SOURCE_DIR}/assets/") 
 
add_custom_command(
    TARGET appLauncher POST_BUILD 
    COMMAND ${CMAKE_COMMAND} -E copy_directory "${ASSET_SOURCE}" "${CMAKE_BINARY_DIR}"
    COMMENT "Menyalin splash.png ke folder build..."
)
