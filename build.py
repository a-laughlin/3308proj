#!usr/bin/python

# params used by step functions
SRC_DIR = './src/'
BUILD_DIR = './build/'

# these are process functions - they only define the order that the other "step" functions should be called in


def build_all_sequence(src=SRC_DIR,bld=BUILD_DIR):
  clean(bld)
  copy_src_to_build(src,bld)
  build_mobile()
  build_api()
  build_ml()
  build_dpipe()
  replace_secrets(bld)

def build_dev_sequence(src=SRC_DIR,bld=BUILD_DIR):
  clean(bld)
  copy_src_to_build(src,bld)
  replace_secrets(bld=BUILD_DIR)

def build_ci_sequence(src=SRC_DIR,bld=BUILD_DIR):
  clean(bld)
  copy_src_to_build(src,bld)
  replace_secrets(bld)






# Individual build sequence steps.
# Each should be standalone and do only one thing.

from shutil import copytree,rmtree,copy


def clean(dir=BUILD_DIR): rmtree(dir, ignore_errors=True);

def copy_src_to_build(src=SRC_DIR,bld=BUILD_DIR): copytree(src,bld);

def replace_secrets(bld=BUILD_DIR):
  from secrets import TRAVIS_INTEGRATION_KEY as TK;
  from re import sub,MULTILINE;
  replacer = lambda file_str:sub(r'TRAVIS_INTEGRATION_KEY', TK, file_str, flags=MULTILINE)
  update_file_contents_in_place(bld+'travis.yml', replacer);




# step utils
identity = lambda x:x
def update_file_contents_in_place(filepath='foo.txt', updater=identity):
  with open(filepath, 'r') as file :
    filedata = file.read(); # Read in the file
  filedata = updater(filedata);
  with open(filepath, 'w') as file:
    file.write(filedata); # Write the file out again

    
def build_mobile():
  pass
def build_api():
  pass
def build_ml():
  pass
def build_dpipe():
  pass
