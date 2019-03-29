#!/usr/bin/env python3

import os
import numpy as np
import torch
import unittest

import ml_utils

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

        cls.trainY = torch.Tensor(y_train).view(-1,1)
        cls.testY = torch.Tensor(y_test).view(-1,1)

        # Train a model and save it
        cls.trained_model = ml_utils.train(cls.trainY, epochs = 300)

        cls.output_file = 'model_test.pt'
        ml_utils.saveModel(cls.trained_model, cls.output_file)

    @classmethod
    def tearDownClass(cls):
        if os.path.exists(cls.output_file):
            os.remove(cls.output_file)

    def test_train(self):
        self.assertTrue(self.trained_model.trained == True)

    def test_goodModelFileName(self):

        files = ['somethingpt', '.pt', "", "pt", "good.pt", self.output_file]

        expectedVals = [0, 0, 0, 0, 1, 1]
        actualVals = list(map(ml_utils.goodModelFileName, files))

        self.assertEqual(actualVals, expectedVals)

    def test_saveModel(self):
        self.assertTrue(os.path.exists(self.output_file))

    def test_loadModel(self):
        loaded_model = ml_utils.loadModel(self.output_file)

        # Check to see if the loaded model has the same parameters
        for i, (p1, p2) in enumerate(zip(loaded_model.parameters(), self.trained_model.parameters())):
            self.assertLessEqual(p1.data.ne(p2.data).sum(), 0)

    def test_predict(self):
        predY = ml_utils.predict(self.trained_model, self.trainY, self.nfuture)
        np.testing.assert_almost_equal(predY.tolist(), self.testY.tolist(), 2)


if __name__ == '__main__':
    unittest.main()
