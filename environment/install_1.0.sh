#!/bin/bash
PATH=/bin:/sbin:/usr/bin:/usr/sbin:/usr/local/bin:/usr/local/sbin:~/bin
export PATH

##############################################################################
# |                          PomeloCloud下载脚本                             | #
##############################################################################
# |                                                                        | #
# | Copyright (c) 2020-2021 柚子云(http://pomelo.work) All rights reserved. | #
# |                                                                        | #
##############################################################################
# |                          author: ghostxbh                              | #
##############################################################################
hasNetwork=0

#测试网络
function networkConnect()
{
    #超时时间
    local timeout=1

    #请求地址
    local target=github.com

    #获取响应状态码
    local ret_code=`curl -I -s --connect-timeout ${timeout} ${target} -w %{http_code} | tail -n1`

    if [ "x$ret_code" = "x200" ]; then
        #网络畅通
        hasNetwork=1
        return
    else
        #网络不畅通
        hasNetwork=0
        return
    fi
}

#下载项目
function projectDownload()
{
    # github下载地址
    local github=https://github.com/ghostxbh/PomeloCloud.git

    # gitee下载地址
    local gitee=https://gitee.com/ghostxbh/PomeloCloud.git

    networkConnect

    if [ hasNetwork=0 ]; then
        git clone $gitee
    else
        git clone $github
    fi
}

projectDownload
