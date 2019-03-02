#!/usr/bin/env python3
from json import loads

def predict(input):
  try:
    data = loads(input)
  except Exception as e:
    return '["invalid_json"]'

  return "[1,2,3,4,5]"
