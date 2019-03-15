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
  ensure_active(){ cmd="$1"; eval "$cmd"; echo "$cmd" >> $configfile && echo "$cmd" ;}

  if ! [[ $(command -v brew) ]]; then
    if [[ $OSTYPE != *darwin* ]]; then #on linux
      sh -c "$(curl -fsSL https://raw.githubusercontent.com/Linuxbrew/install/master/install.sh)"
    else # on mac
      /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
    fi
  fi

  # git
  ! [[ $(command -v git) ]] && brew install git

  # git configuration for push/pull
  ginfo=$(git status -sb | head -n1) # outputs ## <branchname>...origin/master [ahead 3]
  [[ $ginfo != *origin/master* ]] && git branch --set-upstream-to origin/master # ensure git always pulls from origin master on this branch
  [[ $ginfo = *behind* ]] && echo "WARNING: git pull needed, then re-run this script" && exit 1

  # nvm
  ! [[ $(brew --prefix nvm) ]] && brew install nvm
  nvmdir=$(brew --prefix nvm)
  [[ "$cfg" != *'export NVM_DIR='* ]] && ensure_active "export NVM_DIR='$HOME/.nvm'"
  [[ "$cfg" != *"$nvmdir/nvm.sh"* ]] && echo "[ -s '$nvmdir/nvm.sh' ] && . '$nvmdir/nvm.sh';  # This loads nvm" >> $configfile
  [ -s '$nvmdir/nvm.sh' ] && . '$nvmdir/nvm.sh';  # This loads nvm"
  [[ "$cfg" != *$nvmdir/etc/bash_completion* ]] && ensure_active "[ -s '$nvmdir/etc/bash_completion' ] && . '$nvmdir/etc/bash_completion';  # This loads nvm bash_completion"
  [[ "$cfg" != *'export PATH="$(nvm which current)'* ]] && ensure_active '[[ "$PATH" != *"/node/"* ]] && export PATH="$(nvm which current):$PATH"'
  ! [[ $(command -v node) ]] && nvm install lts/* --reinstall-packages-from=node && nvm use --silent lts/* && nvm alias default lts/*

  # yarn
  ! [[ $(command -v yarn) ]] && brew install yarn --ignore-dependencies

  # create-react-app
  ! [[ $(command -v create-react-app) ]] && yarn global add create-react-app

  # pyenv
  ! [[ $(command -v pyenv) ]] &&  brew install pyenv

  # set global pyenv default
  ! [[ $(pyenv global) ]] && pyenv install 3.7.2 && pyenv global 3.7.2
  [[ "$cfg" != *'PYENV_ROOT'* ]] && ensure_active "export PYENV_ROOT='$(pyenv root)'"

  # pipenv
  ! [[ $(brew list pipenv) ]] && brew install pipenv
  [[ "$cfg" != *'PIPENV_CACHE_DIR'* ]] && ensure_active "export PIPENV_CACHE_DIR='$HOME/.pipenv/.packages/'"
  [[ "$cfg" != *'WORKON_HOME'* ]] && ensure_active "export WORKON_HOME='$HOME/.pipenv/.venvs/'"
  [[ "$cfg" != *'export PATH="$PYENV_ROOT:'* ]] && ensure_active "[[ \"\$PATH\" != *\"\$PYENV_ROOT\"* ]] && export PATH=\"\$PYENV_ROOT:\$PATH\""

  # ensure latest web dependencies installed
  builtin cd src/web
  yarn install
  builtin cd -

  # ensure latest py dependencies installed
  pipenv install --dev --skip-lock
  pipenv shell
fi
