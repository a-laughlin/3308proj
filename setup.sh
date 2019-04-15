#!/bin/bash
if [[ $SHELL != *bash ]];then
  echo "Bash shell required for installation.";
elif [[ ! -f "./setup.sh" ]]; then
  echo "Must be in project root directory before running script";
elif [[ ! $(command -v yarn) ]]; then
  # yarn installs the latest version of nodejs. We use nvm and node 10.15.3, but any version after that should work
  echo "install yarn (https://yarnpkg.com/lang/en/docs/install/)";
elif [[ $(python3 --version) != *3.7.* ]]; then
  # ensure correct python version.  Recommend running in a python virtual environment
  echo "ensure python3 points to a version of python 3.7.x";
elif ([[ $(command -v pipenv) ]] && [[ $PIPENV_ACTIVE != 1 ]] && [[ ! $CI ]] && [[ ! $DYNO ]]); then
  # on dev with pipenv installed, run shell before installations
  pipenv shell;
else
  # install API dependencies
  builtin cd src/api && yarn && builtin cd -; # install api dependencies

  # install web ui dependencies
  builtin cd src/web && yarn && builtin cd -; # install api dependencies

  # install torch ml dependencies
  if [[ $((python3 -c "import torch") 2>&1 | xargs echo) ]]; then
    # use smaller cpu-only pytorch version (gpu support adds 520mb!)
    # per https://github.com/pytorch/pytorch/issues/4178#issuecomment-356709106
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

    if [[ $_ != $0 ]]; then
      echo "WARNING: run with '. setup.sh' or 'source setup.sh' to set aliases"
    else
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

      echo "";
      echo "3308 Project aliases set";
      echo "git    :    ppull ppush";
      echo "navigation: cdroot cdapi cdml cdweb";
      echo "testing:    testroot testapi testml testweb";
      echo "running:    runapi starts the graphql server on localhost:4000";
      echo "running:    runweb calls runapi and starts the web server on localhost:4000";
      echo "stopping:   ctrl+c cancels runapi and runweb";
    fi
  fi
fi
