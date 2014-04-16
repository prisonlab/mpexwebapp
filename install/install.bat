echo Mpex Agent and Web Application Front End Installer
setup-x86.exe -q -P gnupg,python,git,python-setuptools,gcc-core,openssl,python-openssl -R c:\cygwin -l c:\install_files_cygwin
PATH=c:\cygwin\bin
dos2unix cyginst.sh
bash cyginst.sh
