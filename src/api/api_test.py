#!/usr/bin/env python3

import unittest
from api import one

class TestSomeFn(unittest.TestCase):
  def setUp(self):
    pass
  def tearDown(self):
    pass
  def test_returns_string(self):
    self.assertEqual(one(),1)

if __name__ == '__main__':
    unittest.main()
