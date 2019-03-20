#!/usr/bin/env python3

from sys import argv,exit
from shutil import copytree,rmtree
from unittest import TextTestRunner as TR, TestLoader as TL
from pathlib import Path
from subprocess import run

ROOT, SRC, BUILD = [Path()/d for d in ',src,build'.split(',')]
SRC_DIRS = 'ml', 'api', 'web'

def runTest(dir):
  TestRunner = TR()
  print("\n---Testing : "+dir.upper())
  result = TestRunner.run(TL().discover(SRC/dir, pattern='*test.py'))
  if(len(result.errors) + len(result.failures)): exit(1);

default_ops = dict(
  clean=lambda dir,*a,**kw: rmtree(BUILD/dir, *a, ignore_errors=True, **kw),
  test=runTest,
  build=lambda dir,*a,**kw: copytree(SRC/dir, BUILD/dir, *a, **kw))

opdirs = {op:{d:default_ops[op] for d in SRC_DIRS } for op in default_ops.keys()}

# Customizations
opdirs['test']['web']=lambda dir:run(['yarn','test','--no-watch'],cwd=SRC/dir) or exit(1)

if __name__ == '__main__':
  if len(argv)==1:
    print(f"Usage: ./build.py [{'|'.join(default_ops.keys())}] [{','.join(SRC_DIRS)},...]");
  else:
    dirnames = SRC_DIRS if (len(argv)==2 or argv[2]=='all') else argv[2].split(',');
    for dir in dirnames: opdirs[argv[1]][dir](dir,*(argv[3:]));

exit(0)
