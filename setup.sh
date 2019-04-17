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
elif ([[ $(command -v pipenv) ]] && [[ $PIPENV_ACTIVE != 1 ]] && [[ ! $CI ]] && [[ ! $DYNO ]]); then
  # on dev with pipenv installed, run shell before installations
  echo "Starting pipenv shell..."
  echo "NEXT STEP! re-run '. setup.sh' inside pipenv shell"
  pipenv shell;
elif [[ $(python3 --version) != *3.7.* ]]; then
  # ensure correct python version.  Recommend running in a python virtual environment
  echo "NEXT STEP! ensure python3 points to a version of python 3.7.x";
  echo "           then re-run '. setup.sh'";
else
  # install API dependencies
  builtin cd src/api && yarn && builtin cd -; # install api dependencies

  # install web ui dependencies
  builtin cd src/web && yarn && builtin cd -; # install api dependencies

  # install torch ml dependencies
  if [[ $((python3 -c "import torch") 2>&1 | xargs echo) ]]; then
    # use smaller cpu-only pytorch version (gpu support adds 520mb!)
    # per https://github.com/pytorch/pytorch/issues/4178#issuecomment-356709106
    # note, using pip3 to intall torch, even in pipenv, since pipenv had issues installing wheels directly
    pip3 install --progress-bar off -- https://download.pytorch.org/whl/cpu/torch-1.0.1.post2-cp37-cp37m-linux_x86_64.whl;
  fi


  if [[ $CI ]]; then # continuous integration server
    echo "running on CI"
  elif [[ $DYNO ]]; then # heroku
    echo "running on heroku"
  else #dev
    # git configuration

    ginfo=$(git status -sb | head -n1) # outputs ## <branchname>...origin/master [ahead 3]
    [[ $ginfo = *"master..."* ]] && echo "WARNING: on master branch - create a new branch like 'git checkout -b $USER' and re-run this script" && exit 1;
    [[ $ginfo = *"behind"* ]] && echo "WARNING: git pull needed, then re-run this script" && exit 1
    [[ $ginfo != *"origin/master"* ]] && git branch --set-upstream-to origin/master; # ensure git always pulls from origin master on this branch
    [[ $( git config push.default ) != current ]] && git config push.default current;

    # set up aliases for convenience
    alias cdroot="builtin cd $PWD";
    alias cdapi="builtin cd $PWD/src/api";
    alias cdml="builtin cd $PWD/src/ml";
    alias cdweb="builtin cd $PWD/src/web/src";

    alias testroot='cdroot && python3 build.py test';
    alias testapi='cdroot && python3 build.py test api';
    alias testml='cdroot && python3 build.py test ml';
    alias testweb='cdroot && python3 build.py test web';

    alias runapi='(cdapi && yarn start)';
    # ml doesn't start a server
    alias runweb='(trap "kill 0" SIGINT; (cdweb && yarn start) & runapi)';

    alias ppull='cdroot && git pull';
    alias ppush='cdroot && [[ "$(git pull)" = "Already up to date." ]] && testroot && git push && open "https://github.com/a-laughlin/3308proj/pull/new/$(git rev-parse --abbrev-ref HEAD)"';

    if [[ $(command -v cdroot) ]]; then
      echo "";
      echo "3308 Project aliases set";
      echo "git    :    ppull ppush";
      echo "navigation: cdroot cdapi cdml cdweb";
      echo "testing:    testroot testapi testml testweb";
      echo "running:    runapi starts the graphql server on localhost:4000";
      echo "running:    runweb calls runapi and starts the web server on localhost:4000";
      echo "stopping:   ctrl+c cancels runapi and runweb";
    else
      echo "WARNING: pipenv likely ran in a subshell instead of a user shell, so aliases not set."
      echo "NEXT STEP! run setup with '. setup.sh' or 'source setup.sh' to set aliases correctly"
    fi
  fi
fi
