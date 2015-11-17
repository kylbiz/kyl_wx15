from fabric.api import *
from datetime import datetime

env.user = 'root'
env.sudo_user = 'root'
env.password = 'kyl123KYL'
env.hosts = ['101.200.217.6']

_TAR_FILE = 'kyl-wechat.tar.gz'
_REMOTE_TMP_TAR = '/tmp/%s' % _TAR_FILE
_REMOTE_BASE_DIR = '/proj/'
_PROJ_NAME = 'kylwechat'
_PROJ_DIR = _REMOTE_BASE_DIR + _PROJ_NAME


def deploy():
    local('meteor build .')

    newdir = 'kylwechat-%s' % datetime.now().strftime('%y-%m-%d_%H.%M.%S')
    run('rm -f %s' % _REMOTE_TMP_TAR)
    put(_TAR_FILE, _REMOTE_TMP_TAR)

    with cd(_REMOTE_BASE_DIR):
        sudo('mkdir %s' % newdir)

    with cd('%s/%s' % (_REMOTE_BASE_DIR, newdir)):
        sudo('tar -xzvf %s' % _REMOTE_TMP_TAR)

    with cd(_REMOTE_BASE_DIR):
        sudo('rm -f ' + _PROJ_NAME)
        sudo('ln -s ' + newdir + ' ' + _PROJ_NAME)


    # /proj/bundle/programs/server/npm/npm-bcrypt/node_modules/bcrypt
    with cd(_PROJ_DIR + '/bundle/programs/server'):
    	run('npm install')

    run('rm -rf ' + _PROJ_DIR + '/bundle/programs/server/npm/npm-bcrypt/node_modules/bcrypt')
    with cd(_PROJ_DIR + '/bundle/programs/server/npm/npm-bcrypt/'):
    	run('npm install bcrypt')

    with cd(_PROJ_DIR + '/bundle'):
    	# run('pm2 delete ' + _PROJ_NAME)
        
        sudo("export MONGO_URL='mongodb://127.0.0.1:27017/keywechat' ")
        sudo("export ROOT_URL='http://101.200.217.6' ")
        sudo("export PORT=80")
    	# sudo('pm2 start main.js --name ' + _PROJ_NAME)
