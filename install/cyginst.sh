easy_install python_gnupg Twisted DateUtils pyparsing jsonrpc
mkdir ~/mpagent
ln -s ~/mpagent mpag
cd mpag
git init
git remote add origin https://github.com/jurov/MPExAgent
git pull origin master
cd ..
mkdir ~/mpweb
ln -s ~/mpweb mpw
cd mpw
git init
git remote add origin https://github.com/prisonlab/mpexwebapp
git pull origin master
cd ..
mkdir ~/mpexagentwebapp
mkdir ~/mpexagentwebapp/static
mkdir ~/mpexagentwebapp/log
mv ~/mpweb/config.conf ~/mpexagentwebapp/static
mv ~/mpweb/index.html ~/mpexagentwebapp/static
mv ~/mpweb/jquery-1.11.0.min.js ~/mpexagentwebapp/static
mv ~/mpweb/pljs.js ~/mpexagentwebapp/static
mv ~/mpweb/plstyle.css ~/mpexagentwebapp/static
mv ~/mpweb/agent.py ~/mpexagentwebapp/
mv ~/mpweb/conf.ini ~/mpexagentwebapp/
mv ~/mpagent/mpex.py ~/mpexagentwebapp
mv ~/mpagent/pyparse.py ~/mpexagentwebapp
mv ~/mpagent/sample.py ~/mpexagentwebapp
rm mpw
rm mpag
rm -r -f ~/mpweb
rm -r -f ~/mpagent
