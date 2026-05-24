#!/bin/bash

set -e

sudo true

os="$(uname)"
os_version=$(sw_vers -productVersion)
architecture=$(uname -m)
rosetta_running=$(sysctl -in sysctl.proc_translated)
required_version="14.0"

version_ge() {
    local major1="${1%%.*}"
    local major2="${2%%.*}"
    [[ "$major1" -ge "$major2" ]]
}

if [[ "${os}" == "Darwin" ]]; then
    :
else
    echo "Well, it's for Mac"
    exit 1
fi

if [[ "$rosetta_running" == "1" ]]; then
    echo "The script is running under Rosetta 2. Please close Rosetta 2 to run this script natively on ARM64."
    exit 1
fi

if version_ge "$os_version" $required_version && [[ "$architecture" == "arm64" ]]; then
    :
else
    echo "This script requires macOS Sonoma(14.0) or later and ARM architecture."
    exit 1
fi

if [ -z "${BASH_SOURCE[0]}" ]; then
    echo "Error: BASH_SOURCE is not defined. Make sure you are running this script in a compatible Bash environment."
    exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" &>/dev/null && pwd)"

cd "$SCRIPT_DIR"

trap 'echo "An error occurred.";exit 1' ERR

if ! xcode-select -p &>/dev/null; then
    echo "安装Xcode Command Line Tools..."
    xcode-select --install

    echo "等待Xcode Command Line Tools安装完成..."
    while true; do
        sleep 20

        if xcode-select -p &>/dev/null; then
            echo "Xcode Command Line Tools已安装完成。"
            break
        else
            echo "正在安装中，请稍候..."
        fi
    done
fi

echo "获取权限"

install_name_tool -rpath /opt/homebrew/opt/ffmpeg/lib @loader_path/../../.. \
./runtime/lib/python3.10/site-packages/torchcodec/libtorchcodec_core8.dylib

codesign --force --sign - \
./runtime/lib/python3.10/site-packages/torchcodec/libtorchcodec_core8.dylib

install_name_tool -rpath /opt/homebrew/opt/ffmpeg/lib @loader_path/../../.. \
./runtime/lib/python3.10/site-packages/torchcodec/libtorchcodec_custom_ops8.dylib

codesign --force --sign - \
./runtime/lib/python3.10/site-packages/torchcodec/libtorchcodec_custom_ops8.dylib

install_name_tool -rpath /opt/homebrew/opt/ffmpeg/lib @loader_path/../../.. \
./runtime/lib/python3.10/site-packages/torchcodec/libtorchcodec_pybind_ops8.so

codesign --force --sign - \
./runtime/lib/python3.10/site-packages/torchcodec/libtorchcodec_pybind_ops8.so

sudo /usr/bin/xattr -dr com.apple.quarantine "./runtime"

echo "创建启动脚本 go-webui.command..."

cat <<'EOF' >./go-webui.command
#!/bin/bash

if ! xcode-select -p &>/dev/null; then
    echo "安装Xcode Command Line Tools..."
    xcode-select --install
fi

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" &>/dev/null && pwd)"

cd "$SCRIPT_DIR"

export PATH="./runtime/bin:$PATH"

"./runtime/bin/python3" webui.py zh_CN

EOF

chmod +x ./go-webui.command

cat <<'EOF' >./update.command
#!/bin/bash

if ! xcode-select -p &>/dev/null; then
    echo "安装Xcode Command Line Tools..."
    xcode-select --install
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" &>/dev/null && pwd)"

cd "$SCRIPT_DIR"

git stash

git stash drop

git pull

export PATH="./runtime/bin:$PATH"

"./runtime/bin/python3" -m pip install torch torchcodec torchaudio -r "./requirements.txt" -i https://pypi.tuna.tsinghua.edu.cn/simple -U

install_name_tool -rpath /opt/homebrew/opt/ffmpeg/lib @loader_path/../../.. \
./runtime/lib/python3.10/site-packages/torchcodec/libtorchcodec_core8.dylib

codesign --force --sign - \
./runtime/lib/python3.10/site-packages/torchcodec/libtorchcodec_core8.dylib

install_name_tool -rpath /opt/homebrew/opt/ffmpeg/lib @loader_path/../../.. \
./runtime/lib/python3.10/site-packages/torchcodec/libtorchcodec_custom_ops8.dylib

codesign --force --sign - \
./runtime/lib/python3.10/site-packages/torchcodec/libtorchcodec_custom_ops8.dylib

install_name_tool -rpath /opt/homebrew/opt/ffmpeg/lib @loader_path/../../.. \
./runtime/lib/python3.10/site-packages/torchcodec/libtorchcodec_pybind_ops8.so

codesign --force --sign - \
./runtime/lib/python3.10/site-packages/torchcodec/libtorchcodec_pybind_ops8.so


EOF

chmod +x ./update.command

cat <<'EOF' >./go-api.command
#!/bin/bash

if ! xcode-select -p &>/dev/null; then
    echo "安装Xcode Command Line Tools..."
    xcode-select --install
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" &>/dev/null && pwd)"

cd "$SCRIPT_DIR"

export PATH="./runtime/bin:$PATH"

export DYLD_LIBRARY_PATH="./runtime/lib:$DYLD_LIBRARY_PATH"

"./runtime/bin/python3" api.py

EOF

chmod +x ./go-api.command

echo "部署完成,点击go-webui.command以打开,点击update.command以拉取更新,点击go-api.command以开启API"

rm -- "$0"
