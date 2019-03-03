import unittest
from predict import predict
from json import loads
class TestSomeFn(unittest.TestCase):

  def setUp(self):
    self.valid_ml_input = '{"heartrate":[1,2,3]}'

  def tearDown(self):
    del self.valid_ml_input

  def test_returns_string(self):
    self.assertEqual(type(predict(self.valid_ml_input)),str,msg="valid input should return a string")

  def test_invalid_returns_string(self):
    self.assertEqual(predict('artrate":[1,2,3]}'), '["invalid_json"]')

  def test_returns_correct_shape(self):
    self.assertEqual(type(loads(predict(self.valid_ml_input))), list)

if __name__ == '__main__':
    unittest.main()
