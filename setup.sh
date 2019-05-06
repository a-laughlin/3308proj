#!/bin/bash
if [[ $SHELL != *bash ]];then
  echo "NEXT STEP! Bash shell required for installation.  Install or start bash";
  echo "           then re-run '. setup.sh'";
elif [[ ! -f "./setup.sh" ]]; then
  echo "NEXT STEP! Switch to project root directory";
  echo "           then re-run '. setup.sh'";
elif [[ ! $(command -v yarn) ]]; then
  # yarn installs the latest version of nodejs. We use nvm and node 10.15.3, but any version after that should work
  echo "NEXT STEP! install yarn (https://yarnpkg.com/lang/en/docs/install/), then re-run '. setup.sh'";
  echo "           then re-run '. setup.sh'";
elif [[ $(python3 --version) != *3.7.* ]]; then
  # ensure correct python version.  Recommend running in a python virtual environment
  echo "NEXT STEP! ensure python3 points to a version of python 3.7.x";
  echo "           then re-run '. setup.sh'";
  # install root dependencies
else
  # install torch ml dependencies
  function install_torch(){
    if [[ $((python3 -c "import torch") 2>&1 | xargs echo) ]]; then # torch not installed
      pip3 install numpy
      if [ "$(uname)" == "Darwin" ]; then #mac
        pip3 install --progress-bar off -- torch
      else #linux (no one is using windows on proj)
        # use smaller cpu-only pytorch version (gpu support adds 520mb!)
        # per https://github.com/pytorch/pytorch/issues/4178#issuecomment-356709106
        # note, using pip3 to intall torch, even in pipenv, since pipenv had issues installing wheels directly
        pip3 install https://download.pytorch.org/whl/cpu/torch-1.0.1.post2-cp37-cp37m-linux_x86_64.whl;
      fi
    else
      echo "torch already installed";
    fi
  }

  # install root dependencies
  yarn;
  # install API dependencies
  builtin cd src/api && yarn && builtin cd -;
  # install web ui dependencies
  builtin cd src/web && yarn && builtin cd -;


  if [[ $CI ]]; then # continuous integration server
    echo "running on travis"
    install_torch
  elif [[ $DYNO ]]; then # heroku
    echo "running on heroku";
    install_torch
    cd src/web && yarn build && cd -;
  else #dev
    # git configuration for developer project flow
    branchName=$(git rev-parse --abbrev-ref HEAD)
    ginfo=$(git status -sb | head -n1) # outputs ## <branchname>...origin/master [ahead 3]
    [[ $branchName = "master" ]] && echo "WARNING: on master branch - create a new branch like 'git checkout -b $USER' and re-run this script" && exit 1;
    [[ $ginfo = *"behind"* ]] && echo "WARNING: git pull needed, then re-run this script" && exit 1
    [[ $ginfo != *"origin/master"* ]] && git branch --set-upstream-to origin/master; # ensure git always pulls from origin master on this branch
    [[ $( git config push.default ) != current ]] && git config push.default current;
    echo "git configuration set to pull from origin master into ${branchName}";

    if [[ $(command -v pipenv) ]] && [[ $PIPENV_ACTIVE != 1 ]]; then
      echo ""
      echo "starting pipenv shell."
      echo "If torch is already installed, you're good to go."
      echo "Otherwise, run setup one more time."
      echo ""
      pipenv shell;
    else
      install_torch
    fi
  fi
fi
