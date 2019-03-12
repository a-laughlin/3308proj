#!/bin/bash

if [[ $SHELL != *bash ]]; then
  echo Bash shell required for installation.
elif ! [[ -f "./setup.sh" ]]; then
  echo Must be in project root directory before running script
else
  configfile="~/.bashrc"
  [[ $OSTYPE = *darwin* ]] && configfile="~/.bash_profile"

  if ! [[ $(command -v brew) ]]; then
    if [[ $OSTYPE != *darwin* ]]; then #on linux
      sh -c "$(curl -fsSL https://raw.githubusercontent.com/Linuxbrew/install/master/install.sh)"
    else # on mac
      /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
    fi
  fi

  if ! [[ $(command -v git) ]]; then
    brew install git
  fi

  ginfo=$(git status -sb | head -n1) # outputs ## <branchname>...origin/master [ahead 3]

  # ensure git always pulls from origin master on this branch
  [[ $ginfo != *origin/master* ]] && git branch --set-upstream-to origin/master

  # ensure branch up to date
  [[ $ginfo = *behind* ]] && echo "WARNING: git pull origin master needed, then re-run this script" && exit 1

  # set up nvm if it isn't in the path
  if [[ $PATH != *$HOME/.nvm/* ]]; then
    # bash scripts can't run another script without permissions, so check if the file exists
    if ! [[ -f $NVM_DIR/nvm.sh ]]; then
      brew install nvm
    fi

    echo 'export NVM_DIR="$HOME/.nvm"' >> $configfile
    echo '[ -s "/usr/local/opt/nvm/nvm.sh" ] && . "/usr/local/opt/nvm/nvm.sh"  # This loads nvm'  >> $configfile
    echo '[ -s "/usr/local/opt/nvm/etc/bash_completion" ] && . "/usr/local/opt/nvm/etc/bash_completion"  # This loads nvm bash_completion'  >> $configfile
    source $configfile

    if ! [[ $(command -v node) ]]; then
      nvm install node
      nvm use node
    fi
  fi

  if ! [[ $(command -v yarn) ]]; then
    brew install yarn --ignore-dependencies
    yarn config set prefix ~/.yarn
  fi

  if ! [[ $(command -v create-react-app) ]]; then
    yarn global add create-react-app
  fi

  #
  # if ! [[ $(command -v expo) ]]; then
  #   yarn global add expo-cli
  # fi
  #
  # # ensure latest mobile dependencies installed
  # cd src/mobile
  # yarn install
  # cd -

  if ! [[ $(command -v pipenv) ]]; then
    echo "WARNING: Pipenv not installed. Please install pyenv and pipenv to run the pipenv virtual environment"
  else
    if ! [[ $PIPENV_ACTIVE ]]; then
      pipenv install --skip-lock
      pipenv shell
    fi
  fi
fi
