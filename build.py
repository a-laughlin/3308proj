#!/usr/bin/env python3

from sys import argv
from shutil import copytree,rmtree
from unittest import TextTestRunner as TR, TestLoader as TL


SRC_DIR = './src'
BUILD_DIR = './build'
SAMPLE_DATA_DIR = './sample_data'
DIRS = ['ml','api','mobile']


OPS = ['test','build','clean']
default_ops = dict(
  clean=lambda dir,*a,**kw: rmtree(f"{BUILD_DIR}/{dir}", *a, ignore_errors=True, **kw),
  test=lambda dir,*a,**kw: TR().run(TL().discover(f"{SRC_DIR}/{dir}/.", pattern='*test.py',**kw)),
  build=lambda dir,*a,**kw: copytree(f"{SRC_DIR}/{dir}",f"{BUILD_DIR}/{dir}",*a,**kw))

cmds = {op:{d:default_ops[op] for d in DIRS } for op in OPS}

# INSERT CUSTOM OPS HERE


if __name__ == '__main__':
  if(len(argv)==1):
    print(f"Usage: ./build.py [{'|'.join(OPS)}] [{'|'.join(DIRS)},]")
  else:
    dirnames = DIRS if (len(argv)==2 or argv[2]=='all') else argv[2].split(',');
    for dir in dirnames: cmds[argv[1]][dir](dir,*(argv[3:]));
