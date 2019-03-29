import json
import numpy as np
import torch

import ml_utils
import RNN

if __name__ == '__main__':

    train_array_file = '../web/src/sample_data/ml_input_foo.json'
    output_model_file = '../web/src/sample_data/ml_model_foo.pt'

    y = ml_utils.parse_input_file(train_array_file)

    model = ml_utils.train(y)
    ml_utils.saveModel(model, output_model_file)
