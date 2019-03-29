import argparse
import json

import ml_utils


if __name__ == '__main__':

    parser = argparse.ArgumentParser(description = "Predict future heartbeats given a previous window of data, and future timesteps to predict")
    parser.add_argument('--input', type=str,
                        default = '../web/src/sample_data/ml_input_foo.json',
                        help = "Input file name containing window of data")

    parser.add_argument('--future', type=int,
                        default = 50,
                        help = "Future timesteps to predict")

    parser.add_argument('--model', type=str,
                        default = '../web/src/sample_data/ml_model_foo.pt',
                        help = 'Location of trained model')

    parser.add_argument('--output', type=str,
                        default = '../web/src/sample_data/ml_output_foo.json',
                        help = 'Output filename containing prediction')

    args = parser.parse_args()

    input_model_file = args.model
    input_array_file = args.input

    output_file = args.output

    future_timesteps = args.future

    assert(ml_utils.goodModelFileName(input_model_file) == 1)
    assert(ml_utils.goodInputFileName(input_array_file) == 1)

    input_array = ml_utils.parse_input_file(input_array_file)

    model = ml_utils.loadModel(input_model_file)

    prediction = ml_utils.predict(model, input_array, future_timesteps)

    output = prediction.numpy().flatten().tolist()

    with open(output_file, 'w') as f:
        json.dump(output, f)
