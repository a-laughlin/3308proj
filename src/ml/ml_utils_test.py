#!/usr/bin/env python3

import json
import os
import numpy as np
import torch
import unittest

import ml_utils
import Models

class ml_utils_test(unittest.TestCase):

    @classmethod
    def setUpClass(cls):

        # Number of points to train and test
        cls.npoints = 100
        cls.nfuture = 20

        # Setup data used for model
        x = np.linspace(0, 10*np.pi, cls.npoints + cls.nfuture)
        y = np.sin(x)

        y_train, y_test = y[:cls.npoints], y[cls.npoints-1:]

        cls.trainY = y_train
        cls.testY = y_test

        cls.input_file = 'input_test.json'

        if os.path.exists(cls.input_file):
            os.remove(cls.input_file)

        with open(cls.input_file, 'w') as f:
            json.dump(list(cls.trainY), f)

        cls.model = Models.RNN(1, 32, 1)
        cls.output_file = 'model_test.pt'

        if os.path.exists(cls.output_file):
            os.remove(cls.output_file)

        ml_utils.train(cls.model, ml_utils.parse_input_list(y_train),
                        lr = 0.003, epochs = 300, teacher_forcing_ratio = 1, verbose = False)

        ml_utils.saveModel(cls.model, cls.output_file)

    @classmethod
    def tearDownClass(cls):
        if os.path.exists(cls.output_file):
            os.remove(cls.output_file)

        if os.path.exists(cls.input_file):
            os.remove(cls.input_file)

    def test_train(self):
        self.assertTrue(self.model.trained == True)

    def test_goodModelFileName(self):

        files = ['somethingpt', '.pt', "", "pt", "good.pt", self.output_file]

        expectedVals = [0, 0, 0, 0, 1, 1]
        actualVals = list(map(ml_utils.goodModelFileName, files))

        self.assertEqual(actualVals, expectedVals)

    def test_goodInputFileName(self):

        files = ['somethingjson', '.json', "", "json", "good.json", self.input_file]

        expectedVals = [0, 0, 0, 0, 1, 1]
        actualVals = list(map(ml_utils.goodInputFileName, files))

        self.assertEqual(actualVals, expectedVals)

    def test_parse_input_list(self):

        expectedParsedList = torch.Tensor(self.trainY).view(-1, 1)
        returnedParsedList = ml_utils.parse_input_list(self.trainY)

        self.assertTrue(torch.all(expectedParsedList.eq(returnedParsedList)))

    def test_parse_input_file(self):

        expectedParsedFile = torch.Tensor(self.trainY).view(-1, 1)
        returnedParsedFile = ml_utils.parse_input_file(self.input_file)

        self.assertTrue(torch.all(expectedParsedFile.eq(returnedParsedFile)))

    def test_saveModel(self):
        self.assertTrue(os.path.exists(self.output_file))

    def test_loadModel(self):
        loaded_model = ml_utils.loadModel(self.output_file)

        # Check to see if the loaded model has the same parameters
        for i, (p1, p2) in enumerate(zip(loaded_model.parameters(), self.model.parameters())):
            self.assertLessEqual(p1.data.ne(p2.data).sum(), 0)

    def test_predict(self):


        predY = ml_utils.predict(self.model, ml_utils.parse_input_list(self.trainY), self.nfuture)
        np.testing.assert_almost_equal(torch.flatten(predY).tolist(), self.testY, 1)


if __name__ == '__main__':
    unittest.main()
