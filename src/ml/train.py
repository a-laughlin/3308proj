import ml_utils
import Models

if __name__ == '__main__':

    train_array_file = '../api/sample_data/ml_input_foo.json'
    output_model_file = '../api/sample_data/ml_model_foo.pt'

    y = ml_utils.parse_input_file(train_array_file)

    input_dimension = 1
    hidden_dimension = 32
    output_dimension = 1

    model = Models.RNN(input_dimension, hidden_dimension, output_dimension)

    ml_utils.train(model, y, lr = 0.001, epochs = 500, teacher_forcing_ratio = 1, verbose = True)
    ml_utils.saveModel(model, output_model_file)
