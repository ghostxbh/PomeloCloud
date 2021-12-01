#!/bin/bash
PATH=/bin:/sbin:/usr/bin:/usr/sbin:/usr/local/bin:/usr/local/sbin:~/bin
export PATH
LANG=en_US.UTF-8

##############################################################################
# |                          PomeloCloud安装脚本                            | #
##############################################################################
# |                                                                        | #
# |   Copyright (c) 2021 柚子云(http://pomelo.work) All rights reserved.    | #
# |                                                                        | #
##############################################################################
# |                          author: ghostxbh                              | #
##############################################################################


if [ $(whoami) != "root" ];then
	echo "请切换至root用户在执行安装！"
	exit 1
fi

cd ~
PANEL_ROOT_PATH=/web
NODE_BIN=$PANEL_ROOT_PATH/server/node_env/bin/node
PY_BIN=$PANEL_ROOT_PATH/server/py_env/bin/python

funcPackManager()
{
	if [ -f "/usr/bin/yum" ] && [ -d "/etc/yum.repos.d" ]; then
		PM="yum"
	elif [ -f "/usr/bin/apt-get" ] && [ -f "/usr/bin/dpkg" ]; then
		PM="apt-get"
	fi
}

funcSysInfo()
{
	if [ -s "/etc/redhat-release" ];then
		VERSION=$(cat /etc/redhat-release)
	elif [ -s "/etc/issue" ]; then
		VERSION=$(cat /etc/issue)
	fi

	if [ $(getconf WORD_BIT) = '32' ] && [ $(getconf LONG_BIT) = '64' ]; then
	  BIT=$(getconf LONG_BIT)
	else
	  BIT=$(getconf WORD_BIT)
	fi

	INFO=$(uname -a)
	MEM_TOTAL=$(free -h|grep Mem|awk '{print $2}')
	MEM_USED=$(free -h|grep Mem|awk '{print $3}')
	CPU_CORE=$(getconf _NPROCESSORS_ONLN)

	echo -e ${VERSION}
	echo -e Bit:${BIT} Mem:total-${MEM_TOTAL} used-${MEM_USED} Core:${CPU_CORE}
	echo -e ${INFO}
	echo -e "复制（截图）以上系统信息，到 gitee.com/ghostxbh/PomeloCloud/issues 获取帮助"
	echo '----------------------------------------------------'
}

funcError()
{
  echo '----------------------------------------------------'
  printf '\033[1;31;40m%b\033[0m\n' "$@";
	funcSysInfo
	exit 1;
}

funcAutoSwap()
{
  SWAP=$(free |grep Swap|awk '{print $2}')
  if [ "${SWAP}" -gt 1 ];then
		echo "Swap total sizse: $SWAP"
		return
	fi

	if [ ! -d $PANEL_ROOT_PATH ];then
		mkdir $PANEL_ROOT_PATH
	fi

	SWAP_PATH="$PANEL_ROOT_PATH/swap"
	dd if=/dev/zero of=$SWAP_PATH bs=1M count=1025
	mkswap -f $SWAP_PATH
	swapon $SWAP_PATH
	echo "$SWAP_PATH    swap    swap    defaults    0 0" >> /etc/fstab

	NEW_SWAP=`free |grep Swap|awk '{print $2}'`
	if [ $NEW_SWAP -gt 1 ];then
		echo "Swap total sizse: $NEW_SWAP";
		return
	fi

	sed -i "/\/$PANEL_ROOT_PATH\/swap/d" /etc/fstab
	rm -f $SWAP_PATH
}

funcLockClear()
{
	if [ -f "/etc/pomelo_crack.pl" ];then
		chattr -R -ia /web
		chattr -ia /etc/init.d/pomelo
		#\cp -rpa /web/backup/PomeloCloud/vhost/* /web/PomeloCloud/vhost/
		#mv /web/PomeloCloud/pomelo-cloud-PomeloCloud.bak /web/PomeloCloud/pomelo-cloud-PomeloCloud.js
		rm -f /etc/pomelo_crack.pl
	fi
}

funcInstallCheck()
{
	if [ "${INSTALL_FORCE}" ];then
		return
	fi
	echo -e "----------------------------------------------------"
	echo -e "检查已有其他mysql环境，可能影响现有站点及数据"
	echo -e "mysql service is alreday installed, May affect existing sites and data"
	echo -e "----------------------------------------------------"
	echo -e "已知风险>>Enter yes to force installation"
	read -p "输入yes强制安装: " yes;
	if [ "$yes" != "yes" ];then
		echo -e "------------"
		echo "取消安装"
		exit 1
	fi
	INSTALL_FORCE="true"
}

funcSysCheck()
{
	MYSQLD_CHECK=$(ps -ef |grep mysqld|grep -v grep|grep -v /www/server/mysql)
	NGINX_CHECK=$(ps -ef|grep nginx|grep master|grep -v /www/server/nginx)
	HTTPD_CHECK=$(ps -ef |grep -E 'httpd|apache'|grep -v /www/server/apache|grep -v grep)
	if [ [ "${MYSQLD_CHECK}" ] || [ "${NGINX_CHECK}" ] || [ "${HTTPD_CHECK}" ] ];then
		funcInstallCheck
	fi
}

funcDownloadProject()
{
    cd $PANEL_ROOT_PATH
    local github=https://github.com/ghostxbh/PomeloCloud.git
    local gitee=https://gitee.com/ghostxbh/PomeloCloud.git
    local ret_code=`curl -I -s --connect-timeout 5 ${gitee} -w %{http_code} | tail -n1`
    if [ "x$ret_code" = "x200" ]; then
        git clone $gitee
    else
        git clone $github
    fi
}

funcInstallRPM()
{
	yumPath=/etc/yum.conf
	Centos8Check=$(cat /etc/redhat-release | grep ' 8.' | grep -iE 'centos|Red Hat')
	isExc=$(cat $yumPath|grep httpd)
	if [ "$isExc" = "" ];then
		echo "exclude=httpd nginx php mysql mairadb node python-psutil python2-psutil" >> $yumPath
	fi

	#尝试同步时间(从bt.cn)
	echo 'Synchronizing system time...'
	getBtTime=$(curl -sS --connect-timeout 3 -m 60 http://www.bt.cn/api/index/get_time)
	if [ "${getBtTime}" ];then
		date -s "$(date -d @$getBtTime +"%Y-%m-%d %H:%M:%S")"
	fi

	if [ -z "${Centos8Check}" ]; then
		yum install ntp -y
		rm -rf /etc/localtime
		ln -s /usr/share/zoneinfo/Asia/Shanghai /etc/localtime

		#尝试同步国际时间(从ntp服务器)
		ntpdate 0.asia.pool.ntp.org
		setenforce 0
	fi

	startTime=`date +%s`

	sed -i 's/SELINUX=enforcing/SELINUX=disabled/' /etc/selinux/config
	#yum remove -y python-requests python3-requests python-greenlet python3-greenlet
	yumPacks="libcurl-devel wget tar gcc make zip unzip openssl openssl-devel gcc libxml2 libxml2-devel libxslt* zlib zlib-devel libjpeg-devel libpng-devel libwebp libwebp-devel freetype freetype-devel lsof pcre pcre-devel vixie-cron crontabs icu libicu-devel c-ares libffi-devel bzip2-devel ncurses-devel sqlite-devel readline-devel tk-devel gdbm-devel db4-devel libpcap-devel xz-devel"
	yum install -y ${yumPacks}

	for yumPack in ${yumPacks}
	do
		rpmPack=$(rpm -q ${yumPack})
		packCheck=$(echo ${rpmPack}|grep not)
		if [ "${packCheck}" ]; then
			yum install ${yumPack} -y
		fi
	done
	if [ -f "/usr/bin/dnf" ]; then
		dnf install -y redhat-rpm-config
	fi

	ALI_OS=$(cat /etc/redhat-release |grep "Alibaba Cloud Linux release 3")
	if [ -z "${ALI_OS}" ];then
		yum install epel-release -y
	fi
}

funcInstallDeb()
{
	ln -sf bash /bin/sh
	apt-get update -y
	apt-get install ruby -y
	apt-get install lsb-release -y
	#apt-get install ntp ntpdate -y
	#/etc/init.d/ntp stop
	#update-rc.d ntp remove
	#cat >>~/.profile<<EOF
	#TZ='Asia/Shanghai'; export TZ
	#EOF
	#rm -rf /etc/localtime
	#cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime
	#echo 'Synchronizing system time...'
	#ntpdate 0.asia.pool.ntp.org
	#apt-get upgrade -y
	debPacks="wget curl libcurl4-openssl-dev gcc make zip unzip tar openssl libssl-dev gcc libxml2 libxml2-dev zlib1g zlib1g-dev libjpeg-dev libpng-dev lsof libpcre3 libpcre3-dev cron net-tools swig build-essential libffi-dev libbz2-dev libncurses-dev libsqlite3-dev libreadline-dev tk-dev libgdbm-dev libdb-dev libdb++-dev libpcap-dev xz-utils git";
	apt-get install -y $debPacks --force-yes

	for debPack in ${debPacks}
	do
		packCheck=$(dpkg -l ${debPack})
		if [ "$?" -ne "0" ] ;then
			apt-get install -y debPack
		fi
	done

	if [ ! -d '/etc/letsencrypt' ];then
		mkdir -p /etc/letsencryp
		mkdir -p /var/spool/cron
		if [ ! -f '/var/spool/cron/crontabs/root' ];then
			echo '' > /var/spool/cron/crontabs/root
			chmod 600 /var/spool/cron/crontabs/root
		fi
	fi
}

funcInstallPomelo()
{
	clientPort="9080"
	serverPort="9090"
	if [ -f ${PANEL_ROOT_PATH}/PomeloCloud/config/client-port.pl ];then
		clientPort=$(cat ${PANEL_ROOT_PATH}/PomeloCloud/config/client-port.pl)
	fi

	if [ -f ${PANEL_ROOT_PATH}/PomeloCloud/config/server-port.pl ];then
		serverPort=$(cat ${PANEL_ROOT_PATH}/PomeloCloud/config/server-port.pl)
	fi

	mkdir -p ${PANEL_ROOT_PATH}/logs
	mkdir -p ${PANEL_ROOT_PATH}/backup/database
	mkdir -p ${PANEL_ROOT_PATH}/backup/site

	if [ -f "/etc/init.d/pomelo" ]; then
		/etc/init.d/pomelo stop
		sleep 1
	fi

	cp -f ${PANEL_ROOT_PATH}/PomeloCloud/environment/pomelo.init /etc/init.d/pomelo

#	if [ -f "${PANEL_ROOT_PATH}/PomeloCloud/config/default.db" ];then
#		if [ -d "/${PANEL_ROOT_PATH}/PomeloCloud/old_data" ];then
#			rm -rf ${PANEL_ROOT_PATH}/PomeloCloud/old_data
#		fi
#		mkdir -p ${PANEL_ROOT_PATH}/PomeloCloud/old_data
#		d_format=$(date +"%Y%m%d_%H%M%S")
#		\cp -arf ${PANEL_ROOT_PATH}/PomeloCloud/data/default.db ${PANEL_ROOT_PATH}/PomeloCloud/data/default_backup_${d_format}.db
#		mv -f ${PANEL_ROOT_PATH}/PomeloCloud/data/default.db ${PANEL_ROOT_PATH}/PomeloCloud/old_data/default.db
#		mv -f ${PANEL_ROOT_PATH}/PomeloCloud/data/system.db ${PANEL_ROOT_PATH}/PomeloCloud/old_data/system.db
#		mv -f ${PANEL_ROOT_PATH}/PomeloCloud/data/port.pl ${PANEL_ROOT_PATH}/PomeloCloud/old_data/port.pl
#		mv -f ${PANEL_ROOT_PATH}/PomeloCloud/data/admin_path.pl ${PANEL_ROOT_PATH}/PomeloCloud/old_data/admin_path.pl
#	fi

	if [ ! -f "/usr/bin/unzip" ]; then
		if [ "${PM}" = "yum" ]; then
			yum install unzip -y
		elif [ "${PM}" = "apt-get" ]; then
			apt-get install unzip -y
		fi
	fi

#	if [ -d "${PANEL_ROOT_PATH}/PomeloCloud/old_data" ];then
#		mv -f ${PANEL_ROOT_PATH}/PomeloCloud/old_data/default.db ${PANEL_ROOT_PATH}/PomeloCloud/data/default.db
#		mv -f ${PANEL_ROOT_PATH}/PomeloCloud/old_data/system.db ${PANEL_ROOT_PATH}/PomeloCloud/data/system.db
#		mv -f ${PANEL_ROOT_PATH}/PomeloCloud/old_data/port.pl ${PANEL_ROOT_PATH}/PomeloCloud/data/port.pl
#		mv -f ${PANEL_ROOT_PATH}/PomeloCloud/old_data/admin_path.pl ${PANEL_ROOT_PATH}/PomeloCloud/data/admin_path.pl
#		if [ -d "/${PANEL_ROOT_PATH}/PomeloCloud/old_data" ];then
#			rm -rf ${PANEL_ROOT_PATH}/PomeloCloud/old_data
#		fi
#	fi

	if [ ! -f ${PANEL_ROOT_PATH}/PomeloCloud/pomelo-cloud-vue ] || [ ! -f ${PANEL_ROOT_PATH}/PomeloCloud/pomelo-cloud-server ];then
		funcError "ERROR: Failed to download!"
	fi

	chmod +x /etc/init.d/pomelo
	chmod -R 600 ${PANEL_ROOT_PATH}/PomeloCloud
	chmod -R +x ${PANEL_ROOT_PATH}/PomeloCloud/scripts
	ln -sf /etc/init.d/pomelo /usr/bin/pomelo

#	echo "${clientPort}" > ${PANEL_ROOT_PATH}/PomeloCloud/config/client-port.pl
#	echo "${serverPort}" > ${PANEL_ROOT_PATH}/PomeloCloud/config/server-port.pl
}

funcServiceAdd()
{
	if [ "${PM}" == "yum" ] || [ "${PM}" == "dnf" ]; then
		chkconfig --add pomelo
		chkconfig --level 2345 pomelo on
	elif [ "${PM}" == "apt-get" ]; then
		update-rc.d pomelo defaults
	fi
}

funcSetPomeloCloud()
{
	password=$(cat /dev/urandom | head -n 16 | md5sum | head -c 10)
	sleep 1
	admin_auth="/web/PomeloCloud/config/admin_verify.pl"

	if [ ! -f ${admin_auth} ];then
		auth_path=$(cat /dev/urandom | head -n 16 | md5sum | head -c 8)
		echo "/${auth_path}" > ${admin_auth}
	fi

	auth_path=$(cat ${admin_auth})
	cd ${PANEL_ROOT_PATH}/PomeloCloud/
	/etc/init.d/pomelo start

	username=$(cat /dev/urandom | head -n 16 | md5sum | head -c 10)

	cd ~
	echo "${username}" > ${PANEL_ROOT_PATH}/PomeloCloud/config/username.pl
	echo "${password}" > ${PANEL_ROOT_PATH}/PomeloCloud/config/password.pl

	chmod 600 ${PANEL_ROOT_PATH}/PomeloCloud/config/username.pl
	chmod 600 ${PANEL_ROOT_PATH}/PomeloCloud/config/password.pl
	sleep 3
	/etc/init.d/pomelo restart
	sleep 3

	isStart=$(ps aux |grep 'PomeloCloud'|grep -v grep|awk '{print $2}')
	LOCAL_CURL=$(curl 127.0.0.1:9080/login 2>&1 |grep -i html)
	if [ -z "${isStart}" ] && [ -z "${LOCAL_CURL}" ];then
		/etc/init.d/pomelo 22
		cd /web/PomeloCloud/node_env/bin
		touch t.pl
		Red_Error "ERROR: The service startup failed." "ERROR: 启动失败"
	fi
}

funcSetFirewall()
{
	sshPort=$(cat /etc/ssh/sshd_config | grep 'Port '|awk '{print $2}')
	if [ "${PM}" = "apt-get" ]; then
		apt-get install -y ufw
		if [ -f "/usr/sbin/ufw" ];then
			ufw allow 20/tcp
			ufw allow 21/tcp
			ufw allow 22/tcp
			ufw allow 80/tcp
			ufw allow 443/tcp
			ufw allow ${serverPort}/tcp
			ufw allow ${sshPort}/tcp
			ufw allow 17000:18000/tcp
			ufw_status=`ufw status`
			echo y|ufw enable
			ufw default deny
			ufw reload
		fi
	else
		if [ -f "/etc/init.d/iptables" ];then
			iptables -I INPUT -p tcp -m state --state NEW -m tcp --dport 20 -j ACCEPT
			iptables -I INPUT -p tcp -m state --state NEW -m tcp --dport 21 -j ACCEPT
			iptables -I INPUT -p tcp -m state --state NEW -m tcp --dport 22 -j ACCEPT
			iptables -I INPUT -p tcp -m state --state NEW -m tcp --dport 80 -j ACCEPT
			iptables -I INPUT -p tcp -m state --state NEW -m tcp --dport ${serverPort} -j ACCEPT
			iptables -I INPUT -p tcp -m state --state NEW -m tcp --dport ${sshPort} -j ACCEPT
			iptables -I INPUT -p tcp -m state --state NEW -m tcp --dport 17000:18000 -j ACCEPT
			iptables -A INPUT -p icmp --icmp-type any -j ACCEPT
			iptables -A INPUT -s localhost -d localhost -j ACCEPT
			iptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT
			iptables -P INPUT DROP
			service iptables save
			sed -i "s#IPTABLES_MODULES=\"\"#IPTABLES_MODULES=\"ip_conntrack_netbios_ns ip_conntrack_ftp ip_nat_ftp\"#" /etc/sysconfig/iptables-config
			iptables_status=$(service iptables status | grep 'not running')
			if [ "${iptables_status}" == '' ];then
				service iptables restart
			fi
		else
			AliyunCheck=$(cat /etc/redhat-release|grep "Aliyun Linux")
			[ "${AliyunCheck}" ] && return
			yum install firewalld -y
			[ "${Centos8Check}" ] && yum reinstall python3-six -y
			systemctl enable firewalld
			systemctl start firewalld
			firewall-cmd --set-default-zone=public > /dev/null 2>&1
			firewall-cmd --permanent --zone=public --add-port=20/tcp > /dev/null 2>&1
			firewall-cmd --permanent --zone=public --add-port=21/tcp > /dev/null 2>&1
			firewall-cmd --permanent --zone=public --add-port=22/tcp > /dev/null 2>&1
			firewall-cmd --permanent --zone=public --add-port=80/tcp > /dev/null 2>&1
			firewall-cmd --permanent --zone=public --add-port=${serverPort}/tcp > /dev/null 2>&1
			firewall-cmd --permanent --zone=public --add-port=${sshPort}/tcp > /dev/null 2>&1
			firewall-cmd --permanent --zone=public --add-port=17000-18000/tcp > /dev/null 2>&1
			firewall-cmd --reload
		fi
	fi
}

funcInstallNode()
{
  bash ${PANEL_ROOT_PATH}/PomeloCloud/environment/node_install.sh
  sleep 2
}

funcIp()
{
  LOCAL_IP = $(ifconfig eth0 | grep inet | grep -v inet6 | awk '{print $2}' | tr -d "addr:")
}

main()
{
  startTime=`date +%s`

  funcLockClear
  funcSysCheck
  funcPackManager
  funcDownloadProject

  MEM_TOTAL=$(free -g|grep Mem|awk '{print $2}')
	if [ "${MEM_TOTAL}" -le "1" ];then
		funcAutoSwap
	fi

	if [ "${PM}" = "yum" ]; then
		funcInstallRPM
	elif [ "${PM}" = "apt-get" ]; then
		funcInstallDeb
	fi

  funcInstallNode
	funcInstallPomelo
	funcSetPomeloCloud
	funcServiceAdd
	funcSetFirewall

	funcIp
}

echo "
##############################################################################
# |                          PomeloCloud安装脚本                            | #
##############################################################################
# |                                                                        | #
# |   Copyright (c) 2021 柚子云(http://pomelo.work) All rights reserved.    | #
# |                                                                        | #
##############################################################################
# |                          author: ghostxbh                              | #
##############################################################################
"
while [ "$go" != 'y' ] && [ "$go" != 'n' ]
do
	read -p "Do you want to install PomeloCloud to the $PANEL_ROOT_PATH directory now?(y/n): " go;
done

if [ "$go" == 'n' ];then
	exit;
fi

main
echo > /web/PomeloCloud/config/bind.pl
echo -e "####################################################"
echo -e "\033[32m安装成功!\033[0m"
echo -e "####################################################"
echo  "面板地址: http://${LOCAL_IP}:${clientPort}${auth_path}"
echo  "接口地址: http://${LOCAL_IP}:${serverPort}${auth_path}"
echo -e "用户名: $username"
echo -e "密  码: $password"
echo -e "####################################################"

endTime=`date +%s`
((outTime=($endTime-$startTime)/60))
echo -e "消耗时间:\033[32m $outTime \033[0m 分钟!"








