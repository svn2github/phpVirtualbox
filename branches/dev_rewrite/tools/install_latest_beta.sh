#!/bin/bash

DEBIAN_RELEASE=$1;
ARCH=$2;

if [ "" == "$DEBIAN_RELEASE" ]; then
   echo "No DEBIAN_RELEASE specified."
   exit 1;
fi

if [ "" == "$ARCH" ]; then
   echo "No ARCH specified."
   exit 1;
fi

VBOX_DOWNLOAD_BASE_URL="http://download.virtualbox.org/virtualbox"

LATEST_BETA_VER=`wget -q ${VBOX_DOWNLOAD_BASE_URL}/LATEST-BETA.TXT -O -`
if [ "" == "${LATEST_BETA_VER}" ]; then
    echo "Could not determine latest beta version."
    exit 1;
fi

LATEST_BATA_VER_REGEX=`echo $LATEST_BETA_VER | sed -e 's/[^a-zA-Z0-9]/\./g'`

if [ "$(dpkg -l virtualbox* | grep '^ii ' | awk '{ print $3 }' | grep -i $LATEST_BATA_VER_REGEX)" != "" ];
then
    echo "VirtualBox is already latest beta version - $LATEST_BETA_VER"
    exit 0;
fi

DOWNLOAD_LIST_URL="${VBOX_DOWNLOAD_BASE_URL}/${LATEST_BETA_VER}"

PACKAGE=`wget -q $DOWNLOAD_LIST_URL -O - | grep Debian.$DEBIAN_RELEASE.$ARCH | sed -e 's/.*"\(.*\)".*/\1/'`

if [ "" == "${PACKAGE}" ]; then
    echo "Could not find package name using pattern Debian.$DEBIAN_RELEASE.$ARCH"
    exit 1;
fi

PACKAGE_DOWNLOAD_URL="${VBOX_DOWNLOAD_BASE_URL}/${LATEST_BETA_VER}/${PACKAGE}"

PACKAGE_FILE="/tmp/${PACKAGE}"

if [ -e "$PACKAGE_FILE" ]; then
   echo "${PACKAGE_FILE} already exists. Not continuing."
   exit 1;
fi

wget $PACKAGE_DOWNLOAD_URL -O $PACKAGE_FILE

if [ $? -ne 0 ]; then
   echo "Package download failed."
   exit $?;
fi

dpkg -i $PACKAGE_FILE

dpkg_status = $?

rm $PACKAGE_FILE

if [ dpkg_status -ne 0 ]; then
   echo "dpkg exited with non-zero status"
   exit $?;
fi

apt-get -y install -f

exit $?
