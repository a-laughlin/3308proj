#!/bin/bash

if [[ $SHELL != *bash ]]; then
  echo Bash shell required for installation.
elif [[ $PIPENV_ACTIVE = 1 ]]; then
  echo Script not meant to be run in a pipenv virtual environment
elif ! [[ -f "./setup.sh" ]]; then
  echo Must be in project root directory before running script
else
  configfile="$HOME/.bashrc"
  cfg="$(cat $configfile)"
  ensure_alias(){
    cmd="alias $1='${@:2}';";
    ! [[ $(command -v $1 ) ]] && eval "$cmd" || (echo "$cmd didn't work... exiting" && exit 1);
    [[ "$cfg" != *"alias $1="* ]] && echo "$cmd" >> $configfile;
  }
  ensure_config_comment(){ [[ "$cfg" != *"$*"* ]] && printf "\n\n# $*\n" >> $configfile; }



  if ! [[ $(command -v brew) ]]; then
    if [[ $OSTYPE != *darwin* ]]; then #on linux
      sh -c "$(curl -fsSL https://raw.githubusercontent.com/Linuxbrew/install/master/install.sh)"
    else # on mac
      /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
    fi
  fi
  ! [[ $(command -v brew) ]] && echo "ERROR installing brew" && exit 1;


  # git
  ! [[ $(command -v git) ]] && brew install git
  ! [[ $(command -v git) ]] && echo "ERROR installing git" && exit 1;


  # git configuration for push/pull
  ginfo=$(git status -sb | head -n1) # outputs ## <branchname>...origin/master [ahead 3]
  [[ $ginfo = *"master..."* ]] && echo "WARNING: on master branch - create a new branch like 'git checkout -b $USER' and re-run this script" && exit 1;
  [[ $ginfo = *"behind"* ]] && echo "WARNING: git pull needed, then re-run this script" && exit 1
  [[ $ginfo != *"origin/master"* ]] && git branch --set-upstream-to origin/master; # ensure git always pulls from origin master on this branch
  [[ $( git config push.default ) != current ]] && git config push.default current;


  # nvm
  ensure_config_comment '3308 Project Exports'
  ! [[ $(brew --prefix nvm) ]] && brew install nvm;
  ! [[ $(brew --prefix nvm) ]] && echo "ERROR installing nvm (1)" && exit 1;
  [[ $NVM_DIR ]] && [[ "$NVM_DIR" != "$HOME/.nvm" ]] && echo "ERROR conflicting NVM_DIR... Remove it wherever it's defined." && exit 1;
  export NVM_DIR="$HOME/.nvm";
  nvm_scripts_dir="$(brew --prefix nvm)";
  nvm_shell="$nvm_scripts_dir/nvm.sh";
  nvm_bash_completion="$nvm_scripts_dir/etc/bash_completion";
  [ -s "$nvm_bash_completion" ] || nvm_bash_completion="$nvm_bash_completion.d/nvm";
  . $nvm_shell;
  . $nvm_bash_completion;
  ! [[ $(command -v nvm) ]] && echo "ERROR running nvm didn't make it usable from script" && exit 1;
  [[ "$cfg" != *"export NVM_DIR='$NVM_DIR';"* ]] && echo "export NVM_DIR='$NVM_DIR';" >> $configfile;
  [[ "$cfg" != *"$nvm_shell"* ]] && echo "[ -s '$nvm_shell' ] && . '$nvm_shell';  # This loads nvm" >> $configfile;
  [[ "$cfg" != *"$nvm_bash_completion"* ]] && echo "[ -s '$nvm_bash_completion' ] && . '$nvm_bash_completion';  # This loads nvm bash_completion" >> $configfile;
  # node
  ! [[ $(nvm which lts/*) ]] && nvm install lts/*;
  ! [[ $(nvm which lts/*) ]] && echo "ERROR on nvm install lts/*" && exit 1;
  nvm use --silent lts/*;
  nodebinpath="$(nvm which current | sed -E 's/\/node$//')";
  [[ "$PATH" != *"$nodebinpath"* ]] && export PATH="$nodebinpath:$PATH";
  ! [[ $(command -v node) ]] && echo "ERROR installing node" && exit 1;

  # yarn
  ! [[ $(command -v yarn) ]] && brew install yarn --ignore-dependencies; # ignoring avoids reinstalling node
  ! [[ $(command -v yarn) ]] && echo "ERROR installing yarn" && exit 1;

  # create-react-app
  ! [[ $(command -v create-react-app) ]] && yarn global add create-react-app
  ! [[ $(command -v create-react-app) ]] && echo "ERROR installing create-react-app" && exit 1;


  # # commenting pyenv and pipenv out since they'll break Brian's setup
  # pyenv
  # ! [[ $(command -v pyenv) ]] &&  brew install pyenv
  # ! [[ $(command -v pyenv) ]] &&  echo "ERROR installing pyenv" && exit 1;
  # export PYENV_ROOT=$(pyenv root)
  # [[ $(pyenv versions) != *'3.7.2'* ]] && pyenv install 3.7.2
  # [[ $(pyenv versions) != *'3.7.2'* ]] && echo "ERROR installing python 3.7.2 with pyenv" && exit 1;
  # ! [[ $(pyenv global) != '3.7.2' ]] && pyenv global 3.7.2
  # ! [[ $(pyenv global) ]] && echo "ERROR setting pyenv global" && exit 1;
  # [[ "$PATH" != *"$PYENV_ROOT"* ]] && export PATH="$PYENV_ROOT:$PATH";
  # [[ "$cfg" != *"$PYENV_ROOT"* ]] && echo "export PYENV_ROOT='$PYENV_ROOT';" >> $configfile;
  # [[ "$cfg" != *'[[ "$PATH" != *"$PYENV_ROOT"* ]] && export PATH="$PYENV_ROOT:$PATH";'* ]] && echo '[[ "$PATH" != *"$PYENV_ROOT"* ]] && export PATH="$PYENV_ROOT:$PATH";' >> $configfile;
  #
  #
  # pipenv
  # export PIPENV_CACHE_DIR="$HOME/.pipenv/.packages/"
  # export WORKON_HOME="$HOME/.pipenv/.venvs/"
  # [[ "$cfg" != *'PIPENV_CACHE_DIR'* ]] && echo "export PIPENV_CACHE_DIR='$PIPENV_CACHE_DIR';" >> $configfile;
  # [[ "$cfg" != *'WORKON_HOME'* ]] && echo "export WORKON_HOME='$WORKON_HOME';" >> $configfile;
  # ! [[ $(brew --prefix pipenv) ]] && brew install pipenv
  # ! [[ $(command -v pipenv) ]] && echo "ERROR installing pipenv" && exit 1


  # add check that it isnt master branch
  # set up some aliases


  # project aliases
  ensure_config_comment '3308 Project Aliases';
  ensure_alias 'pdir' "builtin cd \"$PWD\"";
  ensure_alias 'pgo' 'pdir && ./setup.sh';
  ensure_alias 'pstop' '[[ $PIPENV_ACTIVE = 1 ]] && exit 0';
  ensure_alias 'ptest' 'pdir && ./build.py test';
  ensure_alias 'ppull' 'pdir && git pull';
  # pull | run tests | push | sed (get new pull request url) | open url in browser
  ensure_alias 'ppush' 'pdir && [[ "$(git pull)" = "Already up to date." ]] && (./build.py test all) && git push && open "https://github.com/a-laughlin/3308proj/pull/new/$(git rev-parse --abbrev-ref HEAD)"';

  ensure_config_comment '3308 Project ML Aliases';
  ensure_alias 'pml' "builtin cd \"$PWD/src/ml\"";
  ensure_alias 'pmtest' "pdir \"$PWD/src/ml\"";

  # api aliases
  ensure_config_comment '3308 Project API Aliases';
  ensure_alias 'papi' "builtin cd \"$PWD/src/api\"";
  ensure_alias 'pago' "(papi && node ./api.js)";

  # web aliases
  ensure_config_comment '3308 Project Web Aliases';
  ensure_alias 'pweb' "builtin cd \"$PWD/src/web/src\"";
  ensure_alias 'pwgo' '(pweb && yarn start)';
  ensure_alias 'pwtest' 'pweb && yarn test';

  ensure_config_comment '3308 Project API+Web Aliases';
  ensure_alias 'pawgo' '(trap "kill 0" SIGINT; pwgo & pago)';


  # installations
  builtin cd src/web
  yarn install || (echo "ERROR installing yarn" && exit 1);
  builtin cd -

  builtin cd src/api
  yarn install || (echo "ERROR installing yarn" && exit 1);
  builtin cd -


  pipenv install --dev --skip-lock
  pipenv shell
  exit 0
fi
