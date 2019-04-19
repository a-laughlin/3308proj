import argparse
import json
import sys
import ml_utils


if __name__ == '__main__':

    parser = argparse.ArgumentParser(description = "Predict future heartbeats given a previous window of data, and future timesteps to predict")

    parser.add_argument('--future', type=int,
                        default = 50,
                        help = "Future timesteps to predict: default = 50")

    parser.add_argument('--input', type=str,
                        default = '[1,2,3,4,5,6]',
                        help = "List of ints: default = [1,2,3,4,5,6]")

    parser.add_argument('--model', type=str,
                        default = '../api/sample_data/ml_model_foo.pt',
                        help = 'Location of trained model: default = ../api/sample_data/ml_model_foo.pt')

    args = parser.parse_args()

    input_model_file = args.model
    assert(ml_utils.goodModelFileName(input_model_file) == 1)
    model = ml_utils.loadModel(input_model_file)

    future_timesteps = args.future

    input_list = ml_utils.parse_input_list(json.loads(args.input))

    prediction = ml_utils.predict(model, input_list, future_timesteps)

    output = json.dumps(prediction.numpy().astype(int).flatten().tolist())
    sys.stdout.write(output)
    sys.stdout.flush()
    sys.exit(0)
    # with open(output_file, 'w') as f:
    #     json.dump(output, f)
