#!/usr/bin/env python3

from sys import argv
from shutil import copytree,rmtree
from unittest import TextTestRunner as TR, TestLoader as TL
from pathlib import Path
from subprocess import run

ROOT, SRC, BUILD, SAMPLE_DATA = [Path()/d for d in ',src,build,sample_data'.split(',')]
SRC_DIRS = 'ml', 'api', 'mobile'

default_ops = dict(
  clean=lambda dir,*a,**kw: rmtree(BUILD/dir, *a, ignore_errors=True, **kw),
  test=lambda dir,*a,**kw: TR().run(TL().discover(SRC/dir, *a, pattern='*test.py', **kw)),
  build=lambda dir,*a,**kw: copytree(SRC/dir, BUILD/dir, *a, **kw))

opdirs = {op:{d:default_ops[op] for d in SRC_DIRS } for op in default_ops.keys()}
opdirs['test']['mobile']=lambda dir,*a,**kw:run(['./node_modules/.bin/jest'],cwd=SRC/dir)

if __name__ == '__main__':
  if(len(argv)==1):
    print(f"Usage: ./build.py [{'|'.join(default_ops.keys())}] [{','.join(SRC_DIRS)},...]")
  else:
    dirnames = SRC_DIRS if (len(argv)==2 or argv[2]=='all') else argv[2].split(',');
    print("dirnames",dirnames)
    for dir in dirnames: opdirs[argv[1]][dir](dir,*(argv[3:]));
