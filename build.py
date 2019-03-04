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

# Customizations
opdirs['test']['mobile']=lambda dir,*a,**kw:run(['./node_modules/.bin/jest'],cwd=SRC/dir)


# main fn (called at bottom)

def main():
  ensure_min_dev_versions()
  if len(argv)==1:
    print(f"Usage: ./build.py [{'|'.join(default_ops.keys())}] [{','.join(SRC_DIRS)},...]");
  else:
    dirnames = SRC_DIRS if (len(argv)==2 or argv[2]=='all') else argv[2].split(',');
    for dir in dirnames: opdirs[argv[1]][dir](dir,*(argv[3:]));


# UTILS
def ensure_min_dev_versions(name='node',min_version="11.10.0",flag='--version'):
  """hacky way of ensuring sufficient package versions - simpler than setting up everyone with a shared venv for the moment"""
  from subprocess import Popen,PIPE
  from distutils.version import StrictVersion as V
  from re import sub
  from os import environ
  if environ.get('CI'):
    return;
  packages = (
    ('node','11.10.0',"NodeJS needs update. See https://github.com/a-laughlin/3308proj/blob/master/src/mobile/README.md"),
    ('python3','3.7.2',"Python 3 needs update. Please update your python3 version to 3.7.2 or greater"),
    ('expo','2.10.1',"Expo needs update. See https://github.com/a-laughlin/3308proj/blob/master/src/mobile/README.md")
  )
  for (n, v,msg) in packages:
    try:
      installed = sub(r'[^0-9.]','',Popen([name,'--version'], stdout=PIPE, stderr=PIPE).communicate()[0][1:-1].decode("utf-8"))
      if V(installed) < V(min_version): raise Exception(msg)
    except:
      raise Exception(msg)

if __name__ == '__main__':
  main();
