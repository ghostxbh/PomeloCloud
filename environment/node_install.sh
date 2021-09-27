#!/bin/bash
PATH=/bin:/sbin:/usr/bin:/usr/sbin:/usr/local/bin:/usr/local/sbin:~/bin
export PATH
LANG=en_US.UTF-8

##############################################################################
# |                          Nodejs环境下载脚本                              | #
##############################################################################
# |                                                                        | #
# |    Copyright (c) 2021 柚子云(http://pomelo.work) All rights reserved.   | #
# |                                                                        | #
##############################################################################
# |                          author: ghostxbh                              | #
##############################################################################

cd ~
PANEL_ROOT_PATH=/web
LTS_VERSION=14.17.6
NODE_PATH=${PANEL_ROOT_PATH}/server/
NODE_BIN=${NODE_PATH}node_env/bin/node

DOWNLOAD_ADDR="https://nodejs.org/download/release/v${LTS_VERSION}/node-v${LTS_VERSION}-linux-x64.tar.gz"
DOWNLOAD_PATH=${NODE_PATH}

PACKAGE_NAME="node-v${LTS_VERSION}-linux-x64"
FILE_NAME="node-v${LTS_VERSION}-linux-x64.tar.gz"
EXPORT_NODE="/etc/profile.d/node.sh"  # system PATH file name for node.

if [ $(whoami) != "root" ];then
	echo "please execute script by root!"
	echo "请切换至root用户在执行安装！"
	exit 1
fi

checkPanelPath()
{
  if [ ! -f ${PANEL_ROOT_PATH} ]; then
    mkdir ${PANEL_ROOT_PATH}
    mkdir ${NODE_PATH}
    mkdir ${NODE_PATH}node_env
  fi
}

isReinstall="n"
# Check if node is already installed.
checkNodeIsExist()
{
  if [[ $(command echo node) == "node" ]]
  then
  	echo -n "The node command already exists,whether to reinstall [y/n]? :"
  	echo -n "node环境已存在，是否覆盖安装 [y/n]? :"
  	read isReinstall
    if [[ "${isReinstall}" == "y" ]] || [[ "{$isReinstall}" == "Y" ]]  # not reinstall
    then
      echo
    else
      exit 1
    fi
  fi
  echo "Check local node has been completed."
}

download()
{
    echo "Download version is $LTS_VERSION"
    echo "下载Nodejs版本为：$LTS_VERSION"

    local ret_code=`curl -I -s --connect-timeout 5 baidu.com -w %{http_code} | tail -n1`
    if [ "x$ret_code" = "x200" ]; then
        hasNetwork=1
    else
        hasNetwork=0
    fi

    if [ $hasNetwork -eq 0 ]
    then
        echo "The current device has no network connection！"
        echo "当前设备无网络连接！"
        exit 1
    fi

    wget $DOWNLOAD_ADDR

    if [ $? -ne "0" ]
    then
        echo "The node package download faild !"
        echo "下载失败 !"
        exit 1
    fi

    mv ./$FILE_NAME $DOWNLOAD_PATH
    echo "The node v${LTS_VERSION} has been downloaded."
}

decompress()
{
    cd ${DOWNLOAD_PATH}

    tar -zxf ${DOWNLOAD_PATH}${FILE_NAME}
    sleep 1
    cp -r ${DOWNLOAD_PATH}${PACKAGE_NAME}/* ${DOWNLOAD_PATH}node_env/

    rm -rf ${DOWNLOAD_PATH}${PACKAGE_NAME}
    rm -rf ${DOWNLOAD_PATH}${FILE_NAME}
    echo "The node package has been decompressed."
}

changePermission()
{
    chown ${currentUser}:${currentUser} ${NODE_BIN} -R
    echo "The node folder permission has been changed."
}

# Configure system environment variables and export executable paths of node and NPM.
configSysPath()
{
    local tempFile="node.sh"
    touch $tempFile
    echo 'export NODE_HOME=/web/server/node_env' > $tempFile
    echo 'export PATH=$PATH:$NODE_HOME/bin' >> $tempFile
    echo 'export NODE_PATH=$PATH:$NODE_HOME/lib/node_modules' >> $tempFile
    mv ./$tempFile $EXPORT_NODE
}

main()
{
    echo "------------------------开 始-------------------------"
    checkPanelPath
    checkNodeIsExist
    download
    decompress
    changePermission
    configSysPath

    source $EXPORT_NODE # Enable the configuration to take effect immediately.
    echo "------------------------结 束-------------------------"
    echo -e "已成功安装 node 和 npm.\n 测试安装: node -v 和 npm -v"
}

main
